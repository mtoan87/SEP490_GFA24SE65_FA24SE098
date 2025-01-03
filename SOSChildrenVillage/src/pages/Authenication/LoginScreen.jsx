import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Space, Divider, message } from "antd";
import { FacebookOutlined, GoogleOutlined, TwitterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchLogin = async (email, password) => {
    try {
      const response = await axios.post(
        "https://soschildrenvillage.azurewebsites.net/api/Login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.statusCode === 200) {
        const token = response.data?.data;
        const roleId = response.data?.roleId;
        const userId = response.data?.userId;

        if (token && roleId) {
          localStorage.setItem("token", token);
          localStorage.setItem("roleId", roleId);
          localStorage.setItem("userId", userId);

          // Navigate based on roleId
          if (roleId === "1") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }
      } else {
        message.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message.error("Unauthorized! Check your email or password.");
            break;
          case 500:
            message.error("Invalid email or password. Please try again.");
            break;
          default:
            message.error("An unexpected error occurred.");
        }
      } else {
        message.error("Network error. Please check your connection.");
      }
    }
  };

  const handleSubmitEvent = async () => {
    if (email.trim() && password.trim()) {
      await fetchLogin(email, password);
    } else {
      message.error("Please enter both email and password.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem",
        background: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Form onFinish={handleSubmitEvent} layout="vertical">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Welcome Back
          </Title>
          <Text type="secondary">Please login to your account</Text>
        </div>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true, message: "Please enter your email address!" }]}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Checkbox>Remember me</Checkbox>
            <Button type="link">Forgot Your Password?</Button>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", padding: "10px 0", borderRadius: "8px" }}
          >
            Login
          </Button>
        </Form.Item>

        {/* <Divider>OR</Divider>

        <Space direction="vertical" style={{ width: "100%", textAlign: "center" }}>
          <Button icon={<FacebookOutlined />} style={{ width: "100%", marginBottom: "8px" }}>
            Login with Facebook
          </Button>
          <Button icon={<GoogleOutlined />} style={{ width: "100%", marginBottom: "8px" }}>
            Login with Google
          </Button>
          <Button icon={<TwitterOutlined />} style={{ width: "100%" }}>
            Login with Twitter
          </Button>
        </Space> */}

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Text>
            Do not have an Account?{" "}
            <Button type="link" onClick={() => navigate("/register")}>
              Sign up now
            </Button>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Link to="/home">
              <Button type="link" style={{ padding: 0 }}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LoginScreen;
