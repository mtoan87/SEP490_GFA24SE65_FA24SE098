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
  const [userId, setUserId] = useState(null); // Store userId (from login)
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [donationHistory, setDonationHistory] = useState({ totalAmount: 0, details: [] });
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [donors, setDonors] = useState([]); // State to store donors data
  const [isDonorsVisible, setIsDonorsVisible] = useState(false); // Control visibility of donors modal

  // New state for Amount Limit Detail modal
  const [isAmountLimitVisible, setIsAmountLimitVisible] = useState(false);
  const [amountLimitDetails, setAmountLimitDetails] = useState({ totalHouseExpense: 0, houses: [] });

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

    // Fetch user details if logged in
    if (storedUserId) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/User/GetUserDetails/${storedUserId}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchUserDetails();
    }

    fetchEventDetails();
  }, [eventId]);

  const fetchDonors = async () => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonationByEventId?eventId=${eventId}`);
      const donorsData = response.data.map(donor => ({
        userName: donor.userName,
        dateTime: donor.dateTime,
        amount: donor.amount,
        description: donor.description,
        status: donor.status,
      }));
      setDonors(donorsData);
      setIsDonorsVisible(true); // Show donors modal
    } catch (error) {
      console.error('Error fetching donor details:', error);
    }
  };

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

  const fetchAmountLimitDetails = async () => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Event/amount-limit-detail?eventId=${eventId}`);

      // Kiểm tra dữ liệu trả về và sử dụng đúng cấu trúc
      if (response.data && response.data.village && Array.isArray(response.data.village.houses.$values)) {
        setAmountLimitDetails({
          totalHouseExpense: response.data.village.totalHouseExpense,
          houses: response.data.village.houses.$values,  // Sử dụng houses.$values thay vì houses trực tiếp
        });
        setIsAmountLimitVisible(true); // Mở modal Amount Limit
      } else {
        console.error("Houses data is missing or not in the expected format.");
        setAmountLimitDetails({ totalHouseExpense: 0, houses: [] });
        setIsAmountLimitVisible(false); // Ẩn modal nếu không có dữ liệu
        alert("No house expense data available.");
      }
    } catch (error) {
      console.error('Error fetching amount limit details:', error);
      alert('Failed to fetch amount limit details.');
    }
  };


  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const response = await axios.put(`https://soschildrenvillage.azurewebsites.net/api/EventDonate/EventDonate?id=${eventId}`, {
        amount: amount,
        userAccountId: userId || null, // Use userId if logged in, otherwise null
        description: description,
        userName: userName || null,            // Added userName
        userEmail: userEmail || null,          // Added userEmail
        phone: phone || null,                  // Added phone
        address: address || null               // Added address
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('Failed to get payment URL.');
      }
    } catch (error) {
      console.error('Error making donation:', error);
      alert('Donations not allow for close event');
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
            {/* History of Donation button in the top-right corner */}
            <Button
              type="default"
              onClick={fetchDonors}
              style={{ position: 'right' }}
            >
              History of Donation
            </Button>
            <p><strong>Event Code:</strong> {event.eventCode}</p>
            <p><strong>Start Time:</strong> {formatDate(event.startTime)}</p>
            <p><strong>End Time:</strong> {formatDate(event.endTime)}</p>
            <p><strong>Current Amount:</strong> {formatCurrency(event.currentAmount)}</p>
            <p><strong>Amount Limit:</strong>
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={fetchAmountLimitDetails}
              >
                {formatCurrency(event.amountLimit)}
              </span>
            </p>
            <p><strong>Status:</strong> {event.status}</p>
          </div>

          <Button type="primary" onClick={() => window.open(`/villagedetail/${eventId}`, '_blank')} style={{ marginTop: '20px' }}>
            Village Info
          </Button>

          <Button
            type="default"
            onClick={fetchDonationHistory}
            style={{ marginTop: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
          >
            My Donation
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

          <div className="donation-section">
            {userId ? (
              // If logged in, show only amount and description fields
              <>
                <label htmlFor="donationAmount" className="donation-label">Enter Amount:</label>
                <input
                  type="number"
                  id="donationAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="donation-input"
                />
                <label htmlFor="donationDescription" className="donation-label">Description:</label>
                <input
                  type="text"
                  id="donationDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="donation-input"
                />
              </>
            ) : (
              // If not logged in, show full user information as editable
              <>
                <input type="hidden" value={null} id="userAccountId" />
                <label htmlFor="userName" className="donation-label">User Name:</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="donation-input"
                />
                <label htmlFor="userEmail" className="donation-label">Email:</label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="donation-input"
                />
                <label htmlFor="phone" className="donation-label">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="donation-input"
                />
                <label htmlFor="address" className="donation-label">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="donation-input"
                />
                <label htmlFor="donationAmount" className="donation-label">Enter Amount:</label>
                <input
                  type="number"
                  id="donationAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="donation-input"
                />
                <label htmlFor="donationDescription" className="donation-label">Description:</label>
                <input
                  type="text"
                  id="donationDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="donation-input"
                />
              </>
            )}

            <button className="donate-button" onClick={handleDonate}>Donate</button>
          </div>
        </div>
      </div>

      {/* Donation History Modal */}
      <Modal
        title="Donation History"
        visible={isHistoryVisible}
        onCancel={() => setIsHistoryVisible(false)}
        footer={[<Button key="close" onClick={() => setIsHistoryVisible(false)}>Close</Button>]}
      >
        <p><strong>Total Amount Donated:</strong> {formatCurrency(donationHistory.totalAmount)}</p>
        {donationHistory.details.length > 0 ? (
          <table className="donation-history-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.details.map((historyItem, index) => (
                <tr key={index}>
                  <td>{formatCurrency(historyItem.amount)}</td>
                  <td>{formatDate(historyItem.dateTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No donations yet.</p>
        )}
      </Modal>

      {/* Donors Modal */}
      <Modal
        title="Donors History"
        visible={isDonorsVisible}
        onCancel={() => setIsDonorsVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDonorsVisible(false)}>Close</Button>]}
      >
        {donors.length > 0 ? (
          <table className="donors-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr key={index}>
                  <td>{donor.userName}</td>
                  <td>{formatDate(donor.dateTime)}</td>
                  <td>{formatCurrency(donor.amount)}</td>
                  <td>{donor.description}</td>
                  <td>{donor.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No donations yet.</p>
        )}
      </Modal>

      <Modal
        title="Amount Limit Details"
        visible={isAmountLimitVisible}
        onCancel={() => setIsAmountLimitVisible(false)}
        footer={[<Button key="close" onClick={() => setIsAmountLimitVisible(false)}>Close</Button>]}>
        <p><strong>Total House Expense:</strong> {formatCurrency(amountLimitDetails.totalHouseExpense)}</p>
        {amountLimitDetails.houses && amountLimitDetails.houses.length > 0 ? (
          <table className="house-expense-table">
            <thead>
              <tr>
                <th>House Name</th>
                <th>House Expense</th>
              </tr>
            </thead>
            <tbody>
              {amountLimitDetails.houses.map((house, index) => (
                <tr key={index}>
                  <td>{house.houseName}</td>
                  <td>{formatCurrency(house.houseExpense)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No house expenses available.</p>
        )}
      </Modal>
    </div>
  );
};

export default EventDetail;
