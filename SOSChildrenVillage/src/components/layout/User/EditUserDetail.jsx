import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const EditUserDetail = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [imageList, setImageList] = useState([]); // For handling uploaded images

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
          setImageList(response.data.Images || []); // Assuming `Images` is an array of current images
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
    console.log('Form Values:', values);  // Log form values to check the data

    try {
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

      // Handle image uploads
      if (values.image && values.image.fileList && values.image.fileList.length > 0) {
        console.log('Image Files:', values.image.fileList); // Log image files

        // Loop through the fileList and append each file to FormData
        values.image.fileList.forEach(file => {
          console.log('Uploading file:', file);  // Log each file being uploaded
          formData.append('Img', file.originFileObj); // Add each image file
        });
      } else {
        console.log('No images selected.');
      }

      // Log FormData to check what has been appended
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

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
    <div style={{ padding: '20px' }}>
      <Form
        name="editProfile"
        onFinish={onFinish}
        initialValues={{
          userName: userInfo.userName,
          userEmail: userInfo.userEmail,
          phone: userInfo.phone,
          address: userInfo.address,
          dob: userInfo.dob ? moment(userInfo.dob) : null, // Format the date of birth
          gender: userInfo.gender,
          country: userInfo.country,
          image: imageList.map((image) => ({ url: image.UrlPath })), // Add images if available
        }}
      >
        <Form.Item label="Username" name="userName" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="userEmail" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
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

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { min: 8, message: 'Password must be at least 8 characters long!' },
            { required: false, message: 'Please input a new password if you wish to update it!' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* Profile Image Upload Field */}
        <Form.Item
          label="Profile Picture"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList || []} // Make sure fileList is an array
          extra="Upload a profile picture"
        >
          <Upload
            action="/upload" // Replace with your upload endpoint
            listType="picture-card"
            maxCount={5} // Allow multiple images (adjust according to your API requirements)
            showUploadList={{ showRemoveIcon: true }}
            beforeUpload={() => false} // Handle file selection manually
            onChange={({ fileList }) => setImageList(fileList)} // Update the local image list
          >
            {imageList.length < 5 ? <UploadOutlined /> : null} {/* Limit number of images */}
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
