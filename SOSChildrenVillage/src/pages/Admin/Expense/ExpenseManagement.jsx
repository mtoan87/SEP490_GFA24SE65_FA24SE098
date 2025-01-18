import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { saveAs } from "file-saver";

const { Option } = Select;

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [roleId, setRoleId] = useState(null);
  const [specialExpenses, setSpecialExpenses] = useState([]);
  const [isSpecialExpenseModalVisible, setIsSpecialExpenseModalVisible] =
    useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const storedRoleId = localStorage.getItem("roleId");
    setRoleId(parseInt(storedRoleId, 10));
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Expenses/FormatedExpenses"
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      message.error("Unable to fetch expenses data");
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

      await axios.post(
        "https://soschildrenvillage.azurewebsites.net/api/Expenses/CreateExpense",
        requestPayload
      );
      message.success("Expense created successfully");
      setIsModalVisible(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
      message.error("Failed to create expense");
    }
  };

  const handleSpecialExpense = async () => {
    try {
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Expenses/getExpensewithEvent"
      );
      setSpecialExpenses(response.data);
      setIsSpecialExpenseModalVisible(true);
    } catch (error) {
      console.error("Error fetching special expenses:", error);
      message.error("Failed to fetch special expenses");
    }
  };

  const renderWallets = (data) => {
    const walletNames = [];
    if (data.systemWalletId) walletNames.push("System Wallet");
    if (data.facilitiesWalletId) walletNames.push("Facilities Wallet");
    if (data.foodStuffWalletId) walletNames.push("Food Stuff Wallet");
    if (data.healthWalletId) walletNames.push("Health Wallet");
    if (data.necessitiesWalletId) walletNames.push("Necessities Wallet");
    return walletNames.length > 0 ? walletNames.join(", ") : "N/A";
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Expenses/ExportExcel",
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Expense_Report_${new Date().toISOString()}.xlsx`);
      message.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      message.error("Failed to download report");
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

  const handleConfirmExpense = async (id) => {
    try {
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Expenses/ConfirmExpense?id=${id}`
      );
      message.success("Expense confirmed successfully");
      fetchExpenses();
    } catch (error) {
      console.error("Error confirming expense:", error);
      message.error("Failed to confirm expense");
    }
  };

  const columns = [
    {
      title: "Expense ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "expenseAmount",
      key: "expenseAmount",
      align: "center",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Expense Day",
      dataIndex: "expenseday",
      key: "expenseday",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Expense Type",
      dataIndex: "expenseType",
      key: "expenseType",
      align: "center",
    },
    {
      title: "Requested By",
      dataIndex: "requestedBy",
      key: "requestedBy",
      align: "center",
    },
    {
      title: "Approved By",
      dataIndex: "approvedBy",
      key: "approvedBy",
      align: "center",
    },
    {
      title: "House ID",
      dataIndex: "houseId",
      key: "houseId",
      align: "center",
    },
    {
      title: "Wallet",
      key: "wallet",
      align: "center",
      render: (text, record) => {
        const wallets = [];
        if (record.facilitiesWalletId) wallets.push("Facilities Wallet");
        if (record.foodStuffWalletId) wallets.push("Food Stuff Wallet");
        if (record.healthWalletId) wallets.push("Health Wallet");
        if (record.necessitiesWalletId) wallets.push("Necessities Wallet");
        if (record.systemWalletId) wallets.push("System Wallet");
        return wallets.length > 0 ? wallets.join(", ") : "N/A";
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    ...(roleId === 1
      ? [
        {
          title: "Active",
          key: "active",
          align: "center",
          render: (text, record) => (
            <Button
              type="primary"
              onClick={() => handleConfirmExpense(record.id)}
              disabled={record.status === "Confirmed"}
            >
              Confirm
            </Button>
          ),
        },
      ]
      : []),
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
            placeholder="Search for Expense"
            prefix={<SearchOutlined />}
            style={{ width: 500, marginRight: 8 }}
          />
          <div
            style={{
              display: "flex",
            }}
          >
            <Button
              onClick={handleAddExpense}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: 8 }}
            >
              Add New Expense
            </Button>
            <Button
              onClick={handleSpecialExpense}
              type="default"
              style={{ marginLeft: 8 }}
            >
              Special Expense
            </Button>
            <Button
              onClick={handleDownloadReport}
              type="default"
              style={{ marginLeft: 8 }}
              icon={<DownloadOutlined />}
            >
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredExpenses}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ["10", "20", "50", "100"],
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
            rules={[
              { required: true, message: "Please enter the expense amount" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="houseId"
            label="House ID"
            rules={[{ required: true, message: "Please enter the house ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="wallet"
            label="Wallet"
            rules={[{ required: true, message: "Please select a wallet" }]}
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
        title="Special Expenses"
        visible={isSpecialExpenseModalVisible}
        onCancel={() => setIsSpecialExpenseModalVisible(false)}
        footer={[

        ]}
        width={1000}
      >
        <Table
          dataSource={specialExpenses}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          columns={[
            {
              title: "Expense Amount",
              dataIndex: "expenseAmount",
              key: "expenseAmount",
              align: "center",
              render: (amount) =>
                amount != null ? `${amount.toLocaleString()} VND` : "N/A",
            },
            {
              title: "Amount Receive",
              dataIndex: "amountReceive",
              key: "amountReceive",
              align: "center",
              render: (amount) =>
                amount != null ? `${amount.toLocaleString()} VND` : "N/A",
            },
            {
              title: "Description",
              dataIndex: "description",
              key: "description",
              align: "center",
            },
            {
              title: "Expense Day",
              dataIndex: "expenseday",
              key: "expenseday",
              align: "center",
              render: (date) => new Date(date).toLocaleDateString(),
            },
            {
              title: "Expense Type",
              dataIndex: "expenseType",
              key: "expenseType",
              align: "center",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              align: "center",
            },
            {
              title: "Requested By",
              dataIndex: "requestedBy",
              key: "requestedBy",
              align: "center",
            },
            {
              title: "Approved By",
              dataIndex: "approvedBy",
              key: "approvedBy",
              align: "center",
            },
            {
              title: "Wallet",
              key: "wallet",
              align: "center",
              render: (text, record) => renderWallets(record),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ExpenseManagement;
