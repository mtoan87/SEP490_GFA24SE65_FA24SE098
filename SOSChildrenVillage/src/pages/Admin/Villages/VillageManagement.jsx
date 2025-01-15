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
  Select,
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
import { getVillagesWithImages } from "../../../services/api";
import { getVillageDetail } from "../../../services/api";
import ViewDetailsVillage from "./ViewDetailsVillage";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const { Dragger } = Upload;

const VillageManagement = () => {
  const [villages, setVillages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVillage, setEditingVillage] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);
  const [detailVillage, setDetailVillage] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [directors, setDirectors] = useState([]);

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
      fetchVillages();
    }
  }, [navigate, redirecting, showDeleted, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value); // Cập nhật từ khóa tìm kiếm
    fetchVillages(); // Gọi lại danh sách tài khoản mỗi khi thay đổi từ khóa tìm kiếm
  };

  const fetchVillages = async () => {
    try {
      setLoading(true);
      const data = await getVillagesWithImages(showDeleted, searchTerm);
      setVillages(Array.isArray(data) ? data : []);
      console.log("Fetched Village data with images:", data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch village data.");
      setVillages([]);
    } finally {
      setLoading(false);
    }
  };

  // Get Id Village
  const fetchVillageDetail = async (villageId) => {
    try {
      setLoading(true);
      const villageDetail = await getVillageDetail(villageId);
      console.log("Village Detail before setting:", villageDetail);
      setDetailVillage(villageDetail);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching village details:", error);
      message.error("Failed to fetch village details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDirectors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://soschildrenvillage.azurewebsites.net/api/UserAccount"
        );
        const users = Array.isArray(response.data.$values)
          ? response.data.$values
          : [];
        const filteredDirectors = users.filter((user) => user.roleId === 6);
        setDirectors(filteredDirectors);
      } catch (error) {
        message.error("Failed to fetch directors");
        console.error("Error fetching directors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
  }, []);

  const showModal = (village = null) => {
    setEditingVillage(village);
    if (village) {
      form.setFieldsValue({
        ...village,
        establishedDate: village.establishedDate
          ? moment(village.establishedDate)
          : null,
        imageUrls: village.imageUrls || [],
      });
      setCurrentImages(
        village.imageUrls?.map((url, index) => ({
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
          // Gán giá trị mặc định cho Status nếu không có
          if (!editingVillage && !values.status) {
            values.status = "Active";
          }

          const formData = new FormData();
          formData.append("VillageName", values.villageName);
          formData.append(
            "EstablishedDate",
            values.establishedDate.format("YYYY-MM-DD")
          );
          formData.append("Location", values.location);
          formData.append("Description", values.description || "");
          formData.append("Status", values.status || "Active");
          formData.append("UserAccountId", values.userAccountId);
          formData.append("TotalHouses", values.totalHouses || 0);
          formData.append("TotalChildren", values.totalChildren || 0);
          formData.append("ContactNumber", values.contactNumber || "");
          formData.append("Status", values.status || "Active");

          // Append các hình ảnh
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

          if (editingVillage) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Village/UpdateVillage?villageId=${editingVillage.id}`;
            await axios.put(updateUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("Update village Successfully");
          } else {
            await axios.post(
              "https://soschildrenvillage.azurewebsites.net/api/Village/CreateVillage",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            message.success("Add village Successfully");
          }

          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchVillages();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingVillage ? "UpdateVillage" : "CreateVillage",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingVillage ? "update" : "create"
              } village. Please try again.`
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
      title: "Are you sure you want to delete this village?",
      // centered: true,
      footer: (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Button
            type="primary"
            danger
            style={{ width: "120px" }} // Nút Yes
            onClick={async () => {
              try {
                const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Village/DeleteVillage?villageId=${id}`;
                console.log("Deleting village with ID:", id);

                const response = await axios.delete(deleteUrl);
                console.log("Delete response:", response.data);

                message.success("Village deleted successfully");
                Modal.destroyAll(); // Đóng Modal sau khi xóa thành công
                fetchVillages();
              } catch (error) {
                console.error("Delete error details:", {
                  message: error.message,
                  response: error.response?.data,
                  status: error.response?.status,
                });

                message.error(
                  error.response?.data?.message ||
                    "Unable to delete village. Please try again."
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
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Village/RestoreVillage/${id}`
      );
      message.success("Village Restored Successfully");
      fetchVillages(showDeleted);
    } catch (error) {
      console.error("Error occurred when restoring village:", error);
      message.error("Unable to restore village");
    }
  };

  const columns = [
    {
      title: "Village Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Village Name",
      dataIndex: "villageName",
      key: "villageName",
    },
    {
      title: "Established Date",
      dataIndex: "establishedDate",
      key: "establishedDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Total Houses",
      dataIndex: "totalHouses",
      key: "totalHouses",
    },
    {
      title: "Total Children",
      dataIndex: "totalChildren",
      key: "totalChildren",
    },
    {
      title: "User account Id",
      dataIndex: "userAccountId",
      key: "userAccountId",
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
          {!showDeleted && (
            <>
              <Button
                key={`edit-${record.id}`}
                onClick={() => showModal(record)}
                icon={<EditOutlined />}
              />

              <Button
                key={`view-${record.id}`}
                onClick={() => fetchVillageDetail(record.id)}
                icon={<EyeOutlined />}
              ></Button>

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
            placeholder="Search village"
            prefix={<SearchOutlined />}
            style={{ width: 400, marginRight: 8 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Gán giá trị cho searchTerm
            onPressEnter={() => fetchVillages()} // Tìm kiếm khi nhấn Enter
          />
          <Button
            type="primary"
            style={{ width: 100, marginRight: 8 }}
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchTerm)} // Tìm kiếm khi nhấn nút
          >
            Search
          </Button>
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
              Add New Village
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchVillages(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Villages" : "Show Deleted Villages"}
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
          dataSource={villages}
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
            total: villages.length,
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
        title={editingVillage ? "Edit Village" : "Add New Village"}
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
        <Form form={form} layout="vertical" name="villageForm">
          <Form.Item
            name="villageName"
            label="Village Name"
            rules={[{ required: true, message: "Please enter Village name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="establishedDate"
            label="Established Date"
            rules={[
              { required: true, message: "Please select established date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[{ required: true, message: "Please enter contact number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
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
            name="userAccountId"
            label="Directors"
            rules={[{ required: true, message: "Please select a director" }]}
          >
            <Select
              placeholder="Select a director"
              allowClear
              loading={loading}
            >
              {directors.map((director) => (
                <Option key={director.id} value={director.id}>
                  {director.userName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item name="roleName" label="Role Name">
            <Input />
          </Form.Item> */}

          {editingVillage && currentImages.length > 0 && (
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

          {/* <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>

          <Form.Item name="isDeleted" valuePropName="checked">
            <Checkbox>Deleted</Checkbox>
          </Form.Item> */}
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

      {/* View Details */}
      <ViewDetailsVillage
        isVisible={isDetailModalVisible}
        village={detailVillage}
        onClose={() => setIsDetailModalVisible(false)}
      />
    </div>
  );
};

export default VillageManagement;
