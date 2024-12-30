import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { getChildProgress } from "../../../services/api";

const ChildProgressManagement = () => {
  const [childProgressList, setChildProgressList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProgress, setEditingProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchChildProgressList();
  }, []);

  const fetchChildProgressList = async () => {
    try {
      setLoading(true);
      const data = await getChildProgress();
      setChildProgressList(data?.$values || []);
      console.log("Fetched transfer request data:", data);
    } catch (error) {
      console.error("Error fetching child progress:", error);
      message.error("Failed to load child progress");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (progress = null) => {
    setEditingProgress(progress);
    if (progress) {
      form.setFieldsValue({
        ...progress,
        date: progress.date ? moment(progress.date) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = {
          ...values,
          date: values.date ? values.date.format("YYYY-MM-DD") : null,
        };

        if (editingProgress) {
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/ChildProgress/UpdateChildProgress/${editingProgress.id}`,
            payload
          );
          message.success("Updated child progress successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/ChildProgress/CreateChildProgress",
            payload
          );
          message.success("Created new child progress successfully");
        }

        setIsModalVisible(false);
        fetchChildProgressList();
      } catch (error) {
        console.error("Error saving child progress:", error);
        message.error("Failed to save child progress");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://soschildrenvillage.azurewebsites.net/api/ChildProgress/DeleteChildProgress/${id}`
      );
      message.success("Deleted child progress successfully");
      fetchChildProgressList();
    } catch (error) {
      console.error("Error deleting child progress:", error);
      message.error("Failed to delete child progress");
    }
  };
const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Child ID",
      dataIndex: "childId",
      key: "childId",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Event ID",
      dataIndex: "eventId",
      key: "eventId",
    },
    {
      title: "Activity ID",
      dataIndex: "activityId",
      key: "activityId",
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
          placeholder="Search for child progress"
          prefix={<SearchOutlined />}
          style={{ width: 500, marginRight: 8 }}
        />
        <Button
          onClick={() => showModal()}
          type="primary"
          icon={<PlusOutlined />}
        >
          Add New Progress
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={childProgressList}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: childProgressList.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title={
          editingProgress
            ? "Update Child Progress"
            : "Add New Child Progress"
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
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="eventId" label="Event ID">
            <Input />
          </Form.Item>
          <Form.Item name="activityId" label="Activity ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildProgressManagement;