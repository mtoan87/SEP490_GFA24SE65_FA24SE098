import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'antd';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import './EventDetail.css';

const EventDetail = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(null);
  const [donationHistory, setDonationHistory] = useState({ totalAmount: 0, details: [] });  // Fixing state structure
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

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

  const fetchDonationHistory = async () => {
    if (!userId) {
      alert('Please log in to view donation history.');
      return;
    }

    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonationsByUserAndEvent/${userId}/${eventId}`);
      const { totalAmount, donationDetails } = response.data;

      const formattedHistory = donationDetails?.$values?.map((donation) => ({
        amount: donation.amount,
        dateTime: donation.dateTime,
      })) || [];

      setDonationHistory({
        totalAmount: totalAmount || 0,
        details: formattedHistory,
      });

      setIsHistoryVisible(true); // Open modal
    } catch (error) {
      console.error('No donations found.', error);
      alert('No donations found.');
    }
  };

  const handleOpenVillageDetail = () => {
    window.open(`/villagedetail/${eventId}`, '_blank');
  };

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
        userAccountId: userId,
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

  const donationProgress = (event?.currentAmount && event?.amountLimit) 
    ? (event.currentAmount / event.amountLimit) * 100 
    : 0;

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(',', ' •');
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return 'N/A'; // Prevent error in case of null/undefined value
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (!event) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="event-header">
        <h1 className="event-title">{event.name}</h1>
      </div>

      <div className="event-body">
        <div className="left-column">
          <p className="event-description">{event.description}</p>
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

          <Button type="primary" onClick={handleOpenVillageDetail} style={{ marginTop: '20px' }}>
            Village Info
          </Button>

          <Button
            type="default"
            onClick={fetchDonationHistory}
            style={{ marginTop: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
          >
            History of Donation
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

      {/* Donation History Modal */}
      <Modal
        title="Donation History"
        visible={isHistoryVisible}
        onCancel={() => setIsHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsHistoryVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p><strong>Total Amount Donated:</strong> {formatCurrency(donationHistory.totalAmount)}</p>
        {donationHistory.details.length > 0 ? (
          <table className="donation-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.details.map((donation, index) => (
                <tr key={index}>
                  <td>{formatDate(donation.dateTime)}</td>
                  <td>{formatCurrency(donation.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No donation history available.</p>
        )}
      </Modal>
    </div>
  );
};

export default EventDetail;
