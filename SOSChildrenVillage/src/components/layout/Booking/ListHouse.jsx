import React, { useEffect, useState } from 'react';
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
          `https://localhost:7073/api/Houses/GetHouseByVillageId/${villageId}`
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
        houseId: selectedHouse.houseId, // Get the houseId from the selected house
        visitday: values.visitday.format('YYYY-MM-DD'),
        bookingSlotId: values.bookingSlotId,
        userAccountId: userId, // Use the correct userId here
      };

      // Log the booking data before making the API call
      console.log('Sending booking request with data:', bookingData);

      // Make the API call to create a booking
      const response = await axios.post(
        'https://localhost:7073/api/Booking/CreateBooking', // Correct API URL
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
            setSelectedHouse(record); // Set selected house for booking
            setIsModalVisible(true); // Show booking modal
          }}
        >
          Book Now
        </Button>
      ),
    },
  ];

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
          {/* Remove or comment out the House field */}
          {/* <Form.Item label="House" name="houseName">
      <Input value={selectedHouse?.houseName} disabled />
    </Form.Item> */}

          <Form.Item name="visitday" label="Visit Day" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="bookingSlotId" label="Slot Time" rules={[{ required: true }]}>
            <Select>
              <Option value={1}>Slot 1 (9h - 10h)</Option>
              <Option value={2}>Slot 2 (10h - 11h)</Option>
              <Option value={3}>Slot 3 (11h - 12h)</Option>
              <Option value={4}>Slot 4 (12h - 13h)</Option>
              <Option value={5}>Slot 5 (13h - 14h)</Option>
              <Option value={6}>Slot 6 (14h - 15h)</Option>
              <Option value={7}>Slot 7 (15h - 16h)</Option>
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
