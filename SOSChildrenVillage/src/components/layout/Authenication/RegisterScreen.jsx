import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, Upload, Typography, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const RegisterScreen = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [img, setImg] = useState(null);

  const handleImageUpload = (file) => {
    setImg(file);
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
    formData.append("Img", img);

    try {
        const response = await axios.post(
          "https://localhost:7073/api/UserAccount/CreateUser",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      
        if (response.status === 200) {
          navigate("/login"); // Redirect after successful registration
        } else {
          console.log("Registration failed:", response);
        }
      } catch (error) {
        console.log("Error registering:", error);
      }      
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "auto",
      padding: "2rem",
      background: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    }}>
      <Form
        form={form}
        onFinish={handleRegister}
        layout="vertical"
        initialValues={{ Gender: "Other" }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3} style={{ marginBottom: 0 }}>Create an Account</Title>
          <Text type="secondary">Please fill in the details below</Text>
        </div>

        <Form.Item name="UserName" label="User Name" rules={[{ required: true }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item name="UserEmail" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item name="Password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item name="Phone" label="Phone Number">
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item name="Address" label="Address">
          <Input placeholder="Enter your address" />
        </Form.Item>

        <Form.Item name="Dob" label="Date of Birth">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="Gender" label="Gender">
          <Select options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Other", value: "Other" },
          ]} />
        </Form.Item>

        <Form.Item name="Country" label="Country">
          <Input placeholder="Enter your country" />
        </Form.Item>

        <Form.Item name="Img" label="Profile Image">
          <Upload beforeUpload={handleImageUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Register
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Text>
            Already have an account? <Button type="link" onClick={() => navigate("/login")}>Login here</Button>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default RegisterScreen;
