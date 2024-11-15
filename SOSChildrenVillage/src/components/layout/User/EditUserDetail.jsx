import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const EditUserDetail = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

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
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data) {
          setUserInfo(response.data);
          
          // Ensure that 'images' is an array before mapping
          const images = Array.isArray(response.data.images) ? response.data.images : [];
          
          setImageList(
            images.map((img, idx) => ({
              uid: idx, // Unique identifier
              name: `Image-${idx}`,
              status: 'done', // Already uploaded
              url: img.urlPath,
            }))
          );
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

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const formData = new FormData();
      formData.append('Id', userId);
      formData.append('UserName', values.userName);
      formData.append('UserEmail', values.userEmail);
      formData.append('Phone', values.phone);
      formData.append('Address', values.address);
      formData.append('Dob', values.dob ? values.dob.format('YYYY-MM-DD') : null);
      formData.append('Gender', values.gender);
      formData.append('Country', values.country);
      formData.append('RoleId', 2);
      formData.append('Status', 'Active');
      formData.append('Password', values.password || '');

      // Handle images
      imageList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('Img', file.originFileObj);
        }
      });

      const response = await axios.put(
        `https://localhost:7073/api/UserAccount/UpdateUser?id=${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        message.success('Profile updated successfully!');
        navigate('/userdetail');
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
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
      >
        <Form.Item
          label="Username"
          name="userName"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="userEmail"
          rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Date of Birth" name="dob">
          <DatePicker format="YYYY-MM-DD" />
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

        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item label="Profile Picture" valuePropName="fileList">
          <Upload
            listType="picture-card"
            fileList={imageList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setImageList(fileList)}
          >
            {imageList.length < 5 ? <UploadOutlined /> : null}
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form>
    </div>
  );
};

export default EditUserDetail;
