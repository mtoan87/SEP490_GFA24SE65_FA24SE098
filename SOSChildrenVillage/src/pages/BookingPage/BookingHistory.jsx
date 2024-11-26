import { useEffect, useState } from 'react';
import { Table, Spin, message, Result, Button, Space, Popconfirm } from 'antd';
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
          `https://soschildrenvillage.azurewebsites.net/api/Booking/GetBookingsWithSlotsByUserAccountId?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          const bookingsData = response.data.data;
          setBookings(bookingsData.length > 0 ? bookingsData : []);
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
  
    try {
      console.log(`Attempting to delete booking with ID: ${id}`); // Log trước khi gửi request
  
      const response = await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Booking/SoftDelete?Id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Delete response:', response); // Log kết quả trả về từ API
  
      message.success('Booking deleted successfully.');
      setBookings((prev) => prev.filter((booking) => booking.id !== id)); // Cập nhật state
    } catch (error) {
      console.error('Error deleting booking:', error);
      message.error('Failed to delete booking. Please try again.');
    }
  };
  

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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to cancel this booking?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { fontSize: '12px', padding: '4px 8px', width: '120px' }, // Style cho nút Yes
            }}
            cancelButtonProps={{
              style: { fontSize: '12px', padding: '4px 8px', width: '120px' }, // Style cho nút No
            }}
          >
            <Button type="primary" danger>
              Cancel
            </Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Booking History</h2>
      {loading ? (
        <Spin size="large" />
      )
      : bookings.length === 0 ? (
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
