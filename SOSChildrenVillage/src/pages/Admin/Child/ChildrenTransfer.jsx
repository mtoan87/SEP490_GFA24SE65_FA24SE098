import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Descriptions,
  Button,
  Select,
} from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const ChildrenTransfer = ({ isVisible, onClose, child, onTransferSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [houses, setHouses] = useState([]);
  const [currentHouseName, setCurrentHouseName] = useState("");
  const [loadingHouses, setLoadingHouses] = useState(false);

  // Get user information from localStorage
  const userId = localStorage.getItem("userId");
  //const userName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchHouses = async () => {
      setLoadingHouses(true);
      try {
        // Fetch all houses
        const response = await axios.get(
          "https://soschildrenvillage.azurewebsites.net/api/Houses/GetAllHousesWithImg"
        );
        const allHouses = response.data;

        // Find current house name
        const currentHouse = allHouses.find((h) => h.id === child?.houseId);
        if (currentHouse) {
          setCurrentHouseName(currentHouse.houseName);
        }

        // Filter houses with less than 10 members and exclude current house
        const availableHouses = allHouses.filter(
          (house) =>
            house.id !== child?.houseId &&
            house.currentMembers < house.houseMember
        );

        setHouses(availableHouses);
      } catch (error) {
        console.error("Error fetching houses:", error);
        message.error("Failed to fetch houses");
      } finally {
        setLoadingHouses(false);
      }
    };

    if (isVisible && child?.houseId) {
      fetchHouses();
    }
  }, [isVisible, child?.houseId]);

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
      footer={
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleOk} loading={loading}>
            OK
          </Button>
        </div>
      }
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
          {/* <Descriptions.Item label="Current House">
            {child?.houseId || "N/A"}
          </Descriptions.Item> */}
          <Descriptions.Item label="Current House">
            {currentHouseName || "N/A"}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Requested By">
            {userName || "N/A"}
          </Descriptions.Item> */}
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
          label="To House"
          rules={[
            { required: true, message: "Please select destination house" },
            {
              validator: (_, value) => {
                if (value && value === child?.houseId) {
                  return Promise.reject("Cannot transfer to the same house");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            placeholder="Select destination house"
            loading={loadingHouses}
            disabled={loadingHouses}
            showSearch
            optionFilterProp="children"
          >
            {houses.map((house) => (
              <Select.Option key={house.id} value={house.id}>
                {house.houseName} ({house.currentMembers || 0}/
                {house.houseMember} members)
              </Select.Option>
            ))}
          </Select>
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
    houseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }),
  onTransferSuccess: PropTypes.func,
};

export default ChildrenTransfer;
