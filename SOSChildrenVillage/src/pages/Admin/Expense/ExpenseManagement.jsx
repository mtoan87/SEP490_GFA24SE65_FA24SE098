import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null); // ID của bản ghi đang chỉnh sửa
  const [form] = Form.useForm();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://soschildrenvillage.azurewebsites.net/api/Expenses/FormatedExpenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      message.error('Unable to fetch expenses data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateExpense = async () => {
    try {
      const values = await form.validateFields(); // Lấy dữ liệu từ form

      // Gán giá trị cho các wallet
      const wallets = {
        systemWalletId: null,
        facilitiesWalletId: null,
        foodStuffWalletId: null,
        healthWalletId: null,
        necessitiesWalletId: null,
      };

      // Chỉ gán `1` cho wallet được chọn
      wallets[`${values.wallet}Id`] = 1;

      const requestPayload = {
        expenseAmount: values.expenseAmount,
        description: values.description,
        houseId: values.houseId,
        ...wallets, // Thêm các field wallet vào payload
      };

      await axios.post('https://soschildrenvillage.azurewebsites.net/api/Expenses/CreateExpense', requestPayload);
      message.success('Expense created successfully');
      console.log(requestPayload);
      setIsModalVisible(false);
      fetchExpenses(); // Refresh danh sách expenses
    } catch (error) {
      console.error('Error creating expense:', error);
      message.error('Failed to create expense');
    }
  };


  const handleConfirmExpense = async (id) => {
    try {
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Expenses/ConfirmExpense?id=${id}`);
      message.success(`Expense ID ${id} has been approved successfully`);
      fetchExpenses(); // Refresh danh sách expenses
    } catch (error) {
      console.error('Error confirming expense:', error);
      message.error('Failed to confirm expense');
    }
  };
  const handleEditExpense = (record) => {
    form.setFieldsValue({
      expenseAmount: record.expenseAmount,
      description: record.description,
      houseId: record.houseId,
    });
    setCurrentEditId(record.id); // Lưu ID của bản ghi đang chỉnh sửa
    setIsEditModalVisible(true); // Hiển thị modal chỉnh sửa
  };

  const handleUpdateExpense = async () => {
    try {
      const values = await form.validateFields(); // Lấy dữ liệu từ form
      const requestPayload = {
        expenseAmount: values.expenseAmount,
        description: values.description,
        houseId: values.houseId,
      };
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Expenses/UpdateExpense?id=${currentEditId}`, requestPayload);
      message.success('Expense updated successfully');
      setIsEditModalVisible(false); // Đóng modal
      fetchExpenses(); // Tải lại danh sách expenses
    } catch (error) {
      console.error('Error updating expense:', error);
      message.error('Failed to update expense');
    }
  };
  const handleDeleteExpense = async (id) => {
    try {
      await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Expenses/SoftDelete?id=${id}`);
      message.success(`Expense ID ${id} has been deleted successfully`);
      fetchExpenses(); // Tải lại danh sách expenses sau khi xóa
    } catch (error) {
      console.error('Error deleting expense:', error);
      message.error('Failed to delete expense');
    }
  };  

  const columns = [
    {
      title: 'Expense ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Amount',
      dataIndex: 'expenseAmount',
      key: 'expenseAmount',
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Expense Day',
      dataIndex: 'expenseday',
      key: 'expenseday',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'House ID',
      dataIndex: 'houseId',
      key: 'houseId',
    },
    {
      title: 'Wallet',
      key: 'wallet',
      render: (text, record) => {
        const wallets = [];
        if (record.facilitiesWalletId) wallets.push('Facilities Wallet');
        if (record.foodStuffWalletId) wallets.push('Food Stuff Wallet');
        if (record.healthWalletId) wallets.push('Health Wallet');
        if (record.necessitiesWalletId) wallets.push('Necessities Wallet');
        if (record.systemWalletId) wallets.push('System Wallet');
        return wallets.length > 0 ? wallets.join(', ') : 'N/A';
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditExpense(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteExpense(record.id)} />
          <Button
            type="primary"
            onClick={() => handleConfirmExpense(record.id)}
            disabled={record.status === 'Approved'}
          >
            Confirm
          </Button>
        </Space>
      ),
    }
    
  ];

  return (
    <div>
      <h1>Expense Management</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddExpense}>
        Add New Expense
      </Button>
      <Table
        columns={columns}
        dataSource={expenses}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
      />

      <Modal
        title="Add New Expense"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateExpense}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="expenseAmount"
            label="Expense Amount"
            rules={[{ required: true, message: 'Please enter the expense amount' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="houseId"
            label="House ID"
            rules={[{ required: true, message: 'Please enter the house ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="wallet"
            label="Wallet"
            rules={[{ required: true, message: 'Please select a wallet' }]}
          >
            <Select>
              <Option value="systemWallet">System Wallet</Option>
              <Option value="facilitiesWallet">Facilities Wallet</Option>
              <Option value="foodStuffWallet">Food Stuff Wallet</Option>
              <Option value="healthWallet">Health Wallet</Option>
              <Option value="necessitiesWallet">Necessities Wallet</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Expense"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateExpense}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="expenseAmount"
            label="Expense Amount"
            rules={[{ required: true, message: 'Please enter the expense amount' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="houseId"
            label="House ID"
            rules={[{ required: true, message: 'Please enter the house ID' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default ExpenseManagement;
