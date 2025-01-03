import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, Upload, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const RegisterScreen = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageList, setImageList] = useState([]);

  const handleImageUpload = (file) => {
    setImageList([file]); // Set uploaded image as the fileList
    return false; // Prevent default upload
  };

  const handleRegister = async (values) => {
    const formData = new FormData();
    formData.append("UserName", values.UserName);
    formData.append("UserEmail", values.UserEmail);
    formData.append("Password", values.Password);
    formData.append("Phone", values.Phone);
    formData.append("Address", values.Address);
    formData.append("Dob", values.Dob.format("YYYY-MM-DD"));
    formData.append("Gender", values.Gender);
    formData.append("Country", values.Country);

    // Upload image
    if (imageList.length > 0 && imageList[0].originFileObj) {
      formData.append("Img", imageList[0].originFileObj);
    }

    try {
      const response = await axios.post(
        "https://soschildrenvillage.azurewebsites.net/api/UserAccount/CreateUser",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        message.success("Registration successful!");

        // Login immediately after successful registration
        try {
          const loginResponse = await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/Login",
            {
              email: values.UserEmail,
              password: values.Password,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          if (loginResponse.status === 200) {
            const token = loginResponse.data?.data;
            const roleId = loginResponse.data?.roleId;
            const userId = loginResponse.data?.userId;

            if (token && roleId) {
              // Save user info to local storage
              localStorage.setItem("token", token);
              localStorage.setItem("roleId", roleId);
              localStorage.setItem("userId", userId);

              // Navigate based on roleId
              roleId === "1" ? navigate("/admin") : navigate("/home");
            }
          } else {
            message.error("Login failed after registration.");
          }
        } catch (error) {
          message.error("Error during login: " + error.message);
        }
      } else {
        message.error("Registration failed.");
      }
    } catch (error) {
      message.error("Error registering: " + error.message);
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
      <Form
        form={form}
        onFinish={handleRegister}
        layout="vertical"
        initialValues={{ Gender: "Other" }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Create an Account
          </Title>
          <Text type="secondary">Please fill in the details below</Text>
        </div>

        <Form.Item name="UserName" label="User Name" rules={[{ required: true }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="UserEmail"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="Password"
          label="Password"
          rules={[
            { required: true, min: 8, message: "Password must be at least 8 characters long" },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="Phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Phone number is required" },
            {
              pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
              message: "Please enter a valid Vietnamese phone number",
            },
          ]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item name="Address" label="Address">
          <Input placeholder="Enter your address" />
        </Form.Item>

        <Form.Item name="Dob" label="Date of Birth">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="Gender" label="Gender">
          <Select
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
          />
        </Form.Item>

        <Form.Item name="Country" label="Country">
          <Input placeholder="Enter your country" />
        </Form.Item>

        {/* Image Upload Section */}
        <Form.Item label="Profile Image" valuePropName="fileList">
          <Upload
            listType="picture-card"
            fileList={imageList}
            beforeUpload={handleImageUpload} // Handle image upload
            onChange={({ fileList }) => setImageList(fileList)} // Update file list
          >
            {imageList.length < 1 ? <UploadOutlined /> : null}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Register
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Text>
            Already have an account?{" "}
            <Button type="link" onClick={() => navigate("/login")}>
              Login here
            </Button>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default RegisterScreen;
