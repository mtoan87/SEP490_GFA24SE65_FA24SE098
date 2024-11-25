import React, { useEffect, useState } from 'react';
import { Table, Spin, Typography, Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const VillageHistory = () => {
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchVillageHistory = async () => {
      try {
        const response = await fetch(
          `https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonatedVillageByUserId?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch village history');
        }
        const data = await response.json();
        const villageData = Array.isArray(data) ? data : data?.$values || [];
        setVillages(villageData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVillageHistory();
  }, [navigate]);

  // Hàm xử lý sự kiện khi nhấn nút "View House"
  const handleViewHouse = (villageId) => {
    navigate(`/list-house/${villageId}`);
  };

  const columns = [
    {
      title: 'Village Name',
      dataIndex: 'villageName',
      key: 'villageName',
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
      title: 'Action',
      key: 'action',
      width: 120,  // Đặt độ rộng cho cột Action
      render: (text, record) => (
        <Button type="primary" onClick={() => handleViewHouse(record.id)}>
          View House
        </Button>
      ),
    },
  ];
  

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Village Donation History</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Result status="error" title="Error Loading Village History" subTitle={error} />
      ) : villages.length === 0 ? (
        <Result
          status="info"
          title="No Village Donations Found"
          subTitle="It seems like you haven't donated to any villages yet."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={villages}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
        />
      )}
    </div>
  );
};

export default VillageHistory;
