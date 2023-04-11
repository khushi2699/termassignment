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
                    "https://"+api+".execute-api.us-east-1.amazonaws.com/Prod/LoginProject", values)
                if (response.data.statusCode === 200) {
                    setErrors(null)
                    console.log(response.data.jwt_token.AuthenticationResult.AccessToken)
                    localStorage.setItem('jwt_token', response.data.jwt_token.AuthenticationResult.AccessToken)
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
            accessKeyId: 'ASIA5YPJNP3BFHS7532B',
            secretAccessKey: 'nQJ7O2ebv3FVRejfD9wPZpRotgiNkOlBQW7JndKL',
            sessionToken: 'FwoGZXIvYXdzEMf//////////wEaDLzPDmhdXmfDP2DfNSLAASZcpIjOPWptM4QpcVV90BCKHdhTmOQE076nVeYEjnOSsyDV0y5fpEhCm1y+/a1lDrU9kUC1gVWQ9dse7Nt3wNPFn03u8KnqbjGZokAoKOkyQfjT9YyDsNammXtFclPz29AJ8Q/2ns1iqW0mRUTkwuJFIBN77lPQBO9TeHDHt/rH1gY+ViLutF4nzey44bi1I42iE6iCU+zRf4En4KrJDGN7T68CpfDJ+F6TlykgsirlwxrPNXRUiN+F6hvIeF6vtijL5dOhBjItiYbk1XFuhKNYqzRdRx7DSla5+ldF3Cqlh28x8vBqwXL4M9LA2bFwkliddNS1',
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
                    <h2> Log in </h2>
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