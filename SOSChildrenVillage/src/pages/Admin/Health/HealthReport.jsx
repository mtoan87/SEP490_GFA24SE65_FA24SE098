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
  Select,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getHealthReportWithImages } from "../../../services/api";
import axios from "axios";
import moment from "moment";

const { Dragger } = Upload;
const { Option } = Select;

const HealthReport = () => {
  const [reports, setReports] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingReports, setEditingReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);
  const [children, setChildren] = useState([]);

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
      fetchHealthReports();
    }
  }, [navigate, redirecting]);

  // useEffect(() => {
  //   fetchHealthReports();
  // }, []);

  const fetchHealthReports = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getHealthReportWithImages(showDeleted);
      setReports(Array.isArray(data) ? data : []);
      console.log("Fetched health report data with images:", data);
    } catch (error) {
      console.log(error);
      message.error("Can not get health report data with images");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (report = null) => {
    setEditingReports(report);
    if (report) {
      form.setFieldsValue({
        ...report,
        checkupDate: report.checkupDate ? moment(report.checkupDate) : null,
        followUpDate: report.followUpDate ? moment(report.followUpDate) : null,
        imageUrls: report.imageUrls || [],
      });
      setCurrentImages(
        report.imageUrls?.map((url, index) => ({
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
          if (!editingReports && !values.status) {
            values.status = "Active";
          }

          const formData = new FormData();
          formData.append("childId", values.childId || "");
          formData.append("nutritionalStatus", values.nutritionalStatus || "");
          formData.append("medicalHistory", values.medicalHistory || "None");
          formData.append("vaccinationStatus", values.vaccinationStatus || "");
          formData.append("weight", values.weight || "");
          formData.append("height", values.height || "");
          formData.append(
            "checkupDate",
            values.checkupDate.format("YYYY-MM-DD")
          );
          formData.append("doctorName", values.doctorName || "None");
          formData.append("recommendations", values.recommendations || "None");
          formData.append("healthStatus", values.healthStatus || "");
          formData.append(
            "followUpDate",
            values.followUpDate.format("YYYY-MM-DD") || ""
          );
          formData.append("illnesses", values.illnesses || "None");
          formData.append("allergies", values.allergies || "None");
          formData.append("status", values.status || "Active");

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

          if (editingReports) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/HealthReport/UpdateHealthReport/${editingReports.id}`;
            console.log("Updating health report with ID:", editingReports.id);
            console.log("Update URL:", updateUrl);

            const updateResponse = await axios.put(updateUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            console.log("Update response:", updateResponse.data);
            message.success("Update health report Successfully");
          } else {
            const createResponse = await axios.post(
              "https://soschildrenvillage.azurewebsites.net/api/HealthReport/CreateHealthReport",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Create response:", createResponse.data);
            message.success("Add Children Successfully");
          }
          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchHealthReports();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingReports
              ? "UpdateHealthReport"
              : "CreateHealthReport",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingReports ? "update" : "create"
              } reports. Please try again.`
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
      title: "Are you sure you want to delete this child?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/HealthReport/DeleteHealthReport/${id}`;
          console.log("Deleting child with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("Child deleted successfully");
          fetchHealthReports();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete child. Please try again."
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
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/HealthReport/RestoreHealthReport/${id}`
      );
      message.success("Health Reports Restored Successfully");
      fetchHealthReports(showDeleted); // Không thay đổi state showDeleted sau khi khôi phục
    } catch (error) {
      console.error("Error occurred when restoring Health Reports:", error);
      message.error("Unable to restore Health Reports");
    }
  };

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://soschildrenvillage.azurewebsites.net/api/Children");
        const villageData = Array.isArray(response.data.$values)
          ? response.data.$values
          : [];
        setChildren(villageData);
      } catch (error) {
        message.error("Failed to fetch children");
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const columns = [
    {
      title: "Health Report Id",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Child Id",
      dataIndex: "childId",
      key: "childId",
      align: "center",
    },
    {
      title: "Nutritional Status",
      dataIndex: "nutritionalStatus",
      key: "nutritionalStatus",
      align: "center",
    },
    {
      title: "Medical History",
      dataIndex: "medicalHistory",
      key: "medicalHistory",
      align: "center",
    },
    {
      title: "Vaccination Status",
      dataIndex: "vaccinationStatus",
      key: "vaccinationStatus",
      align: "center",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      align: "center",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
      align: "center",
    },
    {
      title: "Checkup Date",
      dataIndex: "checkupDate",
      key: "checkupDate",
      align: "center",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    // {
    //   title: "Doctor Name",
    //   dataIndex: "doctorName",
    //   key: "doctorName",
    // },
    // {
    //   title: "Recommendations",
    //   dataIndex: "recommendations",
    //   key: "recommendations",
    // },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
      align: "center",
    },
    {
      title: "Follow-Up Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
      align: "center",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Illnesses",
      dataIndex: "illnesses",
      key: "illnesses",
      align: "center",
    },
    {
      title: "Allergies",
      dataIndex: "allergies",
      key: "allergies",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
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
      align: "center",
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Search for report"
            prefix={<SearchOutlined />}
            style={{ width: 500, marginRight: 8 }}
          />
          <div style={{ display: "flex" }}>
            <Button
              onClick={() => showModal()}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: 8 }}
            >
              Add New Health Report
            </Button>
            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchHealthReports(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Reports" : "Show Deleted Reports"}
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
          dataSource={reports}
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
            total: reports.length,
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
        title={
          editingReports ? "Update Health Report" : "Add New Health Report"
        }
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
          {/* <Form.Item
            name="childId"
            label="Child Id"
            rules={[{ required: true, message: "Please enter child ID" }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="childId"
            label="Child"
            rules={[{ required: true, message: "Please select a child" }]}
          >
            <Select placeholder="Select a child" allowClear loading={loading}>
              {children.map((child) => (
                <Option key={child.id} value={child.id}>
                  {child.childName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="nutritionalStatus"
            label="Nutritional Status"
            rules={[
              { required: true, message: "Please enter nutritional status" },
            ]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="nutritionalStatus"
            label="Nutritional Status"
            rules={[
              { required: true, message: "Please enter nutritional status" },
            ]}
          >
            <Select>
              <Option value="Poor">Poor</Option>
              <Option value="Moderate">Moderate</Option>
              <Option value="Good">Good</Option>
            </Select>
          </Form.Item>

          <Form.Item name="medicalHistory" label="Medical History">
            <Input />
          </Form.Item>

          {/* <Form.Item
            name="vaccinationStatus"
            label="Vaccination Status"
            rules={[
              { required: true, message: "Please enter vaccination status" },
            ]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="vaccinationStatus"
            label="Vaccination Status"
            rules={[
              { required: true, message: "Please enter Vaccination status" },
            ]}
          >
            <Select>
              <Option value="No Vaccination">No Vaccination</Option>
              <Option value="Partially completed">Partially completed</Option>
              <Option value="Up to date">Up to date</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight (KG)"
            rules={[{ required: true, message: "Please enter weight" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="height"
            label="Height (CM)"
            rules={[{ required: true, message: "Please enter height" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="checkupDate"
            label="Checkup Date"
            rules={[
              { required: true, message: "Please select a checkup date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="doctorName" label="Doctor Name">
            <Input />
          </Form.Item>

          <Form.Item name="recommendations" label="Recommendations">
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* <Form.Item
            name="healthStatus"
            label="Health Status"
            rules={[{ required: true, message: "Please enter health status" }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="healthStatus"
            label="Health Status"
            rules={[{ required: true, message: "Please enter Health status" }]}
          >
            <Select>
              <Option value="Critical">Critical</Option>
              <Option value="Moderate">Moderate</Option>
              <Option value="Healthy">Healthy</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="followUpDate"
            label="Follow-Up Date"
            rules={[
              { required: false, message: "Please select a follow-up date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="illnesses" label="Illnesses">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="allergies" label="Allergies">
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: "Please enter the report status" },
            ]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item> */}
        </Form>

        {editingReports && currentImages.length > 0 && (
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

export default HealthReport;
