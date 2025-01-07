import { useState } from "react";
import { Modal, Form, Input, message, Descriptions } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const ChildrenTransfer = ({ isVisible, onClose, child, onTransferSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Get user information from localStorage
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validate if child exists
      if (!child?.id || !child?.houseId) {
        message.error("Child information is missing");
        return;
      }

      // Validate if trying to transfer to the same house
      if (child.houseId === values.toHouseId?.trim()) {
        message.error("Cannot transfer child to the same house");
        return;
      }

      const formData = new FormData();
      formData.append("childId", child.id);
      formData.append("fromHouseId", child.houseId);
      formData.append("toHouseId", values.toHouseId?.trim());
      formData.append("requestReason", values.requestReason?.trim());
      formData.append("status", "Pending");
      formData.append("createdBy", userId);
      formData.append("createdDate", new Date().toISOString());

      await axios.post(
        "https://soschildrenvillage.azurewebsites.net/api/TransferRequest/CreateTransferRequest",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Transfer request created successfully");
      form.resetFields();

      if (onTransferSuccess) {
        onTransferSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error creating transfer request:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to create transfer request");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Create Transfer Request"
      open={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      maskClosable={false}
    >
      <div style={{ marginBottom: "24px" }}>
        <Descriptions
          title="Child Information"
          bordered
          size="small"
          column={1}
        >
          <Descriptions.Item label="Child ID">
            {child?.id || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Current House">
            {child?.houseId || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Requested By">
            {userName || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Form 
        form={form} 
        layout="vertical"
        initialValues={{
          childId: child?.id,
          fromHouseId: child?.houseId,
        }}
      >
        <Form.Item
          name="toHouseId"
          label="To House ID"
          rules={[
            { required: true, message: "Please enter To House ID" },
            {
              validator: (_, value) => {
                if (value && value.trim() === child?.houseId) {
                  return Promise.reject("Cannot transfer to the same house");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter destination house ID" />
        </Form.Item>

        <Form.Item
          name="requestReason"
          label="Request Reason"
          rules={[
            { required: true, message: "Please enter the reason" },
            //{ min: 10, message: "Reason must be at least 10 characters long" },
          ]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter the reason for transfer request"
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ChildrenTransfer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  child: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    houseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  onTransferSuccess: PropTypes.func,
};

export default ChildrenTransfer;
