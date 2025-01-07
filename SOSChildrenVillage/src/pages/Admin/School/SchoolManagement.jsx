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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSchoolWithImages } from "../../../services/api";
import { getSchoolDetail } from "../../../services/api";
import ViewDetailsSchool from "./ViewDetailsSchool";
import axios from "axios";

const { Dragger } = Upload;

const SchoolManagement = () => {
  const [schools, setSchools] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSchool, setEditingSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailSchool, setDetailSchool] = useState(null);

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
      fetchSchools();
    }
  }, [navigate, redirecting]);

  const fetchSchools = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getSchoolWithImages(showDeleted);
      setSchools(Array.isArray(data) ? data : []);
      console.log("Fetched School data with images:", data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      message.error("Cannot fetch school data");
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolDetail = async (schoolId) => {
    try {
      setLoading(true);
      const schoolDetail = await getSchoolDetail(schoolId);
      console.log("School Detail before setting:", schoolDetail);
      setDetailSchool(schoolDetail);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching school details:", error);
      message.error("Failed to fetch school details.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (school = null) => {
    setEditingSchool(school);
    if (school) {
      form.setFieldsValue({ ...school });

      setCurrentImages(
        school.imageUrls?.map((url, index) => ({
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
          if (!editingSchool && !values.status) {
            values.status = "Active";
          }

          const formData = new FormData();
          formData.append("schoolName", values.schoolName || "");
          formData.append("address", values.address || "");
          formData.append("schoolType", values.schoolType || "");
          formData.append("phoneNumber", values.phoneNumber || "");
          formData.append("email", values.email || "");
          formData.append("status", values.status || "Active");

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

          if (editingSchool) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/School/UpdateSchool/${editingSchool.id}`;
            await axios.put(updateUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("School updated successfully.");
          } else {
            const createUrl = "https://soschildrenvillage.azurewebsites.net/api/School/CreateSchool";
            await axios.post(createUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("School added successfully.");
          }

          // Reset form and state
          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchSchools();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingSchool ? "UpdateSchool" : "CreateSchool",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingSchool ? "update" : "create"
              } school. Please try again.`
          );
        }
      })
      .catch((formError) => {
        console.error("Form validation errors:", formError);
        message.error("Please check all required fields.");
      });
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this school?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/School/DeleteSchool/${id}`;
          console.log("Deleting school with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("School deleted successfully.");
          fetchSchools();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete school. Please try again."
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
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/School/RestoreSchool/${id}`);
      message.success("School restored successfully.");
      fetchSchools(showDeleted);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to restore school.");
    }
  };

  const columns = [
    {
      title: "School ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "School Name",
      dataIndex: "schoolName",
      key: "schoolName",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "School Type",
      dataIndex: "schoolType",
      key: "schoolType",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
            key={`view-${record.id}`}
            onClick={() => fetchSchoolDetail(record.id)}
            icon={<EyeOutlined />}
          ></Button>

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
            placeholder="Search for School"
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
              Add New School
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchSchools(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Schools" : "Show Deleted Schools"}
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
          dataSource={schools}
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
            total: schools.length,
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
        title={editingSchool ? "Edit School" : "Add New School"}
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
        <Form form={form} layout="vertical" name="schoolForm">
          <Form.Item
            name="schoolName"
            label="School Name"
            rules={[
              { required: true, message: "Please enter the school name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="schoolType"
            label="School Type"
            rules={[
              { required: true, message: "Please enter the school type" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          {editingSchool && currentImages.length > 0 && (
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

      {/* View Details */}
      <ViewDetailsSchool
        isVisible={isDetailModalVisible}
        village={detailSchool}
        onClose={() => setIsDetailModalVisible(false)}
      />
    </div>
  );
};
export default SchoolManagement;
