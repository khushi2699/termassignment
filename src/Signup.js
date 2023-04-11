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
            accessKeyId: 'ASIA5YPJNP3BBBR35QZM',
            secretAccessKey: 'C03SzH5PbZJQY/0hGGlvesXUGTxnHM16zeTXn3/b',
            sessionToken: 'FwoGZXIvYXdzENP//////////wEaDAKST0uZwrceque/VyLAARkdlaRS8GG07EWCLrDYQdi76VpWUNLk06QGU3evFrPDt4HJtwx+025kqFwjjtL2LbFfzVigkAWeeBOKMogqRpp1RKO6BafxOiJTqsHpOjAUyB0xIM24khjv+Ya0ZhkCtiSPG345ds7zA0QlOiB+QOPG7SWZRWdJuhf6xkaB9aY5vyW6CUR3fu6cY9c7Ua9brsCFeYAs0+XZ76YPuErrd43ltQiskcSIVuk9/d2uu+rR098olVhdsrMoHEv3B/4QCyilrNahBjItI/8XyhVXSBNT5LrttT8hdRauOBbTY+3RIig2i6S/GSnmfDgEKr6QwvA4C+UB',
            region: 'us-east-1'
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
                    <h2> Sign Up </h2>
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