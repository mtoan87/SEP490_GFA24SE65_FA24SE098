import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Form, Input, Button, Checkbox, Typography, Divider, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const verifyGoogleToken = async (token) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
      console.log('Token Info:', response.data);
      return response.data; // trả về dữ liệu token info
    } catch (error) {
      console.error('Error verifying token:', error);
      message.error('Failed to verify Google token.');
      return null;
    }
  };


  const fetchLogin = async (email, password) => {
    try {
      const response = await axios.post(
        'https://soschildrenvillage.azurewebsites.net/api/Login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.statusCode === 200) {
        const { data: token, roleId, userId } = response.data;

        console.log('Login Success:', { token, roleId, userId });

        localStorage.setItem('token', token);
        localStorage.setItem('roleId', roleId);
        localStorage.setItem('userId', userId);

        navigate(roleId === '1' ? '/admin' : '/home');
      } else {
        console.log('Login failed:', response.data);
        message.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred during login.');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;

    if (!token) {
      console.error('Google token retrieval failed:', credentialResponse);
      message.error('Failed to retrieve Google token. Please try again.');
      return;
    }

    console.log('Google token retrieved:', token);

    try {
      // Xác minh token với Google
      const tokenInfo = await verifyGoogleToken(token);
      if (!tokenInfo) return; // If no token info, stop here

      // Send token to the backend
      const response = await axios.post(
        'https://soschildrenvillage.azurewebsites.net/api/Login/LoginGoogle',
        { googleToken: token },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Backend response for Google Login:', response.data);

      if (response.data.token) {
        const { token: token, roleId, userAccountId } = response.data;

        console.log('Google Login Success:', { token, roleId, userAccountId });

        // Store the accessToken and userId in localStorage
        localStorage.setItem("token", token);  // Store access token here
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("userId", userAccountId); // Store user ID here
        // Navigate based on user role
        navigate(roleId === '1' ? '/admin' : '/home');
      } else {
        console.log('Google Login failed:', response.data);
        message.error('Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google Login:', error);
      message.error('An error occurred while logging in with Google.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: 'auto',
        padding: '2rem',
        background: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Form onFinish={() => fetchLogin(email, password)} layout="vertical">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3}>Welcome Back</Title>
          <Text type="secondary">Please login to your account</Text>
        </div>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true, message: 'Please enter your email address!' }]}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>

        <Divider>OR</Divider>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.error('Google login component error');
            message.error('Google login failed.');
          }}
        />

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text>
            Do not have an Account?{' '}
            <Button type="link" onClick={() => navigate('/register')}>
              Sign up now
            </Button>
          </Text>
        </div>
        <Form.Item>
          <Button
            type="default"
            block
            onClick={() => navigate('/home')}
            style={{ marginTop: '16px' }}
          >
            Back to Home
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default LoginScreen;
