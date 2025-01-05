import { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const ChildrenTransfer = ({ isVisible, onClose, child, onTransferSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("childId", child?.id || "");
      formData.append("fromHouseId", child?.houseId || "");
      formData.append("toHouseId", values.toHouseId?.trim() || "");
      formData.append("requestReason", values.requestReason?.trim() || "");
      formData.append("status", "Pending");

      await axios.post(
        "https://soschildrenvillage.azurewebsites.net/api/TransferRequest/CreateTransferRequest",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Transfer request created successfully");

      if (onTransferSuccess) {
        onTransferSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error creating transfer request:", error);
      message.error("Failed to create transfer request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Transfer Request"
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="toHouseId"
          label="To House ID"
          rules={[{ required: true, message: "Please enter To House ID" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="requestReason"
          label="Request Reason"
          rules={[{ required: true, message: "Please enter the reason" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ChildrenTransfer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  child: PropTypes.object,
  onTransferSuccess: PropTypes.func,
};

export default ChildrenTransfer;
