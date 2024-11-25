import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const IncomeManagement = () => {
  const [incomes, setIncomes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7073/api/Incomes/FormatedIncome');
      setIncomes(response.data);
    } catch (error) {
      message.error('Failed to fetch income data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = () => {
    form.resetFields();
    setEditingIncome(null);
    setIsModalVisible(true);
  };

  const handleEditIncome = (income) => {
    form.setFieldsValue({ amount: income.amount }); // Chỉ thiết lập amount
    setEditingIncome(income);
    setIsModalVisible(true);
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      await axios.put(`https://localhost:7073/api/Incomes/SoftDelete?id=${incomeId}`);
      message.success('Income deleted successfully');
      fetchIncomes();
    } catch (error) {
      message.error('Failed to delete income', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Lấy giá trị từ form
  
      if (editingIncome) {
        // Edit chỉ cập nhật amount
        const logDetails = {
          oldAmount: editingIncome.amount,
          newAmount: values.amount,
          incomeId: editingIncome.id,
        };
  
        console.log('Edit Log:', logDetails); // Ghi log ra console
        // Nếu cần ghi log vào backend:
        // await axios.post('https://your-backend-api/log', logDetails);
  
        await axios.put(
          `https://localhost:7073/api/Incomes/UpdateIncome?id=${editingIncome.id}`,
          { amount: values.amount } // Payload chỉ chứa amount
        );
        message.success('Income amount updated successfully');
      } else {
        // Create mới
        const requestPayload = {
          donationId: values.donationId,
          facilitiesWalletId: values.facilitiesWalletId,
          foodStuffWalletId: values.foodStuffWalletId,
          healthWalletId: values.healthWalletId,
          necessitiesWalletId: values.necessitiesWalletId,
          systemWalletId: values.systemWalletId,
        };
  
        await axios.post('https://localhost:7073/api/Incomes/CreateIncome', requestPayload);
        message.success('Income added successfully');
      }
  
      setIsModalVisible(false);
      fetchIncomes(); // Refresh danh sách income
    } catch (error) {
      console.error('Error submitting income:', error.response || error);
      message.error('Failed to submit');
    }
  };
  

  const columns = [
    {
      title: 'Donation ID',
      dataIndex: 'donationId',
      key: 'donationId',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => (text != null ? `${text.toLocaleString()} VND` : 'N/A'),
    },
    {
      title: 'Receive Day',
      dataIndex: 'receiveDay',
      key: 'receiveDay',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Wallet',
      key: 'wallet',
      render: (text, income) => {
        const wallets = [];
        if (income.facilitiesWalletId) wallets.push('Facilities Wallet');
        if (income.foodStuffWalletId) wallets.push('Food Stuff Wallet');
        if (income.healthWalletId) wallets.push('Health Wallet');
        if (income.necessitiesWalletId) wallets.push('Necessities Wallet');
        if (income.systemWalletId) wallets.push('System Wallet');

        return wallets.length > 0 ? wallets.join(', ') : 'N/A';
      },
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, income) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditIncome(income)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteIncome(income.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input placeholder="Search for houses" prefix={<SearchOutlined />} style={{ width: 200, marginRight: 16 }} />
          <Button onClick={handleAddIncome} type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }}>
            Add New Income
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={incomes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ marginTop: '20px' }}
      />

      <Modal
        title={editingIncome ? 'Edit Income' : 'Add Income'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText={editingIncome ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          {editingIncome ? (
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please input the amount!' }]}
            >
              <Input type="number" />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="donationId"
                label="Donation ID"
                rules={[{ required: true, message: 'Please input donation ID!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="facilitiesWalletId"
                label="Facilities Wallet ID"
                rules={[{ required: true, message: 'Please input the facilities wallet ID!' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="foodStuffWalletId" label="Food Stuff Wallet ID">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="healthWalletId" label="Health Wallet ID">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="necessitiesWalletId" label="Necessities Wallet ID">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="systemWalletId" label="System Wallet ID">
                <Input type="number" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default IncomeManagement;
