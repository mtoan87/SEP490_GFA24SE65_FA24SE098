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
  const [isUserModalVisible, setIsUserModalVisible] = useState(false); // User Modal state
  const [isEventModalVisible, setIsEventModalVisible] = useState(false); // Event Modal state
  const [isChildModalVisible, setIsChildModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user info
  const [selectedEvent, setSelectedEvent] = useState(null); // Selected event info
  const [form] = Form.useForm();
  const [editingDonation, setEditingDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchDonations(showDeleted);
  }, [showDeleted]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const url = showDeleted
        ? "https://soschildrenvillage.azurewebsites.net/api/Donation/FormatDonationIsDeleted" // Show deleted donations
        : "https://soschildrenvillage.azurewebsites.net/api/Donation/FormatDonation"; // Show normal donations

      console.log("Fetching donations from:", url); // Log the URL being requested

      const response = await axios.get(url);
      console.log("Response data:", response.data); // Log the response data

      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      message.error("Cannot get donation data");
    } finally {
      setLoading(false);
    }
  };

  const showUserModal = (donation) => {
    setSelectedUser({
      userName: donation.userName,
      userEmail: donation.userEmail,
      phone: donation.phone,
      address: donation.address,
    });
    setIsUserModalVisible(true);
  };

  const showEventModal = async (eventId) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Event/GetEventById/${eventId}`);
      setSelectedEvent(response.data);
      setIsEventModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch event details");
    }
  };
  const showChildModal = async (childId) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Children/GetChildWithImg?id=${childId}`);
      setSelectedChild(response.data);
      setIsChildModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch child data");
    }
  };


  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
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
            eventId: values.eventId || null,
            childId: values.childId || null,
          };

          if (values.wallet) {
            const selectedWallet = `${values.wallet}Id`;
            requestData[selectedWallet] = 1;
          }

          const url = editingDonation
            ? `https://soschildrenvillage.azurewebsites.net/api/Donation/UpdateDonation?id=${editingDonation.id}`
            : "https://soschildrenvillage.azurewebsites.net/api/Donation/CreateDonate";

          await axios.post(url, requestData, {
            headers: {
              "Content-Type": "application/json",
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
          await axios.put(`https://soschildrenvillage.azurewebsites.net/api/Donation/Delete/${id}`);
          message.success("Donation deleted successfully");
          fetchDonations();
        } catch (error) {
          message.error("Error occurred while deleting donation");
        }
      },
    });
  };
  const handleRestore = async (id) => {
    try {
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Donation/Restore/${id}`
      );
      message.success("Donation Restored Successfully");
      fetchDonations(showDeleted); // Refresh donations after restoring
    } catch (error) {
      console.error("Error occurred when restoring donation:", error);
      message.error("Unable to restore donation");
    }
  };
  
  // Thêm hàm getWalletName để xử lý logic hiển thị tên Wallet
  const getWalletName = (record) => {
    const wallets = {
      facilitiesWalletId: "Facilities",
      systemWalletId: "System",
      foodStuffWalletId: "Food Stuff",
      healthWalletId: "Health",
      necessitiesWalletId: "Necessities",
    };

    for (const [key, value] of Object.entries(wallets)) {
      if (record[key] !== null) {
        return value;
      }
    }
    return "No Wallet";
  };

  const columns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => (
        <Button onClick={() => showUserModal(record)} type="link">
          View User
        </Button>
      ),
      align: "center",
    },
    {
      title: "Donation Type",
      dataIndex: "donationType",
      key: "donationType",
      render: (donationType, record) => {
        if (donationType === "Child") {
          return (
            <Button
              type="link"
              style={{ color: "orange" }}
              onClick={() => showChildModal(record.childId)}
            >
              {donationType}
            </Button>
          );
        } else if (donationType === "Event") {
          return (
            <Button
              type="link"
              style={{ color: "blue" }}
              onClick={() => showEventModal(record.eventId)}
            >
              {donationType}
            </Button>
          );
        }
        return <span>{donationType}</span>;
      },
      align: "center",
    },
    {
      title: "Wallet",
      key: "wallet",
      render: (_, record) => <span>{getWalletName(record)}</span>,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (date) => (moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : ""),
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* Show Edit and Delete buttons if the donation is not deleted */}
          {!showDeleted || !record.isDeleted ? (
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
          ) : null}

          {/* Only show Restore button if the donation is deleted and showDeleted is true */}
          {showDeleted && (
            <Button
              type="primary"
              onClick={() => handleRestore(record.id)}
            >
              Restore
            </Button>
          )}
        </Space>
      ),
    }

  ];

  // Phần còn lại của mã không thay đổi


  return (
    <div style={{ width: "100%" }}>
      {/* Add a button to toggle showing deleted donations */}
      <Button
        onClick={() => {
          setShowDeleted((prev) => {
            const newShowDeleted = !prev;
            fetchDonations(newShowDeleted); // Pass the new state to fetch donations
            return newShowDeleted;
          });
        }}
        type="default"
        style={{maxWidth: '300px'}}
      >
        {showDeleted ? "Show Active Donations" : "Show Deleted Donations"}
      </Button>


      <Table
        columns={columns}
        dataSource={donations}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />

      {/* User Details Modal */}
      <Modal
        title="User Information"
        visible={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsUserModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <div>
            <p><strong>Username:</strong> {selectedUser.userName}</p>
            <p><strong>Email:</strong> {selectedUser.userEmail}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
          </div>
        )}
      </Modal>

      {/* Event Details Modal */}
      <Modal
        title="Event Information"
        visible={isEventModalVisible}
        onCancel={() => setIsEventModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsEventModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedEvent && (
          <div>
            <p><strong>Name:</strong> {selectedEvent.name}</p>
            <p><strong>Description:</strong> {selectedEvent.description || "No description available"}</p>
            <p><strong>Start Time:</strong> {moment(selectedEvent.startTime).format("DD/MM/YYYY HH:mm")}</p>
            <p><strong>End Time:</strong> {moment(selectedEvent.endTime).format("DD/MM/YYYY HH:mm")}</p>
            <p><strong>Current Amount:</strong> {selectedEvent.currentAmount}</p>
            <p><strong>Amount Limit:</strong> {selectedEvent.amountLimit}</p>
            <p><strong>Status:</strong> {selectedEvent.status}</p>
            <p><strong>Village ID:</strong> {selectedEvent.villageId}</p>

            {selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0 && (
              <div>
                <p><strong>Images:</strong></p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {selectedEvent.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Event Image ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        width: "150px",
                        height: "auto",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Child Information"
        visible={isChildModalVisible}
        onCancel={() => setIsChildModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsChildModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedChild && (
          <div>
            <p><strong>Name:</strong> {selectedChild.childName}</p>
            <p><strong>Health Status:</strong> {selectedChild.healthStatus}</p>
            <p><strong>Current Amount:</strong> {selectedChild.currentAmount}</p>
            <p><strong>Amount Limit:</strong> {selectedChild.amountLimit}</p>
            <p><strong>Gender:</strong> {selectedChild.gender}</p>
            <p><strong>Date of Birth:</strong> {moment(selectedChild.dob).format("DD/MM/YYYY")}</p>
            <p><strong>Status:</strong> {selectedChild.status}</p>

            {selectedChild.imageUrls && selectedChild.imageUrls.length > 0 ? (
              <div>
                <p><strong>Images:</strong></p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {selectedChild.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Child Image ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        width: "150px",
                        height: "auto",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p>No images available</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DonationManagement;
