import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;

const EditUserDetail = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [imgs, setImgs] = useState([]); // For handling uploaded image

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (!token || !userId) {
      message.error('User not logged in. Redirecting to login...');
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7073/api/UserAccount/GetUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUserInfo(response.data);
        } else {
          message.error('No user information found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        message.error('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Handle image upload (keeping it as it was)
  const handleImageUpload = (file) => {
    setImgs(file); // Set selected image file
    return false; // Prevent default upload behavior
  };

  // Handle form submission
  const onFinish = async (values) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    const formData = new FormData();
    formData.append('Id', userId); // Include userId
    formData.append('UserName', values.userName);
    formData.append('UserEmail', values.userEmail);
    formData.append('Phone', values.phone);
    formData.append('Address', values.address);
    formData.append('Dob', values.dob ? values.dob.format('YYYY-MM-DD') : null); // Date formatted as string
    formData.append('Gender', values.gender);
    formData.append('Country', values.country);
    formData.append('RoleId', 2); // Default RoleId
    formData.append('Status', 'Active'); // Default status
    formData.append('Password', values.password || ''); // Optional password field

    // Handle image upload (if an image is selected)
    if (imgs && imgs.length > 0) {
      formData.append('Img', imgs[0]); // Assuming only one image file is uploaded
    }

    try {
      const response = await axios.put(
        `https://localhost:7073/api/UserAccount/UpdateUser?id=${userId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        message.success('Profile updated successfully!');
        navigate('/userdetail'); // Redirect back to the profile page
      } else {
        message.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      message.error('Failed to update profile.');
    }
  };

  if (!userInfo) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Title level={3}>Edit Profile</Title>
      <Form
        name="editProfile"
        onFinish={onFinish}
        initialValues={{
          userName: userInfo.userName,
          userEmail: userInfo.userEmail,
          phone: userInfo.phone,
          address: userInfo.address,
          dob: userInfo.dob ? moment(userInfo.dob) : null,
          gender: userInfo.gender,
          country: userInfo.country,
        }}
        layout="vertical"
      >
        <Form.Item label="Username" name="userName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="userEmail" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Date of Birth" name="dob">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Gender" name="gender">
          <Select>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Country" name="country">
          <Input />
        </Form.Item>

        {/* Password Field */}
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        {/* Profile Image Upload Field */}
        <Form.Item name="Img" label="Profile Image">
          <Upload beforeUpload={handleImageUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserDetail;
