import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import './EventDetail.css';

const EventDetail = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7073/api/Event/GetEventById/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div className="loading">Loading...</div>;
  }

  const extractImagesFromDescription = (description) => {
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
      const response = await axios.put(`https://localhost:7073/api/EventDonate/EventDonate?id=${eventId}`, {
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

  // Calculate the donation progress
  const donationProgress = event.currentAmount / event.amountLimit * 100;

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
    <div className="event-detail-container">
      <div className="event-header">
        <h1 className="event-title">{event.name}</h1>
      </div>

      <div className="event-body">
        {/* Left layout: Description and images */}
        <div className="left-column">
          <p className="event-description">{event.description}</p>
          {/* Display images extracted from description */}
          {imageUrlsInDescription.length > 0 && (
            <div className="event-images">
              {imageUrlsInDescription.map((url, index) => (
                <ModalImage
                  key={index}
                  small={url} // Ảnh nhỏ hiển thị
                  large={url} // Ảnh lớn khi phóng to
                  alt={`Event Image ${index + 1}`}
                  className="event-image"
                />
              ))}
            </div>
          )}

          {/* Additional images from the event API */}
          {event.imageUrls && event.imageUrls.length > 0 && (
            <div className="event-images">
              {event.imageUrls.map((url, index) => (
                <ModalImage
                  key={index}
                  small={url}
                  large={url}
                  alt={`Event Image ${index + 1}`}
                  className="event-image"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right layout: Event details and Donate button */}
        <div className="right-column">
          <div className="event-info">
            <p><strong>Start Time:</strong> {formatDate(event.startTime)}</p>
            <p><strong>End Time:</strong> {formatDate(event.endTime)}</p>
            <p><strong>Amount Limit:</strong> {formatCurrency(event.amountLimit)}</p>
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

export default EventDetail;
