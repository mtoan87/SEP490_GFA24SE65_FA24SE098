import { useState, useEffect } from 'react';
import { Table, Spin, message, Result, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const DonateHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        message.error('You must be logged in to view donation history.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://localhost:7073/api/Donation/GetDonationByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token for authentication
            },
          }
        );

        const donationData = response.data?.$values || [];
        if (donationData.length > 0) {
          setDonations(donationData);
        } else {
          message.info('No donations found.');
        }
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to fetch donation history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
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
      render: (dateTime) =>
        dateTime
          ? new Date(dateTime).toLocaleString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) =>
        amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND',
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
    <div style={{ padding: '20px' }}>
      <Title level={2}>Donation History</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Result
          status="error"
          title="Error Loading Donation History"
          subTitle={error}
        />
      ) : donations.length === 0 ? (
        <Result
          status="info"
          title="No Donations Found"
          subTitle="It seems like you haven't made any donations yet."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={donations}
          rowKey={(record) => record.id}
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
