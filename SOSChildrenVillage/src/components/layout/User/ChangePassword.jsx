import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (values) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      message.error('User not logged in. Redirecting to login...');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `https://localhost:7073/api/UserAccount/ChangePassword/${userId}`,
        {
          password: values.password,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Password changed successfully!');
        navigate('/userdetails');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title="Change Password"
        bordered={false}
        style={{
          maxWidth: '500px',
          margin: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <Form
          name="change-password"
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ textAlign: 'left' }}
        >
          <Form.Item
            label="Current Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your current password!' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please enter your new password!' }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
