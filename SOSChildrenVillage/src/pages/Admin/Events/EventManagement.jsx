import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  //Select,
  //DatePicker,
  message,
  //Checkbox,
  //Upload,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  //DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  //InboxOutlined,
} from "@ant-design/icons";
import { getEventsWithImages } from "../../../services/api";
//import axios from "axios";
import moment from "moment";

//const { Option } = Select;
//const { Dragger } = Upload;

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
//  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
// const [selectedImages, setSelectedImages] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const showModal = (event = null) => {
    setEditingEvent(event);
    if (event) {
      form.setFieldsValue({
        ...event,
        startTime: event.startTime ? moment(event.startTime) : null,
        endTime: event.endTime ? moment(event.endTime) : null,
        imageUrls: event.imageUrls || [],
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const fetchEvents = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getEventsWithImages(showDeleted);
      setEvents(Array.isArray(data) ? data : []);
      console.log("Fetched events data:", data);
    } catch (error) {
      console.log(error);
      message.error("Can not get events data");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const showEventDetails = (event) => {
    setEventDetails(event);
    setIsModalVisible(true); // Open the modal to display event details
  };

  const columns = [
    {
      title: "Event Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Event Code",
      dataIndex: "eventCode",
      key: "eventCode",
    },
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Wallet",
      key: "wallet",
      render: (text, record) => {
        const walletNames = [];
        if (record.facilitiesWalletId) walletNames.push("Facilities Wallet");
        if (record.foodStuffWalletId) walletNames.push("Food Stuff Wallet");
        if (record.systemWalletId) walletNames.push("System Wallet");
        if (record.healthWalletId) walletNames.push("Health Wallet");
        if (record.necessitiesWalletId) walletNames.push("Necessities Wallet");
        return walletNames.length > 0 ? walletNames.join(", ") : "No Wallet";
      },
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
          <Button
            key={`view-${record.id}`}
            onClick={() => showEventDetails(record)}
            icon={<EyeOutlined />}
          />
          <Button
            key={`edit-${record.id}`}
            onClick={() => showModal(record)}
            icon={<EditOutlined />}
          />
          {/* <Button
            key={`delete-${record.id}`}
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
          /> */}
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
            placeholder="Search for Events"
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
              Add New Events
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchEvents(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Events" : "Show Deleted Events"}
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
          dataSource={events}
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
            total: events.length,
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

      {/* Event Details Modal */}
      <Modal
        title="Event Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {eventDetails && (
          <div>
            <p>
              <strong>Event Name:</strong> {eventDetails.name}
            </p>
            <p>
              <strong>Event Code:</strong> {eventDetails.eventCode || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {eventDetails.description || "No description provided"}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {moment(eventDetails.startTime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {moment(eventDetails.endTime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
              <strong>Current Amount:</strong> {eventDetails.currentAmount}
            </p>
            <p>
              <strong>Amount Limit:</strong> {eventDetails.amountLimit}
            </p>
            <p>
              <strong>Images:</strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
                padding: "16px",
              }}
            >
              {eventDetails.imageUrls?.map((url, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    onClick={() => window.open(url, "_blank")}
                  />
                  <div
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      borderTop: "1px solid #d9d9d9",
                    }}
                  >
                    {`Image ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;
