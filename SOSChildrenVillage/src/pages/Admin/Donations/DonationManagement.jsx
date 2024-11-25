import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDonation, setEditingDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7073/api/Donation/FormatDonation");
      setDonations(response.data);
      console.log(response.data); // Correcting the reference to response.data
    } catch (error) {
      console.log(error);
      message.error("Cannot get donation data");
    } finally {
      setLoading(false);
    }
  };
  

  const showModal = (donation = null) => {
    setEditingDonation(donation);
    if (donation) {
      form.setFieldsValue({
        ...donation,
        dateTime: donation.dateTime ? moment(donation.dateTime) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          // Prepare the data to be sent as JSON
          const requestData = {
            userAccountId: values.userAccountId,
            description: values.description,
            donationType: values.donationType,
            amount: values.amount,
            systemWalletId: null,
            facilitiesWalletId: null,
            foodStuffWalletId: null,
            healthWalletId: null,
            necessitiesWalletId: null,
            eventId: values.eventId || null, // Set to null if empty
            childId: values.childId || null, // Set to null if empty
          };
  
          // Set the selected wallet ID to 1 based on the selected wallet
          if (values.wallet) {
            const selectedWallet = `${values.wallet}Id`; // Convert wallet to the corresponding ID
            requestData[selectedWallet] = 1;
          }
  
          const url = editingDonation
            ? `https://localhost:7073/api/Donation/UpdateDonation?id=${editingDonation.id}`
            : "https://localhost:7073/api/Donation/CreateDonate";
  
          // Send the request as JSON
          await axios.post(url, requestData, {
            headers: {
              "Content-Type": "application/json", // Specify JSON content type
            },
          });
  
          message.success(editingDonation ? "Donation updated successfully" : "Donation added successfully");
  
          setIsModalVisible(false);
          fetchDonations();
        } catch (error) {
          console.error("Error details:", error);
          message.error("Error occurred while processing donation");
        }
      })
      .catch(() => {
        message.error("Please check all required fields");
      });
  };
  
  
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this donation?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await axios.delete(`https://localhost:7073/api/Donation/DeleteDonation?id=${id}`);
          message.success("Donation deleted successfully");
          fetchDonations();
        } catch (error) {
          message.error("Error occurred while deleting donation");
        }
      },
    });
  };

  const columns = [
    {
      title: "Donation Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User Account ID",
      dataIndex: "userAccountId",
      key: "userAccountId",
    },
    {
      title: "Donation Type",
      dataIndex: "donationType",
      key: "donationType",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (date) => moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Wallets",
      key: "wallets",
      render: (_, record) => (
        <div>
          {record.systemWalletId && <div>System Wallet</div>}
          {record.facilitiesWalletId && <div>Facilities Wallet</div>}
          {record.foodStuffWalletId && <div>Food Wallet</div>}
          {record.healthWalletId && <div>Health Wallet</div>}
          {record.necessitiesWalletId && <div>Necessities Wallet</div>}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
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
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "24px" }}>
        <Input
          placeholder="Search for donations"
          prefix={<SearchOutlined />}
          style={{ width: 500, marginRight: 8 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add New Donation
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={donations}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingDonation ? "Update Donation" : "Add New Donation"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userAccountId" label="User Account ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="donationType" label="Donation Type" rules={[{ required: true }]}>
            <Select>
              <Option value="Banking">Banking</Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>

          <Form.Item name="eventId" label="Event ID">
            <Input />
          </Form.Item>

          <Form.Item name="childId" label="Child ID">
            <Input />
          </Form.Item>

          <Form.Item name="wallet" label="Select Wallet" rules={[{ required: true }]}>
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

export default DonationManagement;
