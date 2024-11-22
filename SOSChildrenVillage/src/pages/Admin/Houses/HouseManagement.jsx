import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message, Upload, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate từ react-router-dom

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [redirecting, setRedirecting] = useState(false); // Thêm trạng thái để kiểm soát việc điều hướng


  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const userRole = localStorage.getItem('roleId');
    if (userRole !== '1' && !redirecting) {
      // Chỉ hiển thị thông báo và điều hướng nếu chưa điều hướng
      message.error('You do not have permission to access this page');
      setRedirecting(true); // Đặt trạng thái redirecting là true khi điều hướng
      navigate('/login');
    } else {
      fetchHouses(); // Nếu có quyền, tiếp tục lấy danh sách nhà
    }
  }, [navigate, redirecting]); // Thêm redirecting vào dependencies để tránh render lại không cần thiết

  const fetchHouses = async (showDeleted = false) => {
    try {
      setLoading(true);
      const url = showDeleted
        ? 'https://localhost:7073/api/Houses/FormatedHouseIsDelete' // Nhà đã xóa
        : 'https://localhost:7073/api/Houses/FormatedHouse'; // Nhà chưa xóa
      const response = await axios.get(url);
      setHouses(response.data);
    } catch (error) {
      console.log(error);
      message.error('Cannot get houses data');
    } finally {
      setLoading(false);
    }
  };



  const showModal = (house = null) => {
    setEditingHouse(house);
    if (house) {
      form.setFieldsValue({
        ...house,
        imageUrls: house.imageUrls || [],
      });
      setCurrentImages(
        house.imageUrls?.map((url, index) => ({
          uid: index,
          url: url,
          status: 'done',
          name: `Image ${index + 1}`,
        })) || []
      );
    } else {
      form.resetFields();
      setCurrentImages([]);
    }
    setImagesToDelete([]);
    setNewImages([]);
    setIsModalVisible(true);
  };

  const uploadProps = {
    name: 'images',
    multiple: true,
    fileList: uploadFiles,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
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
        // Gán giá trị mặc định cho Status nếu không có
        if (!editingHouse && !values.status) {
          values.status = 'Active';
        }

        const formData = new FormData();
        formData.append('HouseName', values.houseName);
        formData.append('HouseNumber', values.houseNumber);
        formData.append('Location', values.location);
        formData.append('Description', values.description);
        formData.append('HouseMember', values.houseMember);
        formData.append('HouseOwner', values.houseOwner);
        formData.append('Status', values.status); // Đảm bảo giá trị này được gửi
        formData.append('UserAccountId', values.userAccountId);
        formData.append('VillageId', values.villageId);

        // Append các hình ảnh
        if (uploadFiles && uploadFiles.length > 0) {
          uploadFiles.forEach((file) => {
            if (file.originFileObj) {
              formData.append('Img', file.originFileObj);
            }
          });
        }
        if (imagesToDelete.length > 0) {
          imagesToDelete.forEach((imageId) => {
            formData.append("ImgToDelete", imageId);
          });
        }

        if (editingHouse) {
          // Update house logic
          const updateUrl = `https://localhost:7073/api/Houses/UpdateHouse?id=${editingHouse.houseId}`;
          await axios.put(updateUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          message.success('Update House Successfully');
        } else {
          // Create new house logic
          await axios.post('https://localhost:7073/api/Houses/CreateHouse', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          message.success('Add House Successfully');
        }

        setIsModalVisible(false);
        setUploadFiles([]);
        setCurrentImages([]);
        setImagesToDelete([]);
        form.resetFields();
        fetchHouses();
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          endpoint: editingHouse ? 'UpdateHouse' : 'CreateHouse',
        });

        message.error(
          error.response?.data?.message ||
          `Unable to ${editingHouse ? 'update' : 'create'} house. Please try again.`
        );
      }
    }).catch((formError) => {
      console.error('Form validation errors:', formError);
      message.error('Please check all required fields');
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`https://localhost:7073/api/Houses/SoftDeleteHouse?id=${id}`);
      message.success('Delete House Successfully');
      fetchHouses();
    } catch (error) {
      console.error('Error occurred when deleting house:', error);
      message.error('Unable to delete house');
    }
  };

  const handleRestore = async (houseId) => {
    try {
      await axios.put(`https://localhost:7073/api/Houses/SoftRestoreHouse?id=${houseId}`);
      message.success('House Restored Successfully');
      fetchHouses(showDeleted); // Không thay đổi state showDeleted sau khi khôi phục
    } catch (error) {
      message.error('Unable to restore house');
    }
  };


  const columns = [
    {
      title: 'House Id',
      dataIndex: 'houseId',
      key: 'houseId',
    },
    {
      title: 'House Name',
      dataIndex: 'houseName',
      key: 'houseName',
    },
    {
      title: 'House Number',
      dataIndex: 'houseNumber',
      key: 'houseNumber',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'House Members',
      dataIndex: 'houseMember',
      key: 'houseMember',
    },
    {
      title: 'House Owner',
      dataIndex: 'houseOwner',
      key: 'houseOwner',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'User account Id',
      dataIndex: 'userAccountId',
      key: 'userAccountId',
    },
    {
      title: 'Village Id',
      dataIndex: 'villageId',
      key: 'villageId',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
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
            display: 'block',
            width: '100%'
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Chỉ hiển thị nút Edit và Delete nếu House chưa bị xóa */}
          {!showDeleted && (
            <>
              <Button onClick={() => showModal(record)} icon={<EditOutlined />} />
              <Popconfirm
                title="Are you sure to delete this booking?"
                key={record.houseId}
                onConfirm={() => handleDelete(record.houseId)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                  style: { fontSize: '12px', padding: '4px 8px', width: '120px' }, // Style cho nút Yes
                }}
                cancelButtonProps={{
                  style: { fontSize: '12px', padding: '4px 8px', width: '120px' }, // Style cho nút No
                }}
              >
                <Button icon={<DeleteOutlined />} danger>

                </Button>
              </Popconfirm>
            </>
          )}
          {/* Hiển thị nút Restore nếu House đã bị xóa */}
          {showDeleted && (
            <Button
              type="primary"
              onClick={() => handleRestore(record.houseId)}
            >
              Restore
            </Button>
          )}
        </Space>
      ),
    },
  ];


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input placeholder="Search for houses" prefix={<SearchOutlined />} style={{ width: 200, marginRight: 16 }} />
          <Button onClick={() => showModal()} type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }}>
            Add New House
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
            {showDeleted ? 'Show Active Houses' : 'Show Deleted Houses'}
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={houses}
        loading={loading}
        rowKey="houseId"
        pagination={{
          current: currentPage,
          pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />

      {/* Modal for Create/Edit House */}
      <Modal
        title={editingHouse ? 'Edit House' : 'Create New House'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalVisible(false)}
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              width: '100px', // Adjust the width to make the button more compact
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              width: '100px', // Adjust the width to make the button more compact
            }}
          >
            Ok
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="houseForm">
          <Form.Item name="houseName" label="House Name" rules={[{ required: true, message: 'Please enter house name' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="houseNumber" label="House Number" rules={[{ required: true, message: 'Please enter house number' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter location' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
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
          <Form.Item name="imageUrls" label="Images">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for View Images */}
      <Modal
        title="View Images"
        visible={isImageModalVisible}
        footer={null}
        onCancel={() => setIsImageModalVisible(false)}
        width={800}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {selectedImages.map((url, index) => (
            <div key={index} style={{ width: '150px', textAlign: 'center' }}>
              <img src={url} alt={`image-${index}`} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default HouseManagement;
