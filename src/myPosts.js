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
                        <h1 style={{ textAlign: 'center', fontSize: 45, fontFamily: 'Arial' }}> Dal Marketplace</h1>
                        <h1 style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>My posts</h1>                        <div>
                            <div className=" top-boxes full-width width100">
                                {myPosts.length > 0 ? myPosts
                                    .map((element, index) => (
                                        <div className="full-width single-box">
                                            <div key={element.postID}>
                                                <img className=" center-img" src={element.url} alt="product" />
                                                <div className="earning-text">Product: {element.ProductName}</div>
                                                <div className="earning-text">Category: {element.category}</div>
                                                <div className="earning-text">Price: {element.Price}</div>
                                                <div className="earning-text">Description: {element.Description}</div>
                                                <Space wrap>
                                                    <Button type="primary" onClick={() => handleDelete(element.postID)}>Delete</Button>
                                                </Space>
                                                <Space wrap>
                                                    {element.issold === "true" ? <h3> Sold </h3> : <Button type="primary" onClick={() => handleSell(element.postID)}>Sold</Button>}
                                                </Space>
                                            </div>

                                        </div>
                                    )) : <h2 style={{ textAlign: 'center' }}>You have no posts</h2>}

                            </div>

                        </div>

                    </div>
                </Content>
            </React.Fragment>
        </Layout>
    );
};

export default MyPosts;
