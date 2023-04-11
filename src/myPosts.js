import React, { useEffect, useState } from 'react';
import { Layout, Button, Space } from 'antd';
import './index.css';
import './index1.css';
import axios from 'axios';
import AWS from 'aws-sdk';

const { Content } = Layout;
let api = null;
const MyPosts = () => {

    const [myPosts, setMyPosts] = useState([]);
    const loadMyEvents = async () => {
        try {
            console.log(api)
            const token = localStorage.getItem("jwt_token");
            const response = await axios.post(
                "https://" + api + ".execute-api.us-east-1.amazonaws.com/Prod/GetMyPostsProject", { token })
            console.log(response)
            if (response.data.statusCode === 400) {
            }
            if (response.data.statusCode === 200) {
                setMyPosts(response.data.items)
            }

        } catch (e) {
            console.log(e)
            console.log(e.response.status)
        }
    };
    const handleDelete = async (postID) => {
        try {
            const response = await axios.post(
                "https://" + api + ".execute-api.us-east-1.amazonaws.com/Prod/DeletePostProject", { postID })
            console.log(response)
            if (response.data.statusCode === 400) {
            }
            if (response.data.statusCode === 200) {
                loadMyEvents();
            }

        } catch (e) {
            console.log(e)
            console.log(e.response.status)
        }
    };
    const handleSell = async (postID) => {
        try {
            const response = await axios.post(
                "https://" + api + ".execute-api.us-east-1.amazonaws.com/Prod/SellPostProject", { postID })
            console.log(response)
            if (response.data.statusCode === 400) {
            }
            if (response.data.statusCode === 200) {
                loadMyEvents();
            }

        } catch (e) {
            console.log(e)
            console.log(e.response.status)
        }
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
                api = ans.Deployment
                loadMyEvents();
            }
        });
    };
    useEffect(() => {
        callSM();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout>
            <React.Fragment>
                <Content>
                    {console.log(myPosts)}
                    <div className="layout-padding">
                        <h1> Marketplace</h1>
                        <div>
                            <h1>My posts</h1>
                            <div className=" top-boxes full-width horizontal-scroll container">
                                {myPosts.length > 0 ? myPosts
                                    .map((element, index) => (
                                        <div className="full-width single-box">
                                            <div className="full-width" key={element.postID}>
                                                <img className=" center-img" src={element.url} alt="product" />
                                                <div className="earning-text full-width">Product: {element.ProductName}</div>
                                                <div className="earning-text full-width new-line">Category: {element.category}</div>
                                                <div className="earning-text full-width new-line">Price: {element.Price}</div>
                                                <div className="earning-text full-width new-line">Description: {element.Description}</div>
                                                <Space wrap>
                                                    <Button type="primary" onClick={() => handleDelete(element.postID)}>Delete</Button>
                                                </Space>
                                                <Space wrap>
                                                    {element.issold === "true" ? <h3> Sold </h3> : <Button type="primary" onClick={() => handleSell(element.postID)}>Sold</Button>}
                                                </Space>
                                            </div>

                                        </div>
                                    )) : <h2>You have no posts</h2>}

                            </div>

                        </div>

                    </div>
                </Content>
            </React.Fragment>
        </Layout>
    );
};

export default MyPosts;
