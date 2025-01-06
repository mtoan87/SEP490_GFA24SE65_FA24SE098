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

  const { Option } = Select;

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
      setTransferRequests([]);
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

        formData.append("childId", values.childId || "");
        formData.append("fromHouseId", values.fromHouseId || "");
        formData.append("toHouseId", values.toHouseId || "");
        formData.append("requestReason", values.requestReason || "");
        formData.append("status", values.status || "Pending");

        console.log("Transfer Request Values:", values);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        if (editingRequest) {
          const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${editingRequest.id}`;
          await axios.put(updateUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          message.success("Update Transfer Request Successfully");
        } else {
          const response = await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/TransferRequest/CreateTransferRequest",
            formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            console.log("Create response:", response.data);
            await fetchTransferRequests();
            message.success("Add Transfer Request Successfully");
          }
        setIsModalVisible(false);
        form.resetFields();
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
      title: "Request Reason",
      dataIndex: "requestReason",
      key: "requestReason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Search for request"
            prefix={<SearchOutlined />}
            style={{ width: 500, marginRight: 8 }}
          />
          <div
            style={{
              display: "flex",
            }}
          >
            <Button
              onClick={() => showModal()}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: 8 }}
            >
              Add New Transfer Request
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Table
          columns={columns}
          dataSource={transferRequests}
          loading={loading}
          rowKey={(record) => record.id}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
              );
            },
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: transferRequests.length,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            position: ["Left"],
            itemRender: (_, type, originalElement) => {
              if (type === "prev") {
                return <Button>Previous</Button>;
              }
              if (type === "next") {
                return <Button>Next</Button>;
              }
              return originalElement;
            },
          }}
        />
      </div>

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
        footer={[
          <div
            key="footer"
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button key="ok" type="primary" onClick={handleOk}>
              OK
            </Button>
          </div>,
        ]}
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

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferRequestManagement;
