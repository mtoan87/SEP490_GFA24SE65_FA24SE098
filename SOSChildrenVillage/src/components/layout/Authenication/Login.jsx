import React from "react";
import LoginScreen from "../../../pages/Authenication/LoginScreen";
import { Layout, Row, Col } from "antd"; // Ant Design components
import background from "../../../assets/images/background.png";
import { GoogleOAuthProvider } from "@react-oauth/google";

const { Content } = Layout;
const redirectUri = 'https://localhost:5173/callback'; // Đảm bảo URL này khớp với URI đã khai báo trong Google Console
// Replace "YOUR_GOOGLE_CLIENT_ID" with your actual client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "334049821575-i56alrskjiqp857pn7ceustmbrkvr9aj.apps.googleusercontent.com";

export const Login = () => {
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
                  {/* LoginScreen Component */}
                  <LoginScreen redirectUri={redirectUri} />
                </Col>
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </GoogleOAuthProvider>
  );
};

export default Login;
