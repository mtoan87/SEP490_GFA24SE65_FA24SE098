import { useEffect, useState } from 'react';
import { Table, Spin, Typography, Alert, Button, Modal, Form, DatePicker, message, Select, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons'; // For image preview
import moment from 'moment';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const ListHouse = () => {
  const { villageId } = useParams(); // Get villageId from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [userId, setUserId] = useState(''); // Store userId
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date for booking

  useEffect(() => {
    // Check if userId is available in localStorage, if not, redirect to login
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
      return;
    }
    setUserId(storedUserId); // Set userId if found

    const fetchHouses = async () => {
      console.log('Fetching houses for villageId:', villageId); // Log villageId
      try {
        const response = await fetch(
          `https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByVillageId/${villageId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch houses');
        }
        const data = await response.json();
        console.log('Data received from API:', data); // Log raw data from API

        if (Array.isArray(data)) {
          setHouses(data);
        } else {
          console.warn('Data is not an array, setting empty array');
          setHouses([]);
        }
      } catch (error) {
        console.error('Error fetching houses:', error); // Log error if any
        setError(error.message);
      } finally {
        console.log('Finished fetching houses'); // Log when finished
        setLoading(false);
      }
    };

    fetchHouses();
  }, [villageId, navigate]);

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank'); // Open image in new tab
  };

  const handleBooking = async (values) => {
    try {
      const bookingData = {
        houseId: selectedHouse.id, // Get the houseId from the selected house
        visitday: values.visitday.format('YYYY-MM-DD'),
        bookingSlotId: values.bookingSlotId,
        userAccountId: userId, // Use the correct userId here
      };

      // Log the booking data before making the API call
      console.log('Sending booking request with data:', bookingData);

      // Make the API call to create a booking
      const response = await axios.post(
        'https://soschildrenvillage.azurewebsites.net/api/Booking/CreateBooking', // Correct API URL
        bookingData
      );

      // Log the entire response to check the structure
      console.log('Booking response:', response);

      // Check if the API returned success
      if (response.data && response.data.success) {
        message.success('Booking successful!');
        setIsModalVisible(false); // Close modal
      } else {
        // If success is false, show the error message from the API response
        const errorMessage = response.data.message
          ? response.data.message
          : 'An unknown error occurred. Please try again.';

        // Get details of the booking attempt (visit day, slot, and house name)
        const { visitday, bookingSlotId } = values;
        const { houseName } = selectedHouse;

        message.error(`${errorMessage} (House: ${houseName}, Slot: ${bookingSlotId}, Date: ${visitday.format('YYYY-MM-DD')})`);
      }
    } catch (error) {
      // Log any errors that occur during the booking process
      console.error('Booking error:', error);

      // Check if error.response is available to handle HTTP errors
      if (error.response) {
        // This handles API errors such as 404, 500, etc.
        const { houseName } = selectedHouse;

        const errorMessage = error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An unknown error occurred during the booking process.';

        message.error(`${errorMessage} House: ${houseName}`);
      } else {
        // Handle network errors or other issues
        message.error('Failed to make a booking. Please try again.');
      }
    }
  };

  const columns = [
    {
      title: 'House Name',
      dataIndex: 'houseName',
      key: 'houseName',
    },
    {
      title: 'House Number',
      dataIndex: 'houseNumber',
      key: 'houseNumber',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'House Owner',
      dataIndex: 'houseOwner',
      key: 'houseOwner',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      render: (imageUrls) => (
        <div>
          {imageUrls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="House Image"
              style={{ width: 50, height: 50, marginRight: 8, cursor: 'pointer' }}
              onClick={() => window.open(url, '_blank')}
            />
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedHouse(record); // Đặt nhà được chọn
            setIsModalVisible(true);  // Hiển thị modal
          }}          
        >
          Book Now
        </Button>
      ),
    },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Houses in Village</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={houses.map((item, index) => ({
            key: index,
            ...item,
          }))}
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title="Booking House"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleBooking} layout="vertical">
          <Form.Item name="visitday" label="Visit Day" rules={[{ required: true }]}>
            <DatePicker
              format="YYYY-MM-DD"
              onChange={handleDateChange}
              disabledDate={(current) => current && current < moment().startOf('day')} // Cho phép chọn ngày mai và các ngày sau
            />
          </Form.Item>

          <Form.Item name="bookingSlotId" label="Slot Time" rules={[{ required: true }]}>
            <Select>
              {[1, 2, 3, 4, 5, 6, 7].map((slot) => {
                const currentTime = moment();
                const slotStartTime = moment(getSlotStartTime(slot), "HH:mm");
                const isDisabled = selectedDate && selectedDate.isSame(moment(), 'day') && currentTime.isAfter(slotStartTime);
                return (
                  <Option
                    key={slot}
                    value={slot}
                    disabled={isDisabled}
                  >
                    {`Slot ${slot} (${getSlotStartTime(slot)} - ${moment(getSlotStartTime(slot), 'HH:mm').add(1, 'hour').format('HH:mm')})`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Book
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListHouse;

// Helper function to get slot start time
function getSlotStartTime(slot) {
  switch (slot) {
    case 1: return "09:00";
    case 2: return "10:00";
    case 3: return "11:00";
    case 4: return "12:00";
    case 5: return "13:00";
    case 6: return "14:00";
    case 7: return "15:00";
    default: return "09:00";
  }
}
