import { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import axios from "axios";
import { getAccount } from "../../../services/api";
import moment from "moment";

const { Option } = Select;
const { Dragger } = Upload;

const UserManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Thêm trạng thái searchTerm

  useEffect(() => {
    fetchUserAccounts();
  }, [showDeleted, searchTerm]); // Thêm searchTerm vào dependency

  const fetchUserAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAccount(showDeleted, searchTerm); // Thêm searchTerm vào hàm gọi API
      setAccounts(Array.isArray(data) ? data : []);
      console.log("Fetched Accounts:", data); // Xem toàn bộ dữ liệu trả về
    } catch (error) {
      console.error("Error fetching user accounts:", error);
      message.error("Cannot fetch user accounts.");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value); // Cập nhật từ khóa tìm kiếm
    fetchUserAccounts(); // Gọi lại danh sách tài khoản mỗi khi thay đổi từ khóa tìm kiếm
  };

  const showModal = (account = null) => {
    setEditingAccount(account);
    if (account) {
      form.setFieldsValue({
        ...account,
        dob: account.dob ? moment(account.dob) : null,
      });
      // Update cái state currentImages khi mở modal edit
      setCurrentImages(
        account.imageUrls?.map((url, index) => ({
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
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();

        formData.append("userName", values.userName || "");
        formData.append("userEmail", values.userEmail || "");
        formData.append("password", values.password || "");
        formData.append("phone", values.phone ? Number(values.phone) : "");
        formData.append("address", values.address || "");
        formData.append("dob", values.dob.format("YYYY-MM-DD"));
        formData.append("gender", values.gender || "");
        formData.append("country", values.country || "");
        formData.append("status", values.status || "");
        formData.append("roleId", values.roleId ? Number(values.roleId) : "");
        formData.append("isDeleted", values.isDeleted ? "true" : "false");

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

        if (editingAccount) {
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/UserAccount/UpdateUser?id=${editingAccount.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          message.success("Updated User Successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/UserAccount/CreateUser",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          message.success("Added User Successfully");
        }
        setIsModalVisible(false);
        setUploadFiles([]);
        form.resetFields();
        fetchUserAccounts();
      } catch (error) {
        console.error("Error saving user:", error);
        message.error("Unable to save user.");
      }
    });
  };
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      // centered: true,
      footer: (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Button
            type="primary"
            danger
            style={{ width: "120px" }} // Nút Yes
            onClick={async () => {
              try {
                const deleteUrl = `https://soschildrenvillage.azurewebsites.net/api/UserAccount/DeleteUser?id=${id}`;
                console.log("Deleting user with ID:", id);

                const response = await axios.delete(deleteUrl);
                console.log("Delete response:", response.data);

                message.success("User deleted successfully");
                Modal.destroyAll(); // Đóng Modal sau khi xóa thành công
                fetchUserAccounts();
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
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/UserAccount/RestoreUser?id=${id}`
      );
      message.success("User Restored Successfully");
      fetchUserAccounts(showDeleted);
    } catch (error) {
      console.error("Error occurred when restoring user:", error);
      message.error("Unable to restore user");
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Role ID",
      dataIndex: "roleId",
      key: "roleId",
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
            placeholder="Search user"
            prefix={<SearchOutlined />}
            style={{ width: 400, marginRight: 8 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Gán giá trị cho searchTerm
            onPressEnter={() => fetchUserAccounts()} // Tìm kiếm khi nhấn Enter
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
              Add New User
            </Button>

            <Button
              onClick={() => {
                setShowDeleted((prev) => {
                  const newShowDeleted = !prev;
                  fetchUserAccounts(newShowDeleted);
                  return newShowDeleted;
                });
              }}
              type="default"
            >
              {showDeleted ? "Show Active User" : "Show Deleted User"}
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
          dataSource={accounts}
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
            total: accounts.length,
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
        title={editingAccount ? "Update User Account" : "Add New User Account"}
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
            name="userName"
            label="User Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userEmail"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !editingAccount, message: "Please enter password" }, // Only required if creating a new user
              { min: 8, message: "Password must be at least 8 characters" }, // Adjust as needed
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "Phone number must be numeric",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
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

          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value={1}>Admin</Option>
              <Option value={2}>Staff</Option>
              <Option value={3}>Sponsor</Option>
              <Option value={4}>Donor</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          {editingAccount && currentImages.length > 0 && (
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

          <Form.Item name="isDeleted" valuePropName="checked">
            <Checkbox>Deleted</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
