import React, { useEffect, useState } from 'react';
import { Table, Spin, Typography, Result, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const VillageHistory = () => {
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [fullDescription, setFullDescription] = useState(''); // Store the full description to show in the modal
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

  // Hàm xử lý khi nhấn vào tên làng, mở tab mới
  const handleVillageClick = (villageId) => {
    window.open(`/villagedetail/${villageId}`, "_blank");
  };

  // Hàm xử lý khi nhấn "Read More"
  const handleReadMore = (description) => {
    setFullDescription(description); // Set the full description to display in the modal
    setIsModalVisible(true); // Show the modal
  };

  const columns = [
    {
      title: 'Village Name',
      dataIndex: 'villageName',
      key: 'villageName',
      align: 'center',
      render: (villageName, record) => (
        <Button type="link" onClick={() => handleVillageClick(record.id)}>
          {villageName}
        </Button>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      render: (description) => (
        <p>
          {description?.length > 100
            ? `${description.slice(0, 100)}...`
            : description || 'No description'}

          {description?.length > 100 && (
            <Button type="link" onClick={() => handleReadMore(description)}>
              Read More
            </Button>
          )}
        </p>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 120, // Đặt độ rộng cho cột Action
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

      {/* Modal for displaying full description */}
      <Modal
        title="Full Description"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p>{fullDescription}</p>
      </Modal>
    </div>
  );
};

export default VillageHistory;
