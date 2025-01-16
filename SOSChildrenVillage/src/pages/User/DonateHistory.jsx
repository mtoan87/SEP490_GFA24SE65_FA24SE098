import { useState, useEffect } from 'react';
import { Table, Spin, message, Result, Typography, Modal , Button } from 'antd';
import axios from 'axios';
import moment from "moment";

const { Title } = Typography;

const DonateHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false); // Event Modal state
  const [isChildModalVisible, setIsChildModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
    
      if (!userId || !token) {
        message.error('You must be logged in to view donation history.');
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.get(
          `https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonationByUserIdFormat?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log('API Response:', response.data); // Log the full response
        const donationData = response.data || []; // No need to use `$values`
        if (donationData.length > 0) {
          setDonations(donationData);
        } else {
          message.info('No donations found.');
        }
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to fetch donation history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };    

    fetchDonations();
  }, []);

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

  const columns = [
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
      title: 'Date Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      align: "center",
      render: (dateTime) =>
        dateTime
          ? new Date(dateTime).toLocaleString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: "center",
      render: (amount) =>
        amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: "center",
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: "center",
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Donation History</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Result
          status="error"
          title="Error Loading Donation History"
          subTitle={error}
        />
      ) : donations.length === 0 ? (
        <Result
          status="info"
          title="No Donations Found"
          subTitle="It seems like you haven't made any donations yet."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={donations}
          rowKey={(record) => record.id}
          bordered
          pagination={{ pageSize: 5 }}
          style={{
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
          }}
        />
      )}
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

export default DonateHistory;
