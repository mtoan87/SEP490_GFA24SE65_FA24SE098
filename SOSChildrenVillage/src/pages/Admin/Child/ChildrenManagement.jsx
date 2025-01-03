import { useState, useEffect, useRef } from "react";
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
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getChildWithImages } from "../../../services/api";
import { getChildDetail } from "../../../services/api";
import ViewDetailsChildren from "./ViewDetailsChildren";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const { Dragger } = Upload;

const ChildrenManagement = () => {
  const [children, setChildren] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingChild, setEditingChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  //const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  //const [selectedImages, setSelectedImages] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailChild, setDetailChild] = useState(null);


  const navigate = useNavigate();
  const messageShown = useRef(false); // Use a ref to track message display

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("roleId");

    if (!token || !["1", "3", "4"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/home");
        messageShown.current = true; // Set ref to true after showing message
      }
    } else {
      fetchChildren();
    }
  }, [navigate, redirecting]);

  const fetchChildren = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getChildWithImages(showDeleted);
      setChildren(Array.isArray(data) ? data : []);
      console.log("Fetched children data with images:", data);
    } catch (error) {
      console.log(error);
      message.error("Can not get children data with images");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

    const fetchChildrenDetail = async (childId) => {
      try {
        setLoading(true);
        const childDetail = await getChildDetail(childId);
        console.log("Child Detail before setting:", childDetail);
        setDetailChild(childDetail);
        setIsDetailModalVisible(true);
      } catch (error) {
        console.error("Error fetching child details:", error);
        message.error("Failed to fetch child details.");
      } finally {
        setLoading(false);
      }
    };

  const showModal = (child = null) => {
    setEditingChild(child);
    if (child) {
      form.setFieldsValue({
        ...child,
        dob: child.dob ? moment(child.dob) : null,
      });
      // Update cái state currentImages khi mở modal edit
      setCurrentImages(
        child.imageUrls?.map((url, index) => ({
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

          formData.append("childName", values.childName);
          formData.append("healthStatus", values.healthStatus || "");
          formData.append("houseId", values.houseId || "");
          formData.append("schoolId", values.schoolId || "");
          formData.append("facilitiesWalletId", values.facilitiesWalletId || 0);
          formData.append("systemWalletId", values.systemWalletId || 0);
          formData.append("foodStuffWalletId", values.foodStuffWalletId || 0);
          formData.append("healthWalletId", values.healthWalletId || 0);
          formData.append(
            "necessitiesWalletId",
            values.necessitiesWalletId || 0
          );
          formData.append("amount", values.amount || 0);
          formData.append("currentAmount", values.currentAmount || 0);
          formData.append("amountLimit", values.amountLimit || 0);
          formData.append("gender", values.gender);
          formData.append("dob", values.dob.format("YYYY-MM-DD"));
          formData.append("status", values.status || "");
          formData.append("isDeleted", values.isDeleted ? "true" : "false");

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

          if (editingChild) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Children/UpdateChild/${editingChild.id}`;
            console.log("Updating child with ID:", editingChild.id);
            console.log("Update URL:", updateUrl);

            const updateResponse = await axios.put(updateUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            console.log("Update response:", updateResponse.data);
            message.success("Update Children Successfully");
          } else {
            const createResponse = await axios.post(
              "https://soschildrenvillage.azurewebsites.net/api/Children/CreateChild",
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
          fetchChildren();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingChild ? "UpdateChild" : "CreateChild",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingChild ? "update" : "create"
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
      title: "Are you sure you want to delete this child?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Children/DeleteChild/${id}`;
          console.log("Deleting child with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("Child deleted successfully");
          fetchChildren();
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
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Children/RestoreChild/${id}`);
      message.success("Child Restored Successfully");
      fetchChildren(showDeleted); // Không thay đổi state showDeleted sau khi khôi phục
    } catch (error) {
      console.error("Error occurred when restoring child:", error);
      message.error("Unable to restore child");
    }
  };

  // QUAN TRỌNG: dataIndex và key phải giống với tên của các biến trong API.
  const columns = [
    {
      title: "Child Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Child Name",
      dataIndex: "childName",
      key: "childName",
    },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
    },
    {
      title: "House Id",
      dataIndex: "houseId",
      key: "houseId",
    },
    {
      title: "School Id",
      dataIndex: "schoolId",
      key: "schoolId",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    // {
    //   title: "Image",
    //   dataIndex: "imageUrls",
    //   key: "imageUrls",
    //   align: "center",
    //   render: (imageUrls) => (
    //     <Button
    //       type="link"
    //       onClick={() => {
    //         setSelectedImages(imageUrls || []);
    //         setIsImageModalVisible(true);
    //       }}
    //       style={{
    //         padding: 0,
    //         margin: 0,
    //         display: "block",
    //         width: "100%",
    //       }}
    //     >
    //       View
    //     </Button>
    //   ),
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
            key={`view-${record.id}`}
            onClick={() => fetchChildrenDetail(record)}
            icon={<EyeOutlined />}
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
            placeholder="Search for children"
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
              Add New Children
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchChildren(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Child" : "Show Deleted Child"}
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
          dataSource={children}
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
            total: children.length,
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
        title={editingChild ? "Update Children" : "Add New Children"}
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
            name="childName"
            label="Child Name"
            rules={[{ required: true, message: "Please enter child name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="healthStatus" label="Health Status">
            <Input />
          </Form.Item>

          <Form.Item name="houseId" label="House Id">
            <Input />
          </Form.Item>

          <Form.Item name="schoolId" label="School Id">
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          {editingChild && currentImages.length > 0 && (
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

          <Form.Item name="facilitiesWalletId" label="Facilities Wallet Id">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="systemWalletId" label="System Wallet Id">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="foodStuffWalletId" label="Food Stuff Wallet Id">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="healthWalletId" label="Health Wallet Id">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="necessitiesWalletId" label="Necessities Wallet Id">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="currentAmount" label="Current Amount">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="amountLimit" label="Amount Limit">
            <Input type="number" />
          </Form.Item>

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

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isDeleted" valuePropName="checked">
            <Checkbox>Deleted</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* View details */}
      <ViewDetailsChildren
        isVisible={isDetailModalVisible}
        child={detailChild}
        onClose={() => setIsDetailModalVisible(false)}
      />
    </div>
  );
};

export default ChildrenManagement;
