import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChildDetail.css';

const ChildDetail = () => {
  const { id: childId } = useParams();
  const [child, setChild] = useState(null);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchChildDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7073/api/Children/GetChildWithImg/${childId}`);
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
      const response = await axios.put(`https://localhost:7073/api/EventDonate/ChildDonate?id=${childId}`, {
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

  // Calculate donation progress
  const donationProgress = child.currentAmount / child.amountLimit * 100;

  // Function to format date into "Thu, Nov 28 • 5:30 PM"
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

  // Function to format currency in VND
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
        </div>
      </div>
    </div>
  );
};

export default ChildDetail;
