import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Space, notification } from 'antd';
import './index.css';
import axios from 'axios';
import AWS from 'aws-sdk';

const { Content } = Layout;
let api = null;

const Dashboard = () => {
  const navigate = useNavigate();


  const [posts, setPosts] = useState([]);
  const [userPoolId, setUserPoolId] = useState([]);
  const [clientId, setClientId] = useState([]);

  const notify = () => {
    notification.open({
      message: 'Success!',
      description:
        'We have send you an email with more details of the seller',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.post(
        "https://"+api+".execute-api.us-east-1.amazonaws.com/Prod/GellAllPostsProject", { token })
      console.log(response.data.items)
      if (response.data.statusCode === 400) {
      }
      if (response.data.statusCode === 200) {
        setPosts(response.data.items)
      }

    } catch (e) {
      console.log(e)
      console.log(e.response.status)
    }
  };
  const handleInterest = async (postID) => {
    notify();
    try {
      const token = localStorage.getItem('jwt_token')
      const response = await axios.post("https://"+api+".execute-api.us-east-1.amazonaws.com/Prod/SendEmailProject", { token, postID }
      )
      console.log(response)


    } catch (e) {
      console.log(e)
      console.log(e.response.status)
    }
  };
  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('jwt_token')
      const poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId
      }
      var params = {
        AccessToken: token
      };
      AWS.config.update({
        accessKeyId: 'ASIA5YPJNP3BFHS7532B',
        secretAccessKey: 'nQJ7O2ebv3FVRejfD9wPZpRotgiNkOlBQW7JndKL',
        sessionToken: 'FwoGZXIvYXdzEMf//////////wEaDLzPDmhdXmfDP2DfNSLAASZcpIjOPWptM4QpcVV90BCKHdhTmOQE076nVeYEjnOSsyDV0y5fpEhCm1y+/a1lDrU9kUC1gVWQ9dse7Nt3wNPFn03u8KnqbjGZokAoKOkyQfjT9YyDsNammXtFclPz29AJ8Q/2ns1iqW0mRUTkwuJFIBN77lPQBO9TeHDHt/rH1gY+ViLutF4nzey44bi1I42iE6iCU+zRf4En4KrJDGN7T68CpfDJ+F6TlykgsirlwxrPNXRUiN+F6hvIeF6vtijL5dOhBjItiYbk1XFuhKNYqzRdRx7DSla5+ldF3Cqlh28x8vBqwXL4M9LA2bFwkliddNS1',
        region: 'us-east-1'
      });
      const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
        region: 'us-east-1',
        poolData: poolData
      });
      const data = await cognitoIdentityServiceProvider.globalSignOut(params).promise();
      console.log('User signed out successfully', data);
      localStorage.setItem('jwt_token', "")
      navigate('/login')
    } catch (e) {
      console.log(e)
      console.log(e.response.status)
    }
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
        setUserPoolId(ans.UserPoolID);
        api = ans.Deployment
      }
      loadEvents();
    });
  };

  useEffect(() => {
    callSM();

  }, [])

  return (
    <Layout>
      <React.Fragment>
        <Content>
          <div className="layout-padding">
            <h1> Marketplace</h1>
            <div>
              <Space wrap>
                <Button type="primary" onClick={() => navigate('/addPost')}>Add Post</Button>
              </Space>
              <Space wrap>
                <Button type="primary" onClick={() => navigate('/myPosts')}>My Posts</Button>
              </Space>
              <Space wrap>
                <Button type="primary" onClick={() => handleSignOut()}>Sign Out</Button>
              </Space>
              <h1>All posts</h1>
              {console.log(posts)}
              <div className=" top-boxes full-width horizontal-scroll container">
                {posts.length > 0 ? posts
                  .map((element, index) => (
                    <div className="full-width single-box">
                      <div className="full-width" key={element.postID}>
                        <img className=" center-img" src={element.url} alt="product" />
                        <div className="earning-text full-width">Product: {element.ProductName}</div>
                        <div className="earning-text full-width new-line">Category: {element.category}</div>
                        <div className="earning-text full-width new-line">Price: {element.Price}</div>
                        <div className="earning-text full-width new-line">Description: {element.Description}</div>
                        <Space wrap>
                          <Button type="primary" onClick={() => handleInterest(element.postID)}>Interested </Button>
                        </Space>
                        <Space wrap>
                          {/* {element.issold === "true" ? <h3> Sold </h3> : <Button type="primary" onClick={() => handleSell(element.postID)}>Sold</Button> } */}
                        </Space>
                      </div>

                    </div>
                  )) : <h2> No Posts to show</h2>}

              </div>

            </div>

            {/* <div class="space">
              <h1>Other Events</h1>
              <div className=" top-boxes full-width horizontal-scroll container">
                {events
                  .filter((number, index) => index % 2 == 0)
                  .map((element, index) => (
                    <div className="full-width single-box">
                      <div className="full-width" key={element.id} onClick={() => handleRedirection(element)}>
                        <img className=" center-img" src={element.banner_image} alt="product" />
                        <div className="earning-text full-width">{element.title}</div>
                        <div className="earning-text full-width new-line" >
                          $ {element.price > 0.0 ? element.price : 'Free'}
                        </div>
                        <div className="earning-text full-width new-line">{element.date}</div>
                        <div className="earning-text full-width">{element.city}</div>
                      </div>
                      <div>
                                 <Checkbox style={{padding: "inherit"}} icon={<FavoriteBorder />}
                                           checkedIcon={<Favorite />}
                                           name="checkedH"
                                           onClick={notify1}

                                 />
                                 <Checkbox style={{padding: "inherit", borderSpacing: "2"}} icon={<ShareIcon />}
                                           checkedIcon={<ShareIcon />}
                                           name="checkedH"
                                           onClick={notify2}
                                 />
                               </div>
                    </div>
                  ))}

              </div>
            </div> */}

            {/* {userType != "admin" ? <div>
              {console.log(organizers)}
              <h1>Organizations</h1>
              <div className="top-boxes full-width horizontal-scroll">
                {organizers.map((element, index) => (
                  <div className="full-width single-box">
                    <div className="full-width" key={element.key} onClick={() => handleRedirection_organization(element, true)}>
                      <div className="earning-text full-width">{element.organizationName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div> : null} */}
          </div>
        </Content>
      </React.Fragment>
    </Layout>
  );
};

export default Dashboard;