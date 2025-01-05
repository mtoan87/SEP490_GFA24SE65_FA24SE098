import { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import { getAcademicReportWithImages } from "../../../services/api";
import axios from "axios";

const { Dragger } = Upload;

const AcademicReport = () => {
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
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchAcademicReports();
  }, []);

  const fetchAcademicReports = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getAcademicReportWithImages(showDeleted);
      //setReports(data?.$values || []);
      setReports(Array.isArray(data) ? data : []);
      console.log("Fetched academic report data:", data);
    } catch (error) {
      console.log(error);
      message.error("Can not get academic report data");
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
          const formData = new FormData();

          formData.append("diploma", values.diploma || "");
          formData.append("childId", values.childId || "");
          formData.append("gpa", values.gpa || "");
          formData.append("schoolReport", values.schoolReport || "");
          formData.append("semester", values.semester || "");
          formData.append("academicYear", values.academicYear || "");
          formData.append("remarks", values.remarks || "");
          formData.append("achievement", values.achievement || "");
          formData.append("status", values.status || "");
          //formData.append("class", values.class || "");
          //formData.append("feedback", values.feedback || "");

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

          console.log("Academic Report Values:", values);

          console.log("FormData entries:");
          for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }

          if (editingReports) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/AcademicReport/UpdateAcademicReport/${editingReports.id}`;
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
              "https://soschildrenvillage.azurewebsites.net/api/AcademicReport/CreateAcademicReport",
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
          fetchAcademicReports();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingReports
              ? "UpdateAcademicReport"
              : "CreateAcademicReport",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingReports ? "update" : "create"
              } child. Please try again.`
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
      title: "Are you sure you want to delete this academic report?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/AcademicReport/DeleteAcademicReport/${id}`;
          console.log("Deleting academic report with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("Academic report deleted successfully");
          fetchAcademicReports();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete academic report. Please try again."
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
        `https://soschildrenvillage.azurewebsites.net/api/Children/RestoreAcademicReport/${id}`
      );
      message.success("Academic Restored Successfully");
      fetchAcademicReports(showDeleted);
    } catch (error) {
      console.error("Error occurred when restoring Academic:", error);
      message.error("Unable to restore child");
    }
  };

  const columns = [
    {
      title: "Academic Report Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Diploma",
      dataIndex: "diploma",
      key: "diploma",
    },
    {
      title: "Child Id",
      dataIndex: "childId",
      key: "childId",
    },
    {
      title: "GPA",
      dataIndex: "gpa",
      key: "gpa",
    },
    {
      title: "School Report",
      dataIndex: "schoolReport",
      key: "schoolReport",
    },
    {
      title: "School Level",
      dataIndex: "schoolLevel",
      key: "schoolLevel",
    },
    {
      title: "School Id",
      dataIndex: "schoolId",
      key: "schoolId",
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Achievement",
      dataIndex: "achievement",
      key: "achievement",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    // {
    //   title: "Class",
    //   dataIndex: "class",
    //   key: "class",
    // },
    // {
    //   title: "Feedback",
    //   dataIndex: "feedback",
    //   key: "feedback",
    // },
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
            placeholder="Search for report"
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
              Add New Report
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchAcademicReports(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active reports" : "Show Deleted reports"}
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
          editingReports ? "Update Academic Report" : "Add New Academic Report"
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
          <Form.Item
            name="diploma"
            label="Diploma"
            rules={[{ required: true, message: "Please enter diploma" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="childId"
            label="Child Id"
            rules={[{ required: true, message: "Please enter child ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gpa"
            label="GPA"
            rules={[{ required: true, message: "Please enter GPA" }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>

          <Form.Item name="schoolLevel" label="School Level">
            <Input />
          </Form.Item>

          <Form.Item name="schoolId" label="School Id">
            <Input />
          </Form.Item>

          <Form.Item name="semester" label="Semester">
            <Input />
          </Form.Item>

          <Form.Item name="academicYear" label="Academic Year">
            <Input />
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input />
          </Form.Item>

          <Form.Item name="achievement" label="Achievement">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>

          {/* <Form.Item name="class" label="Class">
            <Input />
          </Form.Item> */}

          {/* <Form.Item name="feedback" label="Feedback">
            <Input />
          </Form.Item> */}

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
        </Form>
      </Modal>
    </div>
  );
};
export default AcademicReport;
