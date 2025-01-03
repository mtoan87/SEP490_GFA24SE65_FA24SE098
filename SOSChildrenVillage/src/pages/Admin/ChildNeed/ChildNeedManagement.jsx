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
import { getChildNeed } from "../../../services/api";

const ChildNeedManagement = () => {
  const [childNeedList, setChildNeedList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingNeed, setEditingNeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchChildNeedList();
  }, []);

  const fetchChildNeedList = async () => {
    try {
      setLoading(true);
      const data = await getChildNeed();
      setChildNeedList(data?.$values || []);
      console.log("Fetched transfer request data:", data);
    } catch (error) {
      console.error("Error fetching child needs:", error);
      message.error("Failed to load child needs");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (need = null) => {
    setEditingNeed(need);
    if (need) {
      form.setFieldsValue({
        ...need,
        fulfilledDate: need.fulfilledDate ? moment(need.fulfilledDate) : null,
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
          fulfilledDate: values.fulfilledDate
            ? values.fulfilledDate.format("YYYY-MM-DD")
            : null,
        };

        if (editingNeed) {
          await axios.put(
            `https://localhost:7073/api/ChildNeed/UpdateChildNeed/${editingNeed.id}`,
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Updated child need successfully");
        } else {
          await axios.post(
            "https://localhost:7073/api/ChildNeed/CreateChildNeed",
            payload
          );
          message.success("Created new child need successfully");
        }

        setIsModalVisible(false);
        fetchChildNeedList();
      } catch (error) {
        console.error("Error saving child need:", error);
        message.error("Failed to save child need");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://localhost:7073/api/ChildNeed/DeleteChildNeed/${id}`
      );
      message.success("Deleted child need successfully");
      fetchChildNeedList();
    } catch (error) {
      console.error("Error deleting child need:", error);
      message.error("Failed to delete child need");
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
      title: "Need Description",
      dataIndex: "needDescription",
      key: "needDescription",
    },
    {
      title: "Need Type",
      dataIndex: "needType",
      key: "needType",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Fulfilled Date",
      dataIndex: "fulfilledDate",
      key: "fulfilledDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
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
          dataSource={childNeedList}
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
            total: childNeedList.length,
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
        title={editingNeed ? "Edit Item" : "Add New Item"}
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
          <Form.Item name="needDescription" label="Need Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="needType" label="Need Type">
            <Input />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Input />
          </Form.Item>
          <Form.Item name="fulfilledDate" label="Fulfilled Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildNeedManagement;