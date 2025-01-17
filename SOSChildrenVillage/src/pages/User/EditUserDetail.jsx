import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload, Typography, Space } from 'antd';
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './EditUserDetail.css'; // Import CSS file

const { Title, Text } = Typography;

const EditUserDetail = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const userRole = localStorage.getItem("roleId");

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
          `https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setUserInfo(response.data);

          // Kiểm tra và định dạng danh sách ảnh
          const images = response.data.images?.$values || response.data.images || [];
          const formattedImages = images.map((img, idx) => ({
            uid: idx.toString(),
            name: `Image-${idx}`,
            status: 'done',
            url: img.urlPath, // Sử dụng URL từ API
          }));
          setImageList(formattedImages);
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

  const uploadProps = {
    name: "images",
    multiple: true,
    fileList: imageList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file`);
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      setImageList(info.fileList);
    },
  };

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
      formData.append('RoleId', userRole);
      formData.append('Status', 'Active');

      if (imageList && imageList.length > 0) {
        imageList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("Img", file.originFileObj);
          }
        });
      }

      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach((imageId) => {
          formData.append("ImgToDelete", imageId);
        });
      }

      const response = await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/UserAccount/UserUpdate?id=${userId}`,
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
    <div style={{
      maxWidth: "400px",
      margin: "auto",
      padding: "2rem",
      background: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      marginBottom: "20px",
    }}>
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
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3} style={{ marginBottom: 0 }}>Edit Profile</Title>
          <Text type="secondary">Update your details below</Text>
        </div>

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
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
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

        <Form.Item label="Current Images">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {imageList.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={image.url || URL.createObjectURL(image.originFileObj)}
                  alt={`Current ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                  }}
                  onClick={() => {
                    if (image.url) {
                      setImagesToDelete((prev) => [...prev, image.url]);
                    }
                    setImageList((prev) => prev.filter((_, i) => i !== index));
                    console.log("Images to delete: ", imagesToDelete);
                  }}
                />
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item label="Upload New Images">
          <Upload.Dragger
            multiple
            beforeUpload={(file) => {
              setImageList((prev) => [
                ...prev,
                {
                  uid: file.uid,
                  name: file.name,
                  status: "done",
                  originFileObj: file, // Dùng khi gửi lên server
                },
              ]);
              return false; // Ngăn không tải lên ngay lập tức
            }}
            fileList={[]} // Không hiển thị file list trong Dragger
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to upload</p>
            <p className="ant-upload-hint">
              Support for single or bulk upload. Strictly prohibited from uploading
              company data or other banned files.
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserDetail;
