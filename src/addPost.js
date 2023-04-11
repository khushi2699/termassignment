import {
    Button,
    Form,
    Input,
} from 'antd';
import AWS from 'aws-sdk';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 10,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};




let imageUrl = null;

const AddPost = () => {
    const navigate = useNavigate();

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        sessionToken: process.env.REACT_APP_SESSION_TOKEN,
        region: process.env.REACT_APP_REGION,
        signatureVersion: 'v4',
    });
    const s3 = new AWS.S3();
    const [imageURL, setImageUrl] = useState(null);
    const [getcategory, setCategory] = useState(null);
    const [file, setFile] = useState(null);
    const [api, setAPI] = useState([]);
    const [fieldValues, setFieldValues] = useState({
        productName: null,
        price: null,
        description: null,
        category: null
    });

    const handleChange = (e, name) => {
        setFieldValues(prev => ({
            ...prev,
            [name]: e
        }))
    };

    const callSM = async () => {
        const secretsManager = new AWS.SecretsManager({
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
            sessionToken: process.env.REACT_APP_SESSION_TOKEN,
            region: process.env.REACT_APP_REGION
        });
        secretsManager.getSecretValue({ SecretId: 'CloudSecret' }, function (err, data) {
            if (err) {
                console.log('Error retrieving secret value: ', err);
            } else {
                console.log('Secret value: ', data.SecretString);
                const ans = JSON.parse(data.SecretString);
                setAPI(ans.Deployment);
            }
        });
    };

    useEffect(() => {
        callSM();
    }, [getcategory])

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
    }
    const uploadToS3 = async () => {

        console.log(file)
        if (!file) {
            return;
        }
        const params = {
            Bucket: 'cloudproject2023',
            Key: `${Date.now()}.${file.name}`,
            Body: file
        };
        const { Location } = await s3.upload(params).promise();
        setImageUrl(Location);
        imageUrl = Location;
        console.log('uploading to s3', Location);

    }
    const getCategory = async () => {
        try {
            const response = await axios.post(
                "https://" + api + ".execute-api.us-east-1.amazonaws.com/Prod/GetCategoryProject", { imageUrl }
            )
            console.log(response)
            if (response.data.statusCode === 400) {
            }
            if (response.data.statusCode === 200) {
                setCategory(response.data.result)
                handleChange(response.data.result, "category")
            }

        } catch (e) {
            console.log(e)
            console.log(e.response.status)
        }

    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        const savePost = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                const response = await axios.post(
                    "https://" + api + ".execute-api.us-east-1.amazonaws.com/Prod/AddPostProject", { fieldValues, imageUrl, token })
                console.log(response)
                if (response.data.statusCode === '400') {
                }
                if (response.data.statusCode === '200') {
                    navigate('/dashboard')
                }

            } catch (e) {
                console.log(e)
                console.log(e.response.status)
            }
        };

        savePost();
    };
    // const [form] = Form.useForm();
    const initialValues = {
        category: getcategory
    };
    return (
        <>
            {console.log(fieldValues)}

            <h1 style={{ textAlign: 'center', fontSize: 45, fontFamily: 'Arial' }}> Dal Marketplace</h1>
            <h1 style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>All posts</h1>
                <Form
                    {...formItemLayout}
                    // form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={initialValues}
                    style={{
                        maxWidth: 500,
                        width: "100%",
                        textAlign: 'center'
                    }}
                    scrollToFirstError
                    className='postCSS'
                >
                    <Form.Item
                        name="productName"
                        label="Product Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your product name!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input onChange={(e) => handleChange(e.target.value, "productName")} />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the product price!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input onChange={(e) => handleChange(e.target.value, "price")} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the product description!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <TextArea rows={4} onChange={(e) => handleChange(e.target.value, "description")} />
                    </Form.Item>
                    <Form.Item
                        name="upload"
                        label="Upload"
                        rules={[
                            {
                                required: true,
                                message: 'Please upload a file',
                            },
                        ]}
                    >
                        <input type="file" onChange={handleFileSelect} />
                    </Form.Item>
                    <Form.Item>
                        {file && (
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={uploadToS3}>Upload</button>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item>
                        {imageURL && (
                            <div>
                                <button onClick={getCategory}>Get Category</button>
                            </div>
                        )}
                    </Form.Item>
                    {console.log(getcategory)}
                    <Form.Item
                        // name = "getcategory"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the category!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input onChange={(e) => handleChange(e, "category")} value={getcategory} required />
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
        </>
    );
};
export default AddPost;
