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
  InboxOutlined,
  //EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getInventoryWithImages } from "../../../services/api";
import axios from "axios";
import moment from "moment";

const { Dragger } = Upload;

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("roleId");

    if (!token || !["1", "3", "4"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/home");
        messageShown.current = true;
      }
    } else {
      fetchInventoryItems();
    }
  }, [navigate, redirecting]);

  const fetchInventoryItems = async (showDeleted = false) => {
    try {
      setLoading(true);
      const data = await getInventoryWithImages(showDeleted);
      setInventoryItems(Array.isArray(data) ? data : []);
      console.log("Fetched Inventory data with images:", data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch Inventory items data.");
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue({
        ...item,
        purchaseDate: item.purchaseDate ? moment(item.purchaseDate) : null,
        lastInspectionDate: item.lastInspectionDate
          ? moment(item.lastInspectionDate)
          : null,
        imageUrls: item.imageUrls || [],
      });

      setCurrentImages(
        item.imageUrls?.map((url, index) => ({
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
          if (!editingItem && !values.maintenanceStatus) {
            values.maintenanceStatus = "Good";
          }

          const formData = new FormData();
          formData.append("ItemName", values.itemName);
          formData.append("Description", values.description || "");
          formData.append("Quantity", values.quantity || 0);
          formData.append("Purpose", values.purpose || "");
          formData.append("BelongsTo", values.belongsTo);
          formData.append("BelongsToId", values.belongsToId);
          formData.append(
            "PurchaseDate",
            values.purchaseDate.format("YYYY-MM-DD")
          );
          formData.append(
            "LastInspectionDate",
            values.lastInspectionDate
              ? values.lastInspectionDate.format("YYYY-MM-DD")
              : ""
          );

          formData.append(
            "MaintenanceStatus",
            values.maintenanceStatus || "Good"
          );

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

          if (editingItem) {
            const updateUrl = `https://soschildrenvillage.azurewebsites.net/api/Inventory/UpdateInventory/${editingItem.id}`;
            await axios.put(updateUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("Inventory item updated successfully.");
          } else {
            await axios.post(
              "https://soschildrenvillage.azurewebsites.net/api/Inventory/CreateInventory",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            message.success("Inventory item created successfully.");
          }

          setIsModalVisible(false);
          setUploadFiles([]);
          setCurrentImages([]);
          setImagesToDelete([]);
          form.resetFields();
          fetchInventoryItems();
        } catch (error) {
          console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: editingItem ? "UpdateInventory" : "CreateInventory",
          });

          message.error(
            error.response?.data?.message ||
              `Unable to ${
                editingItem ? "update" : "create"
              } inventory item. Please try again.`
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
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Inventory/DeleteInventory/${id}`;
          console.log("Deleting inventory item with ID:", id);

          const response = await axios.delete(deleteUrl);
          console.log("Delete response:", response.data);

          message.success("Inventory item deleted successfully.");
          fetchInventoryItems();
        } catch (error) {
          console.error("Delete error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });

          message.error(
            error.response?.data?.message ||
              "Unable to delete item. Please try again."
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
        `https://soschildrenvillage.azurewebsites.net/api/Inventory/RestoreInventory/${id}`
      );
      message.success("Inventory item restored successfully.");
      fetchInventoryItems(showDeleted);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to restore inventory item.");
    }
  };

  const columns = [
    {
      title: "Item Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Belongs To",
      dataIndex: "belongsTo",
      key: "belongsTo",
    },
    {
      title: "Belongs To Id",
      dataIndex: "belongsToId",
      key: "belongsToId",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
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
            placeholder="Search for items"
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
              Add New Items
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchInventoryItems(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active Items" : "Show Deleted Items"}
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
          dataSource={inventoryItems}
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
            total: inventoryItems.length,
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
        title={editingItem ? "Edit Item" : "Add New Item"}
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
        <Form form={form} layout="vertical" name="inventoryForm">
          <Form.Item
            name="itemName"
            label="Item Name"
            rules={[{ required: true, message: "Please enter item name" }]}
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
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[{ required: true, message: "Please enter purpose" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="belongsTo"
            label="Belongs To"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select Belongs To">
              <Select.Option value="Village">Village</Select.Option>
              <Select.Option value="House">House</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="belongsToId" label="Belongs To Id">
            <Input />
          </Form.Item>

          <Form.Item
            name="purchaseDate"
            label="Purchase Date"
            rules={[{ required: true, message: "Please select purchase date" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="lastInspectionDate" label="Last Inspection Date">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="maintenanceStatus" label="Maintenance Status">
            <Input />
          </Form.Item>

          {editingItem && currentImages.length > 0 && (
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
      {/* <ViewDetailsVillage
        isVisible={isDetailModalVisible}
        village={detailVillage}
        onClose={() => setIsDetailModalVisible(false)}
      /> */}
    </div>
  );
};
export default InventoryManagement;
