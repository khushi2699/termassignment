import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Input,
    Row,
    Col
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import AWS from 'aws-sdk';


const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 11,
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
const ConfirmUser = () => {
    const emailID = useLocation().state.emailID;
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [resendMsg, setResendMsg] = useState([]);
    const [form] = Form.useForm();
    const [userPoolId, setUserPoolId] = useState([]);
    const [clientId, setClientId] = useState([]);
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        var params = {
            ClientId: clientId,
            ConfirmationCode: values?.confirmCode,
            Username: values?.email
        };
        const AWS = require('aws-sdk');
        AWS.config.update({ region: 'us-east-1' });
        const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
        cognitoIdentityServiceProvider.confirmSignUp(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                setErrors(err.message)
            } // an error occurred
            else {
                navigate('/login')
            }
        });
    };
    const resendCode = () => {
        var params = {
            ClientId: clientId,
            Username: emailID
        };
        const AWS = require('aws-sdk');
        AWS.config.update({ region: 'us-east-1' });
        const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
        cognitoIdentityServiceProvider.resendConfirmationCode(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                setErrors(err.message)
            } // an error occurred
            else {
                setResendMsg('Successfully resend verfication code! Pls check your email!')
            }
        });
    };

    const initialValues = {
        email: emailID
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
                setClientId(ans.ClientPoolID);
                setUserPoolId(ans.UserPoolID)
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
                    <h2> Email Verification </h2>
                    {console.log(emailID)}
                    {errors && <h2> {errors}</h2>}
                    {resendMsg && <h2> {resendMsg}</h2>}
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={initialValues}
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
                            name="confirmCode"
                            label="Confirmation Code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your confirmation code',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <h4 role="presentation" onClick={() => resendCode()} className="text-link">Resend Code? </h4>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Confirm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};
export default ConfirmUser;