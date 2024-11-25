import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { saveAs } from 'file-saver';

const { Option } = Select;

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      const values = await form.validateFields();
      const wallets = {
        systemWalletId: null,
        facilitiesWalletId: null,
        foodStuffWalletId: null,
        healthWalletId: null,
        necessitiesWalletId: null,
      };
      wallets[`${values.wallet}Id`] = 1;

      const requestPayload = {
        expenseAmount: values.expenseAmount,
        description: values.description,
        houseId: values.houseId,
        ...wallets,
      };

      await axios.post('https://soschildrenvillage.azurewebsites.net/api/Expenses/CreateExpense', requestPayload);
      message.success('Expense created successfully');
      setIsModalVisible(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
      message.error('Failed to create expense');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(
        'https://soschildrenvillage.azurewebsites.net/api/Expenses/ExportExcel',
        {
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Expense_Report_${new Date().toISOString()}.xlsx`);
      message.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      message.error('Failed to download report');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description?.toLowerCase().includes(searchTerm) ||
      expense.houseId?.toString().includes(searchTerm) ||
      expense.id?.toString().includes(searchTerm)
  );

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
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input placeholder="Search for houses" prefix={<SearchOutlined />} style={{ width: 200, marginRight: 16 }} />
          <Button onClick={handleAddExpense} type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }}>
            Add New Expense
          </Button>
          <Button onClick={handleDownloadReport} type="default" icon={<DownloadOutlined />}>
            Download Report
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredExpenses}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ showSizeChanger: true, defaultPageSize: 10, pageSizeOptions: ['10', '20', '50', '100'] }}
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
    </div>
  );
};

export default ExpenseManagement;
