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
                setClientId(ans.ClientPoolID);
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