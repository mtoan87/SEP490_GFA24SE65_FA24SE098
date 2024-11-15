import React, { useState, useEffect } from 'react';
import { Table, Spin, message, Result } from 'antd';
import axios from 'axios';

const DonateHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        message.error('User not logged in or token missing');
        setLoading(false);
        return;
      }

      const fetchDonations = async () => {
        try {
          console.log('Sending request to fetch donations for userId:', userId);
          const response = await axios.get(`https://localhost:7073/api/Donation/GetDonationByUserId/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,  // Gửi token trong header Authorization
            },
          });

          // Log response data
          console.log('Received response:', response.data);

          const donationData = response.data?.$values || [];

          if (donationData.length > 0) {
            setDonations(donationData);
          } else {
            message.info('No donations found');
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching donations:', error);
          setError('Error fetching donations');
          setLoading(false);
        }
      };

      fetchDonations();
    }
  }, []);

  const columns = [
    {
      title: 'Donation Type',
      dataIndex: 'donationType',
      key: 'donationType',
    },
    {
      title: 'Date Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (dateTime) => new Date(dateTime).toLocaleString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) =>
        amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Result
          status="error"
          title="Failed to Load Donations"
          subTitle={error || 'There was an error while fetching your donations. Please try again later.'}
        />
      ) : donations.length === 0 ? (
        <Result
          status="info"
          title="No Donations Found"
          subTitle="It seems like you have not made any donations yet."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={donations}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
          }}
        />
      )}
    </div>
  );
};

export default DonateHistory;
