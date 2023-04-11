import { useState, useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Select,
    Row,
    Col
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';

const { Option } = Select;

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

const Signup = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [api, setAPI] = useState([]);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        const saveUser = async () => {
            try {
                const response = await axios.post(
                    "https://"+api+".execute-api.us-east-1.amazonaws.com/Prod/SignUpProject", values
                )
                console.log(response)
                if (response.data.statusCode === 400) {
                    setErrors(response.data.result)
                }
                if (response.data.statusCode === 200) {
                    console.log(values?.email)
                    navigate('/verify', { state: { emailID: values?.email } })

                }

            } catch (e) {
                console.log(e)
                console.log(e.response.status)
            }
        };
        saveUser();

    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="+1">+1</Option>
            </Select>
        </Form.Item>
    );

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
                setAPI(ans.Deployment)
            }
        });
    };
    useEffect(() => {
        callSM();
    }, [])

    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col>
                <div>
                <h2 className = "sign-login-style"> Sign up </h2>
                    {errors && <h2> {errors} </h2>}
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        initialValues={{
                            prefix: '+1',
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        scrollToFirstError
                    >

                        <Form.Item
                            name="bannerID"
                            label="Banner ID"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your banner id!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your first name!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your last name!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                                    message: 'Password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input
                                addonBefore={prefixSelector}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                        <p role = "presentation" className = "text-link " style={{ textAlign: 'right' }} onClick = {() => navigate('/login')}>
                            <Form.Item>
                                Already a user? Login here!!!
                            </Form.Item>
                        </p>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};
export default Signup;