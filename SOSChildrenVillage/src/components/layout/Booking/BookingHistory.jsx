import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Result } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      navigate('/login');
      return;
    }

    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7073/api/Booking/GetBookingsWithSlotsByUserAccountId?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          const bookingsData = response.data.data;
          if (bookingsData.length > 0) {
            setBookings(bookingsData);
          } else {
            setBookings([]); // Clear bookings if no data
          }
        } else {
          setError('Invalid data structure');
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setError('Failed to fetch booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [navigate]);

  const columns = [
    {
      title: 'House Name',
      dataIndex: 'houseName',
      key: 'houseName',
    },
    {
      title: 'Visit Day',
      dataIndex: 'visitday',
      key: 'visitday',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Booking Slot',
      dataIndex: 'bookingSlotId',
      key: 'bookingSlotId',
    },
    {
      title: 'Slot Start Time',
      dataIndex: 'slotStartTime',
      key: 'slotStartTime',
    },
    {
      title: 'Slot End Time',
      dataIndex: 'slotEndTime',
      key: 'slotEndTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Booking History</h2>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Result status="error" title="Error Loading Booking History" subTitle={error} />
      ) : bookings.length === 0 ? (
        <Result
          status="info"
          title="No Bookings Found"
          subTitle="You haven't made any bookings yet."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
          style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
        />
      )}
    </div>
  );
};

export default BookingHistory;
