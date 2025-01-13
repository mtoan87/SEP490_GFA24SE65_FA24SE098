import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Checkbox,
  Upload,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  InboxOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { getEventsWithImages } from "../../../services/api";
import { getVillagesWithImages } from "../../../services/api";
import { getVillageDetail } from "../../../services/api";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const { Dragger } = Upload;

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentImages, setCurrentImages] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [villages, setVillages] = useState([]);
  const [villageName, setVillageName] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchEvents();
    getVillagesWithImages()
      .then(data => {
        setVillages(data);
      })
      .catch(error => {
        console.error('Error fetching villages:', error);
      });
    const fetchVillageName = async () => {
      if (eventDetails?.villageId) {
        try {
          const villageData = await getVillageDetail(eventDetails.villageId); // API call to get village details
          setVillageName(villageData.villageName || "Village name not found");
        } catch (error) {
          console.error("Error fetching village name:", error);
          setVillageName("Village not found");
        }
      }
    };

    fetchVillageName();
  }, [eventDetails]);

  const handleVillageClick = () => {
    if (eventDetails?.id) {
      window.open(`/villagedetail/${eventDetails.id}`, "_blank");
    }
  };
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return 'N/A'; // Prevent error in case of null/undefined value
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (!event) {
    return <div className="loading">Loading...</div>;
  }
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(',', ' •');
  };

  const showModal = (event = null) => {
    setEditingEvent(event);
  
    if (event) {
      // Find the first wallet that is not null
      const wallets = [
        "facilitiesWalletId",
        "foodStuffWalletId",
        "systemWalletId",
        "healthWalletId",
        "necessitiesWalletId",
      ];
  
      let selectedWallet = null;
      // Loop through wallets and find the first non-null value
      for (const wallet of wallets) {
        if (event[wallet] !== null) {
          selectedWallet = wallet; // Set the selected wallet
          break;
        }
      }
  
      // Set the form values, including the specific wallet
      form.setFieldsValue({
        ...event,
        startTime: event.startTime && moment(event.startTime).isValid() ? moment(event.startTime) : null,
        endTime: event.endTime && moment(event.endTime).isValid() ? moment(event.endTime) : null,
        wallet: selectedWallet, // Set the selected wallet
      });
  
      console.log("Editing event wallet:", selectedWallet); // Check the value of wallet
  
      // Update the current images when opening the modal for edit
      setCurrentImages(
        event.imageUrls?.map((url, index) => ({
          event: index,
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

  const showEventDetails = async (eventId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://soschildrenvillage.azurewebsites.net/api/Event/GetEventById/${eventId}`
      );
      setEventDetails(response.data);
      setIsDetailModalVisible(true); // Mở modal chi tiết sự kiện
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      message.error("Could not fetch event details. Please try again.");
    } finally {
      setLoading(false);
    }
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
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("eventCode", values.eventCode);
        formData.append("startTime", values.startTime.format("YYYY-MM-DD"));
        formData.append("endTime", values.endTime.format("YYYY-MM-DD"));
        formData.append("currentAmount", values.currentAmount || 0);
        formData.append("amountLimit", values.amountLimit || 0);
        formData.append("villageId", values.villageId || "");

        // Set wallet fields
        // formData.append("facilitiesWalletId", values.facilitiesWalletId || "");
        // formData.append("systemWalletId", values.systemWalletId || "");
        // formData.append("foodStuffWalletId", values.foodStuffWalletId || "");
        // formData.append("healthWalletId", values.healthWalletId || "");
        // formData.append(
        //   "necessitiesWalletId",
        //   values.necessitiesWalletId || ""
        // );
        formData.append("status", values.status || "");
        formData.append("isDeleted", values.isDeleted ? "true" : "false");
        const wallets = [
          "facilitiesWalletId",
          "foodStuffWalletId",
          "systemWalletId",
          "healthWalletId",
          "necessitiesWalletId",
        ];
        wallets.forEach((wallet) => {
          formData.append(wallet, wallet === values.wallet ? 1 : "");
        });
        console.log("Form Values:", values);

        if (uploadFiles && uploadFiles.length > 0) {
          uploadFiles.forEach((file) => {
            if (file.originFileObj) {
              formData.append("Img", file.originFileObj);
            }
          });
        }
        if (imagesToDelete.length > 0) {
          imagesToDelete.forEach((imageId) => {
            formData.append("ImgToDelete", imageId);
          });
        }

        if (editingEvent) {
          const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Event/UpdateEvent?id=${editingEvent.id}`;
          await axios.put(updateUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          }
          );
          message.success("Updated Event Successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/Event/CreateEvent",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          message.success("Added Event Successfully");
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
          `Unable to ${editingEvent ? "update" : "create"
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
      title: "Are you sure you want to delete this event?",
      // centered: true,
      footer: (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Button
            type="primary"
            danger
            style={{ width: "120px" }} // Nút Yes
            onClick={async () => {
              try {
                const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Event/DeleteEvent?id=${id}`;
                console.log("Deleting event with ID:", id);

                const response = await axios.delete(deleteUrl);
                console.log("Delete response:", response.data);

                message.success("Event deleted successfully");
                Modal.destroyAll(); // Đóng Modal sau khi xóa thành công
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
            }}
          >
            Yes, delete it
          </Button>
          <Button
            onClick={() => Modal.destroyAll()}
            style={{ width: "120px" }} // Nút Cancel
          >
            Cancel
          </Button>
        </div>
      ),
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
          {!showDeleted && (
            <>
              <Button
                key={`view-${record.id}`}
                onClick={() => showEventDetails(record.id)}
                icon={<EyeOutlined />}
              />
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
            </>
          )}

          {showDeleted && (
            <Button type="primary" onClick={() => handleRestore(record.id)}>
              Restore
            </Button>
          )}
        </Space>
      ),
    }
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

      <Modal
        title="Event Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {eventDetails ? (
          <div>
            <p>
              <strong>Event Name:</strong> {eventDetails.name}
            </p>
            <p>
              <strong>Event Code:</strong> {eventDetails.eventCode || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {eventDetails.description.length > 100
                ? `${eventDetails.description.slice(0, 100)}...`
                : eventDetails.description || 'No description'}
              {eventDetails.description.length > 100 && (
                <Button type="link" onClick={() => setShowFullDescription(true)}>
                  Read More
                </Button>
              )}
            </p>
            <p>
              <strong>Village: </strong>
              <span
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={handleVillageClick}
              >
                {villageName || "Loading..."}
              </span>
            </p>
            <p>
              <strong>Start Time:</strong> {formatDate(eventDetails.startTime)}
            </p>
            <p>
              <strong>End Time:</strong> {formatDate(eventDetails.endTime)}
            </p>
            <p>
              <strong>Wallet: </strong>
              {
                (() => {
                  const walletNames = [];

                  // Check each wallet type based on the IDs
                  if (eventDetails.facilitiesWalletId) walletNames.push("Facilities Wallet");
                  if (eventDetails.foodStuffWalletId) walletNames.push("Food Stuff Wallet");
                  if (eventDetails.systemWalletId) walletNames.push("System Wallet");
                  if (eventDetails.healthWalletId) walletNames.push("Health Wallet");
                  if (eventDetails.necessitiesWalletId) walletNames.push("Necessities Wallet");

                  // Return the joined wallet names or "No Wallet" if none found
                  return walletNames.length > 0 ? walletNames.join(", ") : "No Wallet";
                })()}
            </p>
            <p>
              <strong>Current Amount:</strong> {formatCurrency(eventDetails.currentAmount)}
            </p>
            <p>
              <strong>Amount Limit:</strong> {formatCurrency(eventDetails.amountLimit)}
            </p>
            <p>
              <strong>Images:</strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {eventDetails.imageUrls?.map((url, index) => (
                <div key={index} style={{ border: "1px solid #d9d9d9" }}>
                  <img
                    src={url}
                    alt={`Event Image ${index + 1}`}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
      <Modal
        title={editingEvent ? "Update New Event" : "Add New Event"}
        open={isModalVisible}
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

        <Form form={form} layout="vertical" name="nameForm">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="eventCode"
            label="Event Code"
            rules={[{ required: true, message: "Please enter event code" }]}
          >
            <Input />
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
            rules={[
              { required: true, message: "Please select end time" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.isAfter(getFieldValue('startTime'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('End Time must be after Start Time'));
                },
              }),
            ]}

          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="amountLimit" label="Amount Limit">
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="villageId"
            label="Village"
            rules={[{ required: true, message: "Please select village" }]}
          >
            <Select placeholder="Select a village">
              {villages.map(village => (
                <Select.Option key={village.id} value={village.id}>
                  {village.villageName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="wallet"
            label="Wallet"
            rules={[{ required: true, message: "Please select a wallet" }]}
          >
            <Select>
              <Option value="systemWalletId">System Wallet</Option>
              <Option value="facilitiesWalletId">Facilities Wallet</Option>
              <Option value="foodStuffWalletId">Food Stuff Wallet</Option>
              <Option value="healthWalletId">Health Wallet</Option>
              <Option value="necessitiesWalletId">Necessities Wallet</Option>
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
          {editingEvent && (
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          )}

        </Form>
      </Modal>
      <Modal
        visible={showFullDescription}
        title="Village Description"
        onCancel={() => setShowFullDescription(false)}
        footer={null}
      >
        <p>{eventDetails?.description}</p>
      </Modal>
    </div>
  );
};

export default EventManagement;
