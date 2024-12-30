import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { getSubjectDetail } from "../../../services/api";

const SubjectsManagement = () => {
  const [subjectList, setSubjectList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSubject, setEditingSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchSubjectList();
  }, []);

  const fetchSubjectList = async () => {
    try {
      const data = await getSubjectDetail();
      setSubjectList(data?.$values || []);
      console.log("Fetched transfer request data:", data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      message.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (subject = null) => {
    setEditingSubject(subject);
    if (subject) {
      form.setFieldsValue(subject);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingSubject) {
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/SubjectDetail/UpdateSubjectDetail/${editingSubject.id}`,
            values
          );
          message.success("Updated subject successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/SubjectDetail/CreateSubjectDetail",
            values
          );
          message.success("Created new subject successfully");
        }
        setIsModalVisible(false);
        fetchSubjectList();
      } catch (error) {
        console.error("Error saving subject:", error);
        message.error("Failed to save subject");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://soschildrenvillage.azurewebsites.net/api/SubjectDetail/DeleteSubjectDetail/${id}`);
      message.success("Deleted subject successfully");
      fetchSubjectList();
    } catch (error) {
      console.error("Error deleting subject:", error);
      message.error("Failed to delete subject");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Academic Report ID",
      dataIndex: "academicReportId",
      key: "academicReportId",
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
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
          placeholder="Search for subjects"
          prefix={<SearchOutlined />}
          style={{ width: 500, marginRight: 8 }}
        />
        <Button
          onClick={() => showModal()}
          type="primary"
          icon={<PlusOutlined />}
        >
          Add New Subject
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={subjectList}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: subjectList.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title={editingSubject ? "Update Subject" : "Add New Subject"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={650}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="academicReportId"
            label="Academic Report ID"
            rules={[{ required: true, message: "Please enter Academic Report ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="subjectName" label="Subject Name">
            <Input />
          </Form.Item>
          <Form.Item name="score" label="Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectsManagement;