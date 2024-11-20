import LoginScreen from "../../../pages/Authenication/LoginScreen";
import { Layout, Row, Col } from "antd"; // Ant Design components

const { Content } = Layout;

export const Login = () => {
  return (
    <Layout>
      <Content style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="login__section--inner">
            <Row justify="center" align="middle">
              <Col xs={24} sm={24} md={12} lg={10}>
                {/* LoginScreen Component */}
                <LoginScreen />
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
