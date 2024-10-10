import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getHouses } from '../../../services/api';
import axios from 'axios';

const HouseManagement = () => {

  const [house, setHouse] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHouse, setEditingHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchHouses();
  }, []);
  
  const fetchHouses = async () => {
    try {
      setLoading(true);
      const data = await getHouses();
      setHouse(data);
      //console.log('Fetched houses data:', data);
    } catch (error) {
      console.log(error);
      message.error('Can not get houses data');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (house = null) => {
    setEditingHouse(house);
    if (house) {
      form.setFieldsValue({
        ...house,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        /*const formData = new FormData();
        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
          console.log([...formData]);
          console.log(values);
        });*/

        values.houseMember = parseInt(values.houseMember, 10);
        //console.log(values);

        if (editingHouse) {
          await axios.put(`https://localhost:7073/api/Houses/UpdateHouse?id=${editingHouse.id}`, values, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          message.success('Update House Successfully');
        } else {
          await axios.post('https://localhost:7073/api/Houses/CreateHouse', values, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          message.success('Add House Successfully');
        }

        setIsModalVisible(false);
        fetchHouses();
      } catch (error) {
        console.error('Error occurred when saving data:', error);
        message.error('Unable to save data');
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7073/api/Houses/DeleteHouse?id=${id}`);
      message.success('Delete House Successfully');
      fetchHouses();
    } catch (error) {
      console.error('Error occurred when deleting house:', error);
      message.error('Unable to delete house');
    }
  };

  const columns = [
    {
      title: 'House Id',
      dataIndex: 'id',
      key: 'id',
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
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button key={`edit-${record.id}`} onClick={() => showModal(record)} icon={<EditOutlined />} />
          <Button key={`delete-${record.id}`} onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
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
          <Button type="default" style={{ marginRight: 8 }}>
            Filter options
          </Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={house}
        loading={loading}
        rowKey={(record) => record.id}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: house.length,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} items`,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          position: ['bottomCenter'],
          itemRender: (_, type, originalElement) => {
            if (type === 'prev') {
              return <Button>Previous</Button>;
            }
            if (type === 'next') {
              return <Button>Next</Button>;
            }
            return originalElement;
          },
        }}
      />

      <Modal
        title={editingHouse ? "Update House" : "Add New House"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="houseName" label="House Name" rules={[{ required: true, message: 'Please enter house name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="houseNumber" label="House Number" rules={[{ required: true, message: 'Please enter house number' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter location' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="houseMember" label="House Members">
            <Input />
          </Form.Item>
          <Form.Item name="houseOwner" label="House Owner">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>
          <Form.Item name="userAccountId" label="User account Id">
            <Input />
          </Form.Item>
          <Form.Item name="villageId" label="Village Id">
            <Input />
          </Form.Item>
          <Form.Item name="isDeleted" valuePropName="checked">
            <Checkbox>Deleted</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HouseManagement;
