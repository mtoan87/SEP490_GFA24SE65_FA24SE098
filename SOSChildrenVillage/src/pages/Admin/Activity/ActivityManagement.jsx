import { useState, useEffect, useRef } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  Upload,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
  //EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getActivityWithImages } from "../../../services/api";
import axios from "axios";
import moment from "moment";

const { Dragger } = Upload;

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
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
      fetchActivities();
    }
  }, [navigate, redirecting]);

  const fetchActivities = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getActivityWithImages(showDeleted);
      setActivities(Array.isArray(data) ? data : []);
      console.log("Fetched Activity data with images:", data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch activity data.");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (activity = null) => {
    setEditingActivity(activity);
    if (activity) {
      form.setFieldsValue({
        ...activity,
        startDate: activity.startDate ? moment(activity.startDate) : null,
        endDate: activity.endDate ? moment(activity.endDate) : null,
        imageUrls: activity.imageUrls || [],
      });
      setCurrentImages(
        activity.imageUrls?.map((url, index) => ({
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
    onChange: (info) => setUploadFiles(info.fileList),
  };

  const handleOk = async () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (!editingActivity && !values.status) {
            values.status = "Planned";
          }

          const formData = new FormData();
          formData.append("ActivityName", values.activityName || "");
          formData.append("Description", values.description || "");
          formData.append(
            "StartDate",
            values.startDate ? values.startDate.format("YYYY-MM-DD") : ""
          );
          formData.append(
            "EndDate",
            values.endDate ? values.endDate.format("YYYY-MM-DD") : ""
          );
          formData.append("Address", values.address || "");
          formData.append("VillageId", values.villageId || "");
          formData.append("ActivityType", values.activityType || "");
          formData.append("TargetAudience", values.targetAudience || "");
          formData.append("Organizer", values.organizer || "");
          formData.append("Status", values.status || "Planned");
          formData.append("EventId", values.eventId || "");
          formData.append("Budget", values.budget || 0);
          formData.append("Feedback", values.feedback || "");

          for (var pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }

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

          if (editingActivity) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Activity/UpdateActivity/${editingActivity.id}`;
            await axios.put(updateUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("Update Activity Successfully");
          } else {
            await axios.post(
              "https://soschildrenvillage.azurewebsites.net/api/Activity/CreateActivity",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            message.success("Add Activity Successfully");
          }

          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchActivities();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingActivity ? "UpdateActivity" : "CreateActivity",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingActivity ? "update" : "create"
              } activity. Please try again.`
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
      title: "Are you sure you want to delete this activity?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Activity/DeleteActivity/${id}`;
          await axios.delete(deleteUrl);
          message.success("Activity deleted successfully.");
          fetchActivities();
        } catch (error) {
          console.error("Error:", error);
          message.error("Failed to delete activity.");
        }
      },
    });
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Activity/RestoreActivity/${id}`
      );
      message.success("Activity restored successfully.");
      fetchActivities(showDeleted);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to restore activity.");
    }
  };

  const columns = [
    {
      title: "Activity Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Activity Name",
      dataIndex: "activityName",
      key: "activityName",
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Village Id",
      dataIndex: "villageId",
      key: "villageId",
    },
    {
      title: "Activity Type",
      dataIndex: "activityType",
      key: "activityType",
    },
    {
      title: "Target Audience",
      dataIndex: "targetAudience",
      key: "targetAudience",
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Event Id",
      dataIndex: "eventId",
      key: "eventId",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (value) => (value !== null ? `$${value.toFixed(2)}` : "N/A"),
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Image",
      dataIndex: "imageUrls",
      key: "imageUrls",
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

          {/* <Button
            key={`view-${record.id}`}
            onClick={() => fetchVillageDetail(record.id)}
            icon={<EyeOutlined />}
          ></Button> */}

          <Button
            key={`delete-${record.id}`}
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
          />
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
            placeholder="Search for activities"
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
              Add New Activity
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchActivities(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted
                ? "Show Active Activities"
                : "Show Deleted Activities"}
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
          dataSource={activities}
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
            total: activities.length,
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
        title={editingActivity ? "Edit Activity" : "Add New Activity"}
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
        <Form form={form} layout="vertical" name="activityForm">
          <Form.Item
            name="activityName"
            label="Activity Name"
            rules={[{ required: true, message: "Please enter Activity name" }]}
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
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="villageId" label="Village Id">
            <Input />
          </Form.Item>

          <Form.Item name="activityType" label="Activity Type">
            <Input />
          </Form.Item>

          <Form.Item name="targetAudience" label="Target Audience">
            <Input />
          </Form.Item>

          <Form.Item name="organizer" label="Organizer">
            <Input />
          </Form.Item>

          <Form.Item name="budget" label="Budget">
            <Input type="number" prefix="$" />
          </Form.Item>

          <Form.Item name="feedback" label="Feedback">
            <Input.TextArea />
          </Form.Item>

          {editingActivity && currentImages.length > 0 && (
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
        </Form>
      </Modal>

      {/* Modal for View Images */}
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
export default ActivityManagement;
