import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Checkbox,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { getEventsWithImages } from "../../../services/api";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const { Dragger } = Upload;

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getEventsWithImages(showDeleted);
      setEvents(Array.isArray(data) ? data : []);
      console.log("Fetched events data with images:", data);
    } catch (error) {
      console.log(error);
      message.error("Can not get events data with images");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (event = null) => {
    setEditingEvent(event);
    if (event) {
      form.setFieldsValue({
        ...event,
        startTime: event.startTime ? moment(event.startTime) : null, // Xử lý StartTime
        endTime: event.endTime ? moment(event.endTime) : null,
      });
      // Update cái state currentImages khi mở modal edit
      setCurrentImages(
        event.imageUrls?.map((url, index) => ({
          uid: index,
          url: url,
          status: "done",
          name: `Image ${index + 1}`,
        })) || []
      );
    } else {
      form.resetFields();
      setCurrentImages([]);
    }
    setImagesToDelete([]);
    setUploadFiles([]);
    setIsModalVisible(true);
  };

  const uploadProps = {
    name: "images",
    multiple: true,
    fileList: uploadFiles,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file`);
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      setUploadFiles(info.fileList);
    },
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const formData = new FormData();

          // Append data
          formData.append("name", values.name);
          formData.append(
            "facilitiesWalletId",
            values.facilitiesWalletId || ""
          );
          formData.append("foodStuffWalletId", values.foodStuffWalletId || "");
          formData.append("systemWalletId", values.systemWalletId || "");
          formData.append("healthWalletId", values.healthWalletId || "");
          formData.append(
            "necessitiesWalletId",
            values.necessitiesWalletId || ""
          );
          // formData.append("description", values.description || "");
          formData.append("startTime", values.startTime.format("YYYY-MM-DD"));
          formData.append("endTime", values.endTime.format("YYYY-MM-DD"));
          formData.append("amount", values.amount || 0);
          formData.append("currentAmount", values.currentAmount || 0);
          formData.append("amountLimit", values.amountLimit || 0);
          formData.append("status", values.status || "");
          formData.append("villageId", values.villageId || "");

          console.log("Form Values:", values);

          //Add Images
          if (uploadFiles && uploadFiles.length > 0) {
            uploadFiles.forEach((file) => {
              if (file.originFileObj) {
                formData.append("Img", file.originFileObj);
              }
            });
          }

          //Delete Images
          if (imagesToDelete.length > 0) {
            imagesToDelete.forEach((imageId) => {
              formData.append("ImgToDelete", imageId);
            });
          }

          console.log("FormData entries:");
          for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }

          if (editingEvent) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Event/UpdateEvent?id=${editingEvent.id}`;
            console.log("Updating event with ID:", editingEvent.id);
            console.log("Update URL:", updateUrl);

            const updateResponse = await axios.put(updateUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            console.log("Update response:", updateResponse.data);
            message.success("Update Event Successfully");
          } else {
            const createResponse = await axios.post(
              "https://soschildrenvillage.azurewebsites.net/api/Event/CreateEvent",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("Create response:", createResponse.data);
            message.success("Add Event Successfully");
          }

          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchEvents();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingEvent ? "UpdateEvent" : "CreateEvent",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingEvent ? "update" : "create"
              } event. Please try again.`
          );
        }
      })
      .catch((formError) => {
        console.error("Form validation errors:", formError);
        message.error("Please check all required fields");
      });
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Event?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Event/DeleteEvent?id=${id}`;
          console.log("Deleting event with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("Event deleted successfully");
          fetchEvents();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete event. Please try again."
          );
        }
      },
      onCancel: () => {
        console.log("Deletion canceled");
      },
    });
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Event/RestoreEvent/${id}`);
      message.success("Event Restored Successfully");
      fetchEvents(showDeleted); // Không thay đổi state showDeleted sau khi khôi phục
    } catch (error) {
      console.error("Error occurred when restoring event:", error);
      message.error("Unable to restore event");
    }
  };

  // QUAN TRỌNG: dataIndex và key phải giống với tên của các biến trong API.
  const columns = [
    {
      title: "Event Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Facilities Wallet Id",
      dataIndex: "facilitiesWalletId",
      key: "facilitiesWalletId",
    },
    {
      title: "Food Stuff WalletId",
      dataIndex: "foodStuffWalletId",
      key: "foodStuffWalletId",
    },
    {
      title: "System Wallet Id",
      dataIndex: "systemWalletId",
      key: "systemWalletId",
    },
    {
      title: "Health Wallet Id",
      dataIndex: "healthWalletId",
      key: "healthWalletId",
    },
    {
      title: "Necessities Wallet Id",
      dataIndex: "necessitiesWalletId",
      key: "necessitiesWalletId",
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) =>
        moment(startTime).isValid()
          ? moment(startTime).format("DD/MM/YYYY")
          : "",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) =>
        moment(endTime).isValid() ? moment(endTime).format("DD/MM/YYYY") : "",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Current Amount",
      dataIndex: "currentAmount",
      key: "currentAmount",
    },
    {
      title: "Amount Limit",
      dataIndex: "amountLimit",
      key: "amountLimit",
    },
    {
      title: "Village Id",
      dataIndex: "villageId",
      key: "villageId",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Image",
      dataIndex: "imageUrls",
      key: "imageUrls",
      align: "center",
      render: (imageUrls) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedImages(imageUrls || []);
            setIsImageModalVisible(true);
          }}
          style={{
            padding: 0,
            margin: 0,
            display: "block",
            width: "100%",
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            key={`edit-${record.id}`}
            onClick={() => showModal(record)}
            icon={<EditOutlined />}
          />
          <Button
            key={`delete-${record.id}`}
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
          />

          {/* Hiển thị nút Restore nếu House đã bị xóa */}
          {showDeleted && (
            <Button type="primary" onClick={() => handleRestore(record.id)}>
              Restore
            </Button>
          )}
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

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
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

      <Modal
        title={editingEvent ? "Update Event" : "Add New Event"}
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
            name="name"
            label="Event Name"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Event Description"
            rules={[
              { required: true, message: "Please enter event description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="currentAmount"
            label="Current Amount"
            rules={[{ required: true, message: "Please enter current amount" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="amountLimit"
            label="Amount Limit"
            rules={[{ required: true, message: "Please enter amount limit" }]}
          >
            <Input type="number" />
          </Form.Item>       

          <Form.Item name="facilitiesWalletId" label="Facilities Wallet ID">
            <Input />
          </Form.Item>

          <Form.Item name="foodStuffWalletId" label="Food Stuff Wallet ID">
            <Input />
          </Form.Item>

          <Form.Item name="systemWalletId" label="System Wallet ID">
            <Input />
          </Form.Item>

          <Form.Item name="healthWalletId" label="Health Wallet ID">
            <Input />
          </Form.Item>

          <Form.Item name="necessitiesWalletId" label="Necessities Wallet ID">
            <Input />
          </Form.Item>

          <Form.Item name="villageId" label="Village ID">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status">
          <Select>
              <Option value="Active">Scheduled</Option>
              <Option value="Inactive">Unscheduled</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          {editingEvent && currentImages.length > 0 && (
            <Form.Item label="Current Images">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {currentImages.map((image, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={image.url}
                      alt={`Current ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                      }}
                      onClick={() => {
                        setImagesToDelete([...imagesToDelete, image.url]);
                        setCurrentImages(
                          currentImages.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
          )}

          <Form.Item label="Upload New Images">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">
                Support for single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>        

          <Form.Item name="isDeleted" valuePropName="checked">
            <Checkbox>Deleted</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Images */}
      <Modal
        title="Images"
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width={800}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            padding: "16px",
          }}
        >
          {selectedImages.map((url, index) => (
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
      </Modal>
    </div>
  );
};

export default EventManagement;
