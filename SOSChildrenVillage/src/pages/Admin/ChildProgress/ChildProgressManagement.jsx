import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  //DatePicker,
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
        date: moment(progress.date) ? moment(progress.date) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();

        formData.append("childId", values.childId || "");
        formData.append(
          "description",
          values.description || "Default Description"
        );
        // formData.append(
        //   "date",
        //   values.date ? values.date.format("YYYY-MM-DD") : ""
        // );
        formData.append("category", values.category || "General");
        formData.append("eventId", values.eventId || null);
        formData.append("activityId", values.activityId || null);

        console.log("ChildProgress Values:", values);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        if (editingProgress) {
          await axios.put(
            `https://localhost:7073/api/ChildProgress/UpdateChildProgress/${editingProgress.id}`,
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Updated child progress successfully");
        } else {
          await axios.post(
            "https://localhost:7073/api/ChildProgress/CreateChildProgress",
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
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
        `https://localhost:7073/api/ChildProgress/DeleteChildProgress/${id}`
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
          dataSource={childProgressList}
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
            total: childProgressList.length,
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
        title={editingProgress ? "Edit Item" : "Add New Item"}
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
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          {/* <Form.Item name="date" label="Date">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item> */}
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