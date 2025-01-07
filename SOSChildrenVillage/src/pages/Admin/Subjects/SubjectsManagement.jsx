import { useState, useEffect, useRef } from "react";
import { Table, Space, Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("roleId");

    if (!token || !["1", "3", "4", "6"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/home");
        messageShown.current = true;
      }
    } else {
      fetchSubjectList();
    }
  }, [navigate, redirecting]);

  // useEffect(() => {
  //   fetchSubjectList();
  // }, []);

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
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Updated subject successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/SubjectDetail/CreateSubjectDetail",
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
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
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/SubjectDetail/DeleteSubjectDetail/${id}`;
          console.log("Deleting subject with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("Subject deleted successfully.");
          fetchSubjectList();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete item. Please try again."
          );
        }
      },
      onCancel: () => {
        console.log("Deletion canceled");
      },
    });
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Search for items"
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
              Add New Items
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>

            {/* <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchInventoryItems(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Items" : "Show Deleted Items"}
            </Button> */}
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
          dataSource={subjectList}
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
            total: subjectList.length,
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
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
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
            name="academicReportId"
            label="Academic Report ID"
            rules={[
              { required: true, message: "Please enter Academic Report ID" },
            ]}
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
