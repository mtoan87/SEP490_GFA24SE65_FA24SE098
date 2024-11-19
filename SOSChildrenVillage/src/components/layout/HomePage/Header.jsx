import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Popover, Avatar, Typography, Spin } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userName, setUserName] = useState(''); // User's name
  const [userImage, setUserImage] = useState(''); // User's profile image URL
  const [userRoleId, setUserRoleId] = useState(null); // User's role ID
  const [loading, setLoading] = useState(true); // API loading state
  const navigate = useNavigate();

  // Check login state and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    if (token && userId) {
      setIsLoggedIn(true);
      fetchUserInfo(userId);
    } else {
      setLoading(false); // No need to load if not logged in
    }
  }, []);

  // Fetch user info from API
  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7073/api/UserAccount/GetUserById/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();

      // Extract userName, image URL, and roleId from response
      setUserName(data.userName || 'Guest'); // Set userName or default to 'Guest'
      const imageUrl = data.images?.$values?.[0]?.urlPath; // Extract image URL if available
      setUserImage(imageUrl || ''); // Default to empty if no image
      setUserRoleId(data.roleId || null); // Set roleId or null if undefined
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('userId'); // Clear user ID
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  // Information Box Content
  const userInfoContent = loading ? (
    <Spin /> // Show loading spinner while fetching data
  ) : (
    <div
      style={{
        textAlign: 'center', // Center align content
        padding: '20px', // Add padding
        minWidth: '250px',
      }}
    >
      <Avatar
        size={80}
        src={userImage || undefined}
        icon={!userImage ? <UserOutlined /> : undefined}
        style={{
          marginBottom: '15px',
          border: '2px solid #1890ff', // Add border around avatar
        }}
      />
      <Text
        strong
        style={{
          display: 'block',
          fontSize: '16px',
          marginBottom: '15px',
          color: '#000', // Set text color to black
        }}
      >
        {userName}
      </Text>
      <div style={{ marginBottom: '10px' }}>
        <Link to="/userDetail">
          <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
            View Profile
          </Button>
        </Link>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Link to="/donateHistory">
          <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
            Donate History
          </Button>
        </Link>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Link to="/villageHistory">
          <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
            Village History
          </Button>
        </Link>
      </div>
      {/* Nút "Booking History" */}
      <div style={{ marginBottom: '10px' }}>
        <Link to="/bookingHistory">
          <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
            Booking History
          </Button>
        </Link>
      </div>
      {/* Hiển thị nút Dashboard nếu roleId là 1 */}
      {Number(localStorage.getItem("roleId")) === 1 && (
        <div style={{ marginBottom: '15px' }}>
          <Link to="/admin">
            <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
              Dashboard
            </Button>
          </Link>
        </div>
      )}
      <Button
        type="primary"
        danger
        onClick={handleLogout}
        style={{
          borderRadius: '8px', // Round button
          padding: '5px 20px',
        }}
      >
        Logout
      </Button>
    </div>
  );

  return (
    <header style={{ backgroundColor: '#f0f2f5', padding: '15px 0' }}>
      <Row justify="space-between" align="middle" style={{ maxWidth: '1800px', margin: '0 auto' }}>
        <Col>
          <a href="#"><FacebookOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#4267B2' }} /></a>
          <a href="#"><InstagramOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#E1306C' }} /></a>
          <a href="#"><TwitterOutlined style={{ fontSize: '20px', color: '#1DA1F2' }} /></a>
        </Col>
        <Col>
          {/* Conditionally render login/register or user icon based on login state */}
          {isLoggedIn ? (
            <Popover
              content={userInfoContent}
              title="User Info"
              trigger="click"
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{
                  fontSize: '20px',
                  border: 'none',
                  color: '#1890ff',
                }}
              >
                {userName} {/* Optionally show user's name */}
              </Button>
            </Popover>
          ) : (
            <Row gutter={10}>
              <Col>
                <Link to="/login">
                  <Button
                    type="primary"
                    style={{
                      borderRadius: '8px',
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </Col>
              <Col>
                <Link to="/register">
                  <Button
                    type="default"
                    style={{
                      borderRadius: '8px',
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </header>
  );
};

export default Header;
