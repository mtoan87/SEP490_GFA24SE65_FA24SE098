import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { getTransferRequest } from "../../../services/api";

const TransferRequestManagement = () => {
  const [transferRequests, setTransferRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTransferRequests();
  }, []);

  const fetchTransferRequests = async () => {
    try {
      setLoading(true);
      const data = await getTransferRequest();
      setTransferRequests(data?.$values || []);
      console.log("Fetched transfer request data:", data);
    } catch (error) {
      console.error("Error fetching transfer requests:", error);
      message.error("Failed to load transfer requests");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (request = null) => {
    setEditingRequest(request);
    if (request) {
      form.setFieldsValue({
        ...request,
        requestDate: moment(request.requestDate)
          ? moment(request.requestDate)
          : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (!editingRequest && !values.status) {
          values.status = "Pending";
        }

        const formData = new FormData();
        formData.append("id", values.id || "");
        formData.append("childId", values.childId || "");
        formData.append("fromHouseId", values.fromHouseId || "");
        formData.append("toHouseId", values.toHouseId || "");
        //formData.append("requestDate", values.requestDate.format("YYYY-MM-DD"));
        formData.append("requestReason", values.requestReason || "");
        formData.append("status", values.status || "Pending");

        console.log("Transfer Request Values:", values);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        if (editingRequest) {
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${editingRequest.id}`,
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }

          );
          message.success("Updated transfer request successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/TransferRequest/CreateTransferRequest",
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Created new transfer request successfully");
        }
        setIsModalVisible(false);
        fetchTransferRequests();
      } catch (error) {
        console.error("Error saving transfer request:", error);
        message.error("Failed to save transfer request");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/DeleteTransferRequest/${id}`
      );
      message.success("Deleted transfer request successfully");
      fetchTransferRequests();
    } catch (error) {
      console.error("Error deleting transfer request:", error);
      message.error("Failed to delete transfer request");
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Child ID",
      dataIndex: "childId",
      key: "childId",
    },
    {
      title: "From House",
      dataIndex: "fromHouseId",
      key: "fromHouseId",
    },
    {
      title: "To House",
      dataIndex: "toHouseId",
      key: "toHouseId",
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Request Reason",
      dataIndex: "requestReason",
      key: "requestReason",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)} icon={<EditOutlined />} />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Input
          placeholder="Search for transfer request"
          prefix={<SearchOutlined />}
          style={{ width: 500, marginRight: 8 }}
        />
        <Button
          onClick={() => showModal()}
          type="primary"
          icon={<PlusOutlined />}
        >
          Add New Request
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={transferRequests}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: transferRequests.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title={
          editingRequest
            ? "Update Transfer Request"
            : "Add New Transfer Request"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={650}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="childId"
            label="Child ID"
            rules={[{ required: true, message: "Please enter Child ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="fromHouseId"
            label="From House ID"
            rules={[{ required: true, message: "Please enter From House ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="toHouseId"
            label="To House ID"
            rules={[{ required: true, message: "Please enter From House ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="requestReason" label="Request Reason">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferRequestManagement;