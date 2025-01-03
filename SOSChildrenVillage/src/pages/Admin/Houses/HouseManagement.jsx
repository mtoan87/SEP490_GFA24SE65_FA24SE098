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
  Checkbox,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate từ react-router-dom
import { getHouseWithImages } from "../../../services/api";
import { getHouseDetail } from "../../../services/api";
import ViewDetailsHouse from "./ViewDetailsHouse";
import axios from "axios";
import moment from "moment";

const { Dragger } = Upload;

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHouse, setEditingHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadFiles, setUploadFiles] = useState([]);
  //const [selectedImages, setSelectedImages] = useState([]);
  //const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false); // Thêm trạng thái để kiểm soát việc điều hướng
  const [detailHouse, setDetailHouse] = useState(null); // Lưu thông tin chi tiết House
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); 


  const navigate = useNavigate(); // Khởi tạo useNavigate
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
      fetchHouses();
    }
  }, [navigate, redirecting]);

  const fetchHouses = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getHouseWithImages(showDeleted);
      setHouses(Array.isArray(data) ? data : []);
      console.log("Fetched house data with images:", data);
    } catch (error) {
      console.log(error);
      message.error("Cannot get houses data with images");
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseDetail = async (houseId) => {
    try {
      setLoading(true);
      const houseDetail = await getHouseDetail(houseId);
      console.log("House Detail before setting:", houseDetail);
      setDetailHouse(houseDetail); 
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching house details:", error);
      message.error("Failed to fetch house details.");
    } finally {
      setLoading(false); 
    }
  };

  const showModal = (house = null) => {
    setEditingHouse(house);
    if (house) {
      form.setFieldsValue({
        ...house,
        foundationDate: house.foundationDate
          ? moment(house.foundationDate)
          : null,
        lastInspectionDate: house.lastInspectionDate
          ? moment(house.lastInspectionDate)
          : null,
        imageUrls: house.imageUrls || [],
      });

      setCurrentImages(
        house.imageUrls?.map((url, index) => ({
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
    onChange: (info) => {
      setUploadFiles(info.fileList);
    },
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (!editingHouse && !values.status) {
            values.status = "Active";
          }

          const formData = new FormData();
          formData.append("HouseName", values.houseName || "");
          formData.append("HouseNumber", values.houseNumber || 0);
          formData.append("Location", values.location);
          formData.append("Description", values.description || "");
          formData.append("HouseMember", values.houseMember || 0);
          formData.append("HouseOwner", values.houseOwner || "");
          formData.append("Status", values.status || "Inactive");
          formData.append("UserAccountId", values.userAccountId);
          formData.append("VillageId", values.villageId);
          formData.append(
            "FoundationDate",
            values.foundationDate.format("YYYY-MM-DD")
          );
          formData.append(
            "LastInspectionDate",
            values.lastInspectionDate
              ? values.lastInspectionDate.format("YYYY-MM-DD")
              : ""
          );
          formData.append("MaintenanceStatus", values.maintenanceStatus || "Good");
          // formData.append("RoleName", values.roleName);

          for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); 
          }

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

          if (editingHouse) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Houses/UpdateHouse?id=${editingHouse.id}`;
            await axios.put(updateUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("Update House Successfully");
          } else {
            const createUrl = `https://soschildrenvillage.azurewebsites.net/api/Houses/CreateHouse`;
            await axios.post(createUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("Add House Successfully");
          }

          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchHouses();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingHouse ? "UpdateHouse" : "CreateHouse",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingHouse ? "update" : "create"
              } house. Please try again.`
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
      title: "Are you sure you want to delete this house?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Houses/DeleteHouse?id=${id}`;
          console.log("Deleting house with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("House deleted successfully");
          fetchHouses();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete house. Please try again."
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
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Houses/RestoreHouse/${id}`);
      message.success("House Restored Successfully");
      fetchHouses(showDeleted); // Không thay đổi state showDeleted sau khi khôi phục
    } catch (error) {
      console.error("Error occurred when restoring house:", error);
      message.error("Unable to restore house");
    }
  };

  const columns = [
    {
      title: "House Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "House Name",
      dataIndex: "houseName",
      key: "houseName",
    },
    {
      title: "House Number",
      dataIndex: "houseNumber",
      key: "houseNumber",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Capacity",
      dataIndex: "houseMember",
      key: "houseMember",
    },
    {
      title: "Current Members",
      dataIndex: "currentMembers",
      key: "currentMembers",
    },
    {
      title: "House Owner",
      dataIndex: "houseOwner",
      key: "houseOwner",
    },
    {
      title: "User Account Id",
      dataIndex: "userAccountId",
      key: "userAccountId",
    },
    {
      title: "Village Id",
      dataIndex: "villageId",
      key: "villageId",
    },
    {
      title: "Foundation Date",
      dataIndex: "foundationDate",
      key: "foundationDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Last Inspection Date",
      dataIndex: "lastInspectionDate",
      key: "lastInspectionDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Maintenance Status",
      dataIndex: "maintenanceStatus",
      key: "maintenanceStatus",
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
            onClick={() => fetchHouseDetail(record.id)}
            icon={<EyeOutlined />}
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
            placeholder="Search for houses"
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
              Add New House
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchHouses(newShowDeleted); // Gọi lại fetchHouses với giá trị mới của showDeleted
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Houses" : "Show Deleted Houses"}
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
          dataSource={houses}
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
            total: houses.length,
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

      {/* Modal for Create/Edit House */}
      <Modal
        title={editingHouse ? "Edit House" : "Add New House"}
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
        <Form form={form} layout="vertical" name="houseForm">
          <Form.Item
            name="houseName"
            label="House Name"
            rules={[{ required: true, message: "Please enter house name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="houseNumber"
            label="House Number"
            rules={[{ required: true, message: "Please enter house number" }]}
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

          <Form.Item name="houseMember" label="House Members">
            <Input />
          </Form.Item>

          <Form.Item name="houseOwner" label="House Owner">
            <Input />
          </Form.Item>

          <Form.Item name="userAccountId" label="User Account Id">
            <Input />
          </Form.Item>

          <Form.Item name="villageId" label="Village Id">
            <Input />
          </Form.Item>

          {/* <Form.Item name="roleName" label="Role Name">
            <Input />
          </Form.Item> */}

          <Form.Item 
          name="foundationDate" 
          label="Foundation Date"
          rules={[
            { required: true, message: "Please select foundation date" },
          ]}
          >
            <DatePicker format="YYYY-MM-DD"/>
          </Form.Item>

          {/* Last Inspection Date */}
          <Form.Item 
          name="lastInspectionDate" 
          label="Last Inspection Date"
          >
            <DatePicker format="YYYY-MM-DD"/>
          </Form.Item>

          {/* Maintenance Status */}
          <Form.Item name="maintenanceStatus" label="Maintenance Status">
            <Input />
          </Form.Item>

          {editingHouse && currentImages.length > 0 && (
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

          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>

          <Form.Item name="isDeleted" valuePropName="checked">
            <Checkbox>Deleted</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* View details */}
      <ViewDetailsHouse
        isVisible={isDetailModalVisible}
        house={detailHouse}
        onClose={() => setIsDetailModalVisible(false)}
      />

      {/* Modal for View Images */}
      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default HouseManagement;
