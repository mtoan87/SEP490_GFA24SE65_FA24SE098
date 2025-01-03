import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'antd';
import axios from 'axios';
import './ChildDetail.css';

const ChildDetail = () => {
  const { id: childId } = useParams();
  const [child, setChild] = useState(null);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(null);
  const [donationHistory, setDonationHistory] = useState({ totalAmount: 0, details: [] });
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchChildDetails = async () => {
      try {
        const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Children/GetChildWithImg/${childId}`);
        setChild(response.data);
      } catch (error) {
        console.error('Error fetching child details:', error);
      }
    };

    fetchChildDetails();
  }, [childId]);

  if (!child) {
    return <div className="loading">Loading...</div>;
  }

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
      const response = await axios.put(`https://soschildrenvillage.azurewebsites.net/api/EventDonate/ChildDonate?id=${childId}`, {
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

  const fetchDonationHistory = async () => {
    if (!userId) {
      alert('Please log in to view donation history.');
      return;
    }

    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonationsByUserAndChildAsync/${userId}/${childId}`);
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
      console.error('Error fetching donation history:', error);
      alert('Failed to fetch donation history. Please try again.');
    }
  };

  const donationProgress = child.currentAmount / child.amountLimit * 100;

  const formatDate = (dateString) => {
    const options = {
      weekday: 'short', // "Thu"
      month: 'short', // "Nov"
      day: 'numeric', // "28"
      hour: 'numeric', // "5"
      minute: 'numeric', // "30"
      hour12: true, // "AM/PM"
    };

    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(',', ' •'); // Replace comma with bullet
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <div className="child-detail-container">
      <div className="child-header">
        <h1 className="child-title">{child.childName}</h1>
      </div>

      <div className="child-body">
        {/* Left layout: Description and images */}
        <div className="left-column">
          <p className="child-description">Health Status: {child.healthStatus}</p>

          {/* Display images of the child */}
          {child.imageUrls && child.imageUrls.length > 0 && (
            <div className="child-images">
              {child.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Child Image ${index + 1}`} className="child-image" />
              ))}
            </div>
          )}
        </div>

        {/* Right layout: Child details and Donate button */}
        <div className="right-column">
          <div className="child-info">
            <p><strong>Gender:</strong> {child.gender}</p>
            <p><strong>Date of Birth:</strong> {formatDate(child.dob)}</p>
            <p><strong>Amount Limit:</strong> {formatCurrency(child.amountLimit)}</p>
          </div>

          {/* Donation progress bar */}
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

          {/* Donation input and button */}
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

          {/* History of Donation Button */}
          <Button
            type="default"
            onClick={fetchDonationHistory}
            style={{ marginTop: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
          >
            History of Donation
          </Button>
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

export default ChildDetail;
