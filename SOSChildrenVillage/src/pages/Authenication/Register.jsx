import React from "react";
import LoginScreen from "../../components/layout/Authenication/LoginScreen";
import RegisterScreen from "../../components/layout/Authenication/RegisterScreen";
import { Layout, Row, Col } from "antd"; // Ant Design components

const { Content } = Layout;

export const Login = () => {
  return (
    <Layout>
      <Content style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="register__section--inner">
            <Row justify="center" align="middle">
              <Col xs={24} sm={24} md={12} lg={10}>
                {/* LoginScreen Component */}
                <RegisterScreen />
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
