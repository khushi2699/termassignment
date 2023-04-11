import { useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Row,
    Col
} from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
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
const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [api, setAPI] = useState([]);
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        const loginUser = async () => {
            try {
                const response = await axios.post(
                    "https://" + api + ".execute-api.us-east-1.amazonaws.com/Prod/LoginProject", values)
                if (response.data.statusCode === 200) {
                    setErrors(null)
                    const response1 = JSON.parse(response.config.data)
                    console.log(response.data.jwt_token.AuthenticationResult.AccessToken)
                    localStorage.setItem('jwt_token', response.data.jwt_token.AuthenticationResult.AccessToken)
                    localStorage.setItem('email',response1.email)
                    navigate('/dashboard')
                }
                if (response.data.statusCode === 400) {
                    setErrors(response.data.response)
                }
            } catch (e) {
                console.log(e)
                console.log(e.response.status)
            }
        };
        loginUser();
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
                setAPI(ans.Deployment)
            }
        });
        // const sts = new AWS.STS();
        // const params = {
        //     RoleArn: 'arn:aws:iam::945919196866:role/LabRole',
        //     RoleSessionName: 'my-role'
        // };
        // sts.assumeRole(params, function (err, data) {
        //     if (err) console.log(err, err.stack);
        //     else {
        //         const secretsManager = new AWS.SecretsManager({
        //             accessKeyId: 'ASIA5YPJNP3BBBR35QZM',
        //             secretAccessKey: 'C03SzH5PbZJQY/0hGGlvesXUGTxnHM16zeTXn3/b',
        //             sessionToken: 'FwoGZXIvYXdzENP//////////wEaDAKST0uZwrceque/VyLAARkdlaRS8GG07EWCLrDYQdi76VpWUNLk06QGU3evFrPDt4HJtwx+025kqFwjjtL2LbFfzVigkAWeeBOKMogqRpp1RKO6BafxOiJTqsHpOjAUyB0xIM24khjv+Ya0ZhkCtiSPG345ds7zA0QlOiB+QOPG7SWZRWdJuhf6xkaB9aY5vyW6CUR3fu6cY9c7Ua9brsCFeYAs0+XZ76YPuErrd43ltQiskcSIVuk9/d2uu+rR098olVhdsrMoHEv3B/4QCyilrNahBjItI/8XyhVXSBNT5LrttT8hdRauOBbTY+3RIig2i6S/GSnmfDgEKr6QwvA4C+UB',
        //             region: 'us-east-1'
        //         });
        //         secretsManager.getSecretValue({ SecretId: 'CloudSecret' }, function (err, data) {
        //             if (err) {
        //                 console.log('Error retrieving secret value: ', err);
        //             } else {
        //                 console.log('Secret value: ', data.SecretString);
        //                 const ans = JSON.parse(data.SecretString);
        //                 setAPI(ans.Deployment)
        //             }
        //         });

        //         // Use the secretsManager object here
        //     }
        // });

    };

    useEffect(() => {
        callSM();

    }, [])

    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col>
                <div>
                    <h2 className = "sign-login-style"> Log in </h2>
                    {console.log(errors)}
                    {errors && <h2>{errors}</h2>}
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
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>
                        <p role = "presentation" className = "text-link" style={{ textAlign: 'right' }} onClick = {() => navigate('/signup')}>
                            <Form.Item>
                                New User? Sign Up here!!!
                            </Form.Item>
                        </p>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>

                    </Form>
                </div>
            </Col>
        </Row>
    );
};
export default Login;