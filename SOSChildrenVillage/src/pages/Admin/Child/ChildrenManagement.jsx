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
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
  EyeOutlined,
  SwapOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getChildWithImages } from "../../../services/api";
import { getChildDetail } from "../../../services/api";
import { getTransferRequest } from "../../../services/api";
import ChildrenTransfer from "./ChildrenTransfer";
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailChild, setDetailChild] = useState(null);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [transferRequests, setTransferRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [healthStatus, setHealthStatus] = useState('Good');
  const [schools, setSchools] = useState([]);
  const [houses, setHouses] = useState([]);

  const navigate = useNavigate();
  const messageShown = useRef(false); // Use a ref to track message display

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("roleId");

    if (!token || !["1", "3", "6"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/home");
        messageShown.current = true; // Set ref to true after showing message
      }
    } else {
      fetchChildren();
    }
  }, [navigate, redirecting, showDeleted, searchTerm]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await getChildWithImages(showDeleted, searchTerm);
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

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://soschildrenvillage.azurewebsites.net/api/School");
        const villageData = Array.isArray(response.data.$values) ? response.data.$values : [];
        setSchools(villageData);
      } catch (error) {
        message.error("Failed to fetch villages");
        console.error("Error fetching villages:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHouses = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://soschildrenvillage.azurewebsites.net/api/Houses");
        const villageData = Array.isArray(response.data.$values) ? response.data.$values : [];
        setHouses(villageData);
      } catch (error) {
        message.error("Failed to fetch villages");
        console.error("Error fetching villages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
    fetchHouses();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value); // Cập nhật từ khóa tìm kiếm
    fetchChildren(); // Gọi lại danh sách tài khoản mỗi khi thay đổi từ khóa tìm kiếm
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

  const fetchTransferRequests = async () => {
    try {
      const data = await getTransferRequest(); //them await de cho khi co data
      setTransferRequests(data?.$values || []);
    } catch (error) {
      console.error("Error fetching transfer requests:", error);
    }
  };

  // Gọi fetchTransferRequests trong useEffect
  useEffect(() => {
    const loadTransferRequests = async () => {
      await fetchTransferRequests();
    };
    loadTransferRequests();
  }, []);

  const isChildInTransfer = (childId) => {
    return transferRequests.some(
      (request) =>
        request.childId === childId &&
        ["Pending", "InProcess", "ReadyToTransfer", "DeclinedToTransfer"].includes(request.status)
    );
  };

  const getTransferStatus = (childId) => {
    const request = transferRequests.find(
      (req) =>
        req.childId === childId &&
        ["Pending", "InProcess", "ReadyToTransfer", "DeclinedToTransfer"].includes(req.status)
    );

    if (!request) return null;

    const statusDisplay = {
      Pending: "Pending",
      InProcess: "In Process",
      ReadyToTransfer: "Ready",
      DeclinedToTransfer: "Declined",
    };

    return statusDisplay[request.status];
  };

  const renderTransferButton = (record) => {
    const userRole = localStorage.getItem("roleId");
    const transferStatus = getTransferStatus(record.id);

    if (userRole === "3" && transferStatus === "In Process") {
      return (
        <Space>
          <Button
            type="primary"
            onClick={() => handleAccept(record.id)}
            icon={<CheckOutlined />}
          >
            Accept
          </Button>
          <Button
            danger
            onClick={() => handleDecline(record.id)}
            icon={<CloseOutlined />}
          >
            Decline
          </Button>
        </Space>
      );
    }

    return (
      <Button
        onClick={() => showTransferModal(record)}
        icon={<SwapOutlined />}
        disabled={isChildInTransfer(record.id)}
        style={
          isChildInTransfer(record.id)
            ? { backgroundColor: "#f0f0f0" }
            : {}
        }
      >
        {getTransferStatus(record.id) || "Transfer"}
      </Button>
    );
  };

  const showTransferModal = (child) => {
    if (isChildInTransfer(child.id)) {
      message.warning("This child is already in transfer process");
      return;
    }
    setSelectedChild(child);
    setIsTransferModalVisible(true);
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
          if (!editingChild && !values.status) {
            values.status = "Active";
          }
          const formData = new FormData();

          formData.append("childName", values.childName);
          formData.append("healthStatus", values.healthStatus || "");
          formData.append("houseId", values.houseId || "");
          formData.append("schoolId", values.schoolId || "");
          formData.append(
            "facilitiesWalletId",
            values.facilitiesWalletId || ""
          );
          formData.append("systemWalletId", values.systemWalletId || "");
          formData.append("foodStuffWalletId", values.foodStuffWalletId || "");
          formData.append("healthWalletId", values.healthWalletId || "");
          formData.append(
            "necessitiesWalletId",
            values.necessitiesWalletId || ""
          );

          formData.append("amount", values.amount || 0);
          formData.append("currentAmount", values.currentAmount || 0);
          formData.append("amountLimit", values.amountLimit || 0);
          formData.append("gender", values.gender);
          formData.append("dob", values.dob.format("YYYY-MM-DD"));
          formData.append("status", values.status || "Active");

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
      title: "Are you sure you want to delete this children?",
      // centered: true,
      footer: (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Button
            type="primary"
            danger
            style={{ width: "120px" }} // Nút Yes
            onClick={async () => {
              try {
                const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/Children/DeleteChild/${id}`;
                console.log("Deleting children with ID:", id);

                const response = await axios.delete(deleteUrl);
                console.log("Delete response:", response.data);

                message.success("Children deleted successfully");
                Modal.destroyAll();
                fetchChildren();
              } catch (error) {
                console.error("Delete error details:", {
                  message: error.message,
                  response: error.response?.data,
                  status: error.response?.status,
                });

                message.error(
                  error.response?.data?.message ||
                    "Unable to delete user. Please try again."
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
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Children/RestoreChild/${id}`);
      message.success("Child Restored Successfully");
      fetchChildren(showDeleted); // Không thay đổi state showDeleted sau khi khôi phục
    } catch (error) {
      console.error("Error occurred when restoring child:", error);
      message.error("Unable to restore child");
    }
  };

  const handleAccept = async (childId) => {
    try {
      const transferRequest = transferRequests.find(
        (req) => req.childId === childId && req.status === "InProcess"
      );

      if (!transferRequest) {
        message.error("Transfer request not found");
        return;
      }

      const formData = new FormData();
      formData.append("id", transferRequest.id);
      formData.append("childId", transferRequest.childId);
      formData.append("fromHouseId", transferRequest.fromHouseId);
      formData.append("toHouseId", transferRequest.toHouseId);
      formData.append("requestReason", transferRequest.requestReason);
      formData.append("status", "ReadyToTransfer");
      formData.append("modifiedBy", localStorage.getItem("userId"));
      formData.append("directorNote", "Accepted by House Mother");

      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${transferRequest.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Transfer request accepted successfully");
      await fetchTransferRequests();
      await fetchChildren();
    } catch (error) {
      console.error("Error accepting transfer request:", error);
      message.error(
        error.response?.data?.message || "Failed to accept transfer request"
      );
    }
  };

  const handleDecline = async (childId) => {
    try {
      const transferRequest = transferRequests.find(
        (req) => req.childId === childId && req.status === "InProcess"
      );

      if (!transferRequest) {
        message.error("Transfer request not found");
        return;
      }

      const formData = new FormData();
      formData.append("id", transferRequest.id);
      formData.append("childId", transferRequest.childId);
      formData.append("fromHouseId", transferRequest.fromHouseId);
      formData.append("toHouseId", transferRequest.toHouseId);
      formData.append("requestReason", transferRequest.requestReason);
      formData.append("status", "DeclinedToTransfer");
      formData.append("modifiedBy", localStorage.getItem("userId"));
      formData.append("directorNote", "Declined by House Mother");

      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${transferRequest.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Transfer request declined successfully");
      await fetchTransferRequests();
      await fetchChildren();
    } catch (error) {
      console.error("Error declining transfer request:", error);
      message.error(
        error.response?.data?.message || "Failed to decline transfer request"
      );
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
    // {
    //   title: "House Id",
    //   dataIndex: "houseId",
    //   key: "houseId",
    // },
    {
      title: "House",
      dataIndex: "houseName",
      key: "houseName",
    },
    // {
    //   title: "School Id",
    //   dataIndex: "schoolId",
    //   key: "schoolId",
    // },
    {
      title: "School",
      dataIndex: "schoolName",
      key: "schoolName",
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
      render: (_, record) => {
        return (
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
                  onClick={() => fetchChildrenDetail(record)}
                  icon={<EyeOutlined />}
                />

                <Button
                  key={`delete-${record.id}`}
                  onClick={() => handleDelete(record.id)}
                  icon={<DeleteOutlined />}
                  danger
                />

                {renderTransferButton(record)}
              </>
            )}

            {showDeleted && (
              <Button type="primary" onClick={() => handleRestore(record.id)}>
                Restore
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const sortedchildren = children.sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );

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
            placeholder="Search children"
            prefix={<SearchOutlined />}
            style={{ width: 400, marginRight: 8 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Gán giá trị cho searchTerm
            onPressEnter={() => fetchChildren()}
          />
          <Button
            type="primary"
            style={{ width: 100, marginRight: 8 }}
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchTerm)}
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
              Add New Children
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
          dataSource={sortedchildren}
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
        <Form 
          form={form} 
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ('healthStatus' in changedValues) {
              setHealthStatus(changedValues.healthStatus);
              // Reset wallet selection when health status changes
              if (changedValues.healthStatus !== 'Bad') {
                form.setFieldsValue({ walletType: undefined });
              }
            }
          }}
        >
          <Form.Item
            name="childName"
            label="Child Name"
            rules={[{ required: true, message: "Please enter child name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            name="healthStatus" 
            label="Health Status"
            rules={[{ required: true, message: "Please select health status" }]}
          >
            <Select>
              <Option value="Good">Good</Option>
              <Option value="Bad">Bad</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="houseId"
            label="House"
            rules={[{ required: true, message: "Please select a House" }]}
          >
            <Select
              placeholder="Select a director"
              allowClear
              loading={loading}
            >
              {houses.map((house) => (
                <Option key={house.id} value={house.id}>
                  {house.houseName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="schoolId"
            label="School"
            rules={[{ required: true, message: "Please select a director" }]}
          >
            <Select
              placeholder="Select a director"
              allowClear
              loading={loading}
            >
              {schools.map((school) => (
                <Option key={school.id} value={school.id}>
                  {school.schoolName}
                </Option>
              ))}
            </Select>
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

          {healthStatus === 'Bad' && (
        <>
          <Form.Item 
            name="walletType" 
            label="Wallet" 
            rules={[{ required: true, message: 'Please select a wallet type' }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select wallet type"
            >
              <Option value="systemWalletId">System Wallet</Option>
              <Option value="facilitiesWalletId">Facilities Wallet</Option>
              <Option value="foodStuffWalletId">Food Stuff Wallet</Option>
              <Option value="healthWalletId">Health Wallet</Option>
              <Option value="necessitiesWalletId">Necessities Wallet</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <Input type="number" />
          </Form.Item>
        </>
      )}

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
                      src={image.url || "/placeholder.svg"}
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

      {/* View details */}
      <ViewDetailsChildren
        isVisible={isDetailModalVisible}
        child={detailChild}
        onClose={() => setIsDetailModalVisible(false)}
      />

      <ChildrenTransfer
        isVisible={isTransferModalVisible}
        onClose={() => setIsTransferModalVisible(false)}
        child={selectedChild}
        onTransferSuccess={async () => {
          await fetchTransferRequests(); // Ensure this completes first
          await fetchChildren(); // Then fetch children
        }}
      />
    </div>
  );
};

export default ChildrenManagement;