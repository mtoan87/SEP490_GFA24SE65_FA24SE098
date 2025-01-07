import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Layout, Row, Col } from "antd"; // Ant Design components
import background from "../../../assets/images/background.png";
import CallbackPage from '../../../pages/Authenication/Callback'; // Trang callback

const { Content } = Layout;
const GOOGLE_CLIENT_ID = '334049821575-i56alrskjiqp857pn7ceustmbrkvr9aj.apps.googleusercontent.com';

const GoogleAuth = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Layout
        style={{
          minHeight: "100vh", // Ensure the layout takes the full height of the viewport
          background: "rgba(0, 0, 0, 0.5)", // Optional: Apply a dark overlay behind the login form
          backgroundImage: `url(${background})`, // Use the imported image as background
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed", // Optional: Keeps the background fixed
        }}
      >
        <Content style={{ padding: "50px 0" }}>
          <div className="container">
            <div className="login__section--inner" style={{ height: "100%" }}>
              <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
                <Col xs={24} sm={24} md={12} lg={10}>
                <CallbackPage />
                </Col>
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
