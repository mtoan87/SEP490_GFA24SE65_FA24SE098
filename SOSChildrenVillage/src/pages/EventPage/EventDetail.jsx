import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Descriptions, Table } from 'antd';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import './EventDetail.css';

const EventDetail = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(null);
  const [villageInfo, setVillageInfo] = useState(null); // State for village info
  const [isVillageModalVisible, setVillageModalVisible] = useState(false); // State for Village Modal
  const [isHousesModalVisible, setHousesModalVisible] = useState(false); // State for Houses Modal
  const [houses, setHouses] = useState([]); // State for houses data
  const [houseDetails, setHouseDetails] = useState(null); // State for house details
  const [isHouseDetailModalVisible, setHouseDetailModalVisible] = useState(false); // State for House Detail Modal

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Event/GetEventById/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const fetchVillageInfo = async () => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Village/GetVillageByEventId?eventId=${eventId}`);
      const villageData = response.data[0];
      setVillageInfo({
        villageName: villageData.villageName,
        totalHouses: villageData.totalHouses,
        totalChildren: villageData.totalChildren,
        location: villageData.location,
        imageUrls: villageData.imageUrls || [],
      });
    } catch (error) {
      console.error('Error fetching village info:', error);
    }
  };

  const fetchHousesInfo = async () => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByVillageId/V001`);
      setHouses(response.data); // Save house information to state
    } catch (error) {
      console.error('Error fetching houses info:', error);
    }
  };

  const fetchHouseDetails = async (houseId) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByIdWithImg/${houseId}`);
      console.log(response.data); // Kiểm tra dữ liệu trả về
      setHouseDetails(response.data); // Save house details to state
      setHouseDetailModalVisible(true); // Open house detail modal
    } catch (error) {
      console.error('Error fetching house details:', error);
    }
  };  

  const handleOpenVillageModal = async () => {
    await fetchVillageInfo();
    setVillageModalVisible(true);
  };

  const handleCloseVillageModal = () => {
    setVillageModalVisible(false);
  };

  const handleOpenHousesModal = async () => {
    await fetchHousesInfo(); // Fetch house information before opening the modal
    setHousesModalVisible(true);
  };

  const handleCloseHousesModal = () => {
    setHousesModalVisible(false);
  };

  const handleCloseHouseDetailModal = () => {
    setHouseDetailModalVisible(false);
  };

  if (!event) {
    return <div className="loading">Loading...</div>;
  }

  const extractImagesFromDescription = (description) => {
    if (!description) return [];
    const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/g;
    return description.match(imageUrlRegex) || [];
  };

  const imageUrlsInDescription = extractImagesFromDescription(event.description);

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!userId) {
      alert('Please log in to donate.');
      return;
    }

    try {
      const response = await axios.put(`https://soschildrenvillage.azurewebsites.net/api/EventDonate/EventDonate?id=${eventId}`, {
        amount: amount,
        userAccountId: userId
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('Failed to get payment URL.');
      }
    } catch (error) {
      console.error('Error making donation:', error);
      alert('Failed to make a donation. Please try again.');
    }
  };

  const donationProgress = event.currentAmount / event.amountLimit * 100;

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(',', ' •');
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <div className="event-detail-container">
      <div className="event-header">
        <h1 className="event-title">{event.name}</h1>
      </div>

      <div className="event-body">
        <div className="left-column">
          <p className="event-description">{event.description}</p>
          {imageUrlsInDescription.length > 0 && (
            <div className="event-images">
              {imageUrlsInDescription.map((url, index) => (
                <ModalImage key={index} small={url} large={url} alt={`Event Image ${index + 1}`} className="event-image" />
              ))}
            </div>
          )}
          {event.imageUrls && event.imageUrls.length > 0 && (
            <div className="event-images">
              {event.imageUrls.map((url, index) => (
                <ModalImage key={index} small={url} large={url} alt={`Event Image ${index + 1}`} className="event-image" />
              ))}
            </div>
          )}
        </div>

        <div className="right-column">
          <div className="event-info">
            <p><strong>Event Code:</strong> {event.eventCode}</p>
            <p><strong>Start Time:</strong> {formatDate(event.startTime)}</p>
            <p><strong>End Time:</strong> {formatDate(event.endTime)}</p>
            <p><strong>Current Amount:</strong> {formatCurrency(event.currentAmount)}</p>
            <p><strong>Amount Limit:</strong> {formatCurrency(event.amountLimit)}</p>
            <p><strong>Status:</strong> {event.status}</p>
          </div>

          <Button type="primary" onClick={handleOpenVillageModal} style={{ marginTop: '20px' }}>
            Village Info
          </Button>

          <div className="donation-progress-container">
            <label>Donation Progress</label>
            <div className="donation-progress-bar">
              <div
                className="donation-progress-fill"
                style={{ width: `${donationProgress}%`, backgroundColor: donationProgress === 100 ? '#28a745' : '#1677ff' }}
              />
            </div>
            <p>{Math.round(donationProgress)}% of goal reached</p>
          </div>

          {event.status !== 'Inactive' && (
            <div className="donation-section">
              <label htmlFor="donationAmount" className="donation-label">Enter Amount:</label>
              <input
                type="number"
                id="donationAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="donation-input"
              />
              <button className="donate-button" onClick={handleDonate}>Donate</button>
            </div>
          )}
        </div>
      </div>

      {/* Village Modal */}
      <Modal
        title="Village Info"
        visible={isVillageModalVisible}
        onCancel={handleCloseVillageModal}
        footer={null}
      >
        {villageInfo ? (
          <div>
            <Descriptions column={1}>
              <Descriptions.Item label="Village Name">{villageInfo.villageName || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Location">{villageInfo.location || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Total Houses">{villageInfo.totalHouses || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Total Children">{villageInfo.totalChildren || "N/A"}</Descriptions.Item>

              {villageInfo.imageUrls && villageInfo.imageUrls.length > 0 ? (
                <Descriptions.Item label="">
                  <div className="village-images">
                    {villageInfo.imageUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Village Image ${index + 1}`} className="village-image" />
                    ))}
                  </div>
                </Descriptions.Item>
              ) : null}
            </Descriptions>

            {/* "View Houses" button in Village Info modal */}
            <Button type="link" onClick={handleOpenHousesModal} style={{ paddingLeft: 0 }}>
              View Houses ({villageInfo.totalHouses})
            </Button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      {/* Houses Modal */}
      <Modal
        title="House Information"
        visible={isHousesModalVisible}
        onCancel={handleCloseHousesModal}
        footer={null}
      >
        <Table
          dataSource={houses}
          columns={[
            { title: 'House Id', dataIndex: 'id' },
            { title: 'House Name', dataIndex: 'houseName' },
            { title: 'Location', dataIndex: 'location' },
            {
              title: 'Action', 
              key: 'action', 
              render: (text, record) => (
                <Button type="link" onClick={() => fetchHouseDetails(record.id)}>
                  View
                </Button>
              ),
            },
          ]}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* House Detail Modal */}
      <Modal
        title="House Detail"
        visible={isHouseDetailModalVisible}
        onCancel={handleCloseHouseDetailModal}
        footer={null}
      >
        {houseDetails ? (
          <div>
            <Descriptions column={1}>
              <Descriptions.Item label="House Name">{houseDetails.houseName}</Descriptions.Item>
              <Descriptions.Item label="House Number">{houseDetails.houseNumber}</Descriptions.Item>
              <Descriptions.Item label="Location">{houseDetails.location}</Descriptions.Item>
              <Descriptions.Item label="Description">{houseDetails.description}</Descriptions.Item>
              <Descriptions.Item label="House Owner">{houseDetails.houseOwner}</Descriptions.Item>
              <Descriptions.Item label="House Member">{houseDetails.houseMember}</Descriptions.Item>
              <Descriptions.Item label="Current Members">{houseDetails.currentMembers}</Descriptions.Item>
            </Descriptions>
            {houseDetails.imageUrls && houseDetails.imageUrls.length > 0 && (
              <div className="house-images">
                {houseDetails.imageUrls.map((url, index) => (
                  <ModalImage key={index} small={url} large={url} alt={`House Image ${index + 1}`} className="house-image" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default EventDetail;
