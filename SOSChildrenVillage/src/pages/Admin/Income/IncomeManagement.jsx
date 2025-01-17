import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { saveAs } from "file-saver";

const IncomeManagement = () => {
  const [incomes, setIncomes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [donationDetails, setDonationDetails] = useState(null); // To store donation details
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Incomes/FormatedIncome"
      );
      setIncomes(response.data);
    } catch (error) {
      message.error("Failed to fetch income data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationDetails = async (donationId) => {
    try {
      const response = await axios.get(
        `https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonationDetails/${donationId}`
      );
      setDonationDetails(response.data);
    } catch (error) {
      message.error("Failed to fetch donation details", error);
    }
  };

  const handleAddIncome = () => {
    form.resetFields();
    setEditingIncome(null);
    setIsModalVisible(true);
  };

  const handleEditIncome = (income) => {
    form.setFieldsValue({ amount: income.amount });
    setEditingIncome(income);
    setIsModalVisible(true);
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Incomes/SoftDelete?id=${incomeId}`
      );
      message.success("Income deleted successfully");
      fetchIncomes();
    } catch (error) {
      message.error("Failed to delete income", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingIncome) {
        const logDetails = {
          oldAmount: editingIncome.amount,
          newAmount: values.amount,
          incomeId: editingIncome.id,
        };

        console.log("Edit Log:", logDetails);

        await axios.put(
          `https://soschildrenvillage.azurewebsites.net/api/Incomes/UpdateIncome?id=${editingIncome.id}`,
          { amount: values.amount }
        );
        message.success("Income amount updated successfully");
      } else {
        const requestPayload = {
          donationId: values.donationId,
          facilitiesWalletId: values.facilitiesWalletId,
          foodStuffWalletId: values.foodStuffWalletId,
          healthWalletId: values.healthWalletId,
          necessitiesWalletId: values.necessitiesWalletId,
          systemWalletId: values.systemWalletId,
        };

        await axios.post(
          "https://soschildrenvillage.azurewebsites.net/api/Incomes/CreateIncome",
          requestPayload
        );
        message.success("Income added successfully");
      }

      setIsModalVisible(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error submitting income:", error.response || error);
      message.error("Failed to submit");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Incomes/ExportExcel",
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Income_Report_${new Date().toISOString()}.xlsx`);
      message.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      message.error("Failed to download report");
    }
  };

  const columns = [
    {
      title: "View Donation",
      key: "viewDonation",
      align: "center",
      render: (_, income) => (
        <Button
          onClick={() => fetchDonationDetails(income.donationId)}
          type="link"
        >
          View Donation
        </Button>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (text) => (text != null ? `${text.toLocaleString()} VND` : "N/A"),
    },
    {
      title: "Receive Day",
      dataIndex: "receiveDay",
      key: "receiveDay",
      align: "center",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Wallet",
      key: "wallet",
      align: "center",
      render: (text, income) => {
        const wallets = [];
        if (income.facilitiesWalletId) wallets.push("Facilities Wallet");
        if (income.foodStuffWalletId) wallets.push("Food Stuff Wallet");
        if (income.healthWalletId) wallets.push("Health Wallet");
        if (income.necessitiesWalletId) wallets.push("Necessities Wallet");
        if (income.systemWalletId) wallets.push("System Wallet");

        return wallets.length > 0 ? wallets.join(", ") : "N/A";
      },
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_, income) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditIncome(income)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteIncome(income.id)}
          />
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
              onClick={handleAddIncome}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: 8 }}
            >
              Add New Income
            </Button>
            <Button
              onClick={handleDownloadReport}
              type="default"
              icon={<DownloadOutlined />}
            >
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={incomes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ marginTop: "20px" }}
      />

      <Modal
        title={editingIncome ? "Edit Income" : "Add Income"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText={editingIncome ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          {editingIncome ? (
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: "Please input the amount!" }]}
            >
              <Input type="number" />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="donationId"
                label="Donation ID"
                rules={[
                  { required: true, message: "Please input donation ID!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="facilitiesWalletId"
                label="Facilities Wallet ID"
                rules={[
                  {
                    required: true,
                    message: "Please input the facilities wallet ID!",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="foodStuffWalletId" label="Food Stuff Wallet ID">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="healthWalletId" label="Health Wallet ID">
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="necessitiesWalletId"
                label="Necessities Wallet ID"
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="systemWalletId" label="System Wallet ID">
                <Input type="number" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* Modal for Donation Details */}
      {donationDetails && (
        <Modal
          title="Donation Details"
          visible={!!donationDetails}
          onCancel={() => setDonationDetails(null)}
          footer={null}
        >
          <p><strong>User Name:</strong> {donationDetails.userName}</p>
          <p><strong>Email:</strong> {donationDetails.userEmail}</p>
          <p><strong>Phone:</strong> {donationDetails.phone || "N/A"}</p>
          <p><strong>Address:</strong> {donationDetails.address || "N/A"}</p>
          <p><strong>Donation Type:</strong> {donationDetails.donationType}</p>
          <p><strong>Target Name:</strong> {donationDetails.targetName}</p>
          <p><strong>Event Code:</strong> {donationDetails.eventCode}</p>
          <p><strong>Description:</strong> {donationDetails.description}</p>
        </Modal>
      )}
    </div>
  );
};

export default IncomeManagement;
