import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { getTransferHistory } from "../../../services/api";

const TransferHistoryManagement = () => {
  const [transferHistories, setTransferHistories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHistory, setEditingHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTransferHistories();
  }, []);

  const fetchTransferHistories = async () => {
    try {
      setLoading(true);
      const data = await getTransferHistory();
      setTransferHistories(data?.$values || []);
      console.log("Fetched transfer histories data:", data);
    } catch (error) {
      console.error("Error fetching transfer histories:", error);
      message.error("Failed to load transfer histories");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (history = null) => {
    setEditingHistory(history);
    if (history) {
      form.setFieldsValue({
        ...history,
        transferDate: moment(history.transferDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (!editingHistory && !values.status) {
          values.status = "Pending";
        }

        const dataToSend = {
          ...values,
          transferDate: values.transferDate ? moment(values.transferDate).format("YYYY-MM-DD") : null,
        };

        if (editingHistory) {
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/TransferHistory/UpdateTransferHistory/${editingHistory.id}`,
            dataToSend
          );
          message.success("Updated transfer history successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/TransferHistory/CreateTransferHistory",
            dataToSend
          );
          message.success("Created new transfer history successfully");
        }

        setIsModalVisible(false);
        fetchTransferHistories();
      } catch (error) {
        console.error("Error saving transfer history:", error);
        message.error("Failed to save transfer history");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://soschildrenvillage.azurewebsites.net/api/TransferHistory/DeleteTransferHistory/${id}`);
      message.success("Deleted transfer history successfully");
      fetchTransferHistories();
    } catch (error) {
      console.error("Error deleting transfer history:", error);
      message.error("Failed to delete transfer history");
    }
  };

  const columns = [
    {
      title: "History ID",
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
      title: "Transfer Date",
      dataIndex: "transferDate",
      key: "transferDate",
      render: (date) => moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)} icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Input placeholder="Search for transfer history" prefix={<SearchOutlined />} style={{ width: 500, marginRight: 8 }} />
        <Button onClick={() => showModal()} type="primary" icon={<PlusOutlined />}>
          Add New History
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={transferHistories}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: transferHistories.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title={editingHistory ? "Update Transfer History" : "Add New Transfer History"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={650}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="childId" label="Child ID" rules={[{ required: true, message: "Please enter Child ID" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="fromHouseId" label="From House ID" rules={[{ required: true, message: "Please enter From House ID" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="toHouseId" label="To House ID" rules={[{ required: true, message: "Please enter To House ID" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="transferDate" label="Transfer Date" rules={[{ required: true, message: "Please select a transfer date" }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Canceled">Canceled</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferHistoryManagement;