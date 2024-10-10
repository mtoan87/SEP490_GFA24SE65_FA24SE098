import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, DatePicker, message, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getChild } from '../../../services/api';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const ChildrenManagement = () => {

  const [children, setChildren] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingChild, setEditingChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchChildren();
  }, []);
  
  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await getChild();
      setChildren(data);
      //console.log('Fetched children data:', data);
    } catch (error) {
      console.log(error);
      message.error('Can not get children data');
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
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        /* const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key === 'dob') {
            formData.append(key, values[key].format('YYYY-MM-DD'));
          } else {
            formData.append(key, values[key]);
          }
          console.log([...formData]);
          console.log(values);
        }); */

        const formData = {
          childName: values.childName,
          healthStatus: values.healthStatus,
          houseId: values.houseId,
          gender: values.gender,
          dob: values.dob.format('YYYY-MM-DD'),
          status: values.status,
          isDeleted: values.isDeleted || false,
        };
        //console.log(formData);

      if (editingChild) {
        await axios.put(`https://localhost:7073/api/Children/UpdateChild?id=${editingChild.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Update Children Successfully');
      } else {
        await axios.post('https://localhost:7073/api/Children/CreateChild', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Add Children Successfully');
      }
      setIsModalVisible(false);
      fetchChildren();
    } catch (error) {
      console.error('Error occurred when save data:', error);
      message.error('Unable to save data');
    }
  });
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7073/api/Children/DeleteChild?id=${id}`);
      message.success('Delete ChildrenSuccessfully');
      fetchChildren();
    } catch (error) {
      console.error('Error occurred when delete children:', error);
      message.error('Unable to delete children');
    }
  };

  // QUAN TRỌNG: dataIndex và key phải giống với tên của các biến trong API.
  const columns = [
    {
      title: 'Child Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Child Name',
      dataIndex: 'childName',
      key: 'childName',
    },
    {
      title: 'Health Status',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
    },
    {
      title: 'House Id',
      dataIndex: 'houseId',
      key: 'houseId',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (date) => moment(date).isValid() ? moment(date).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
          <Input placeholder="Search for children" prefix={<SearchOutlined />} style={{ width: 200, marginRight: 16 }} />
          <Button onClick={() => showModal()} type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }}>
            Add New Children
          </Button>
          <Button type="default" style={{ marginRight: 8 }}>
            Filter options
          </Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={children}
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
          total: children.length,
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
        title={editingChild ? "Update Children" : "Add New Children"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="childName" label="Child Name" rules={[{ required: true, message: 'Please enter child name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="healthStatus" label="Health Status">
            <Input />
          </Form.Item>
            <Form.Item name="houseId" label="House Id">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="status" label="Status">
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

export default ChildrenManagement;