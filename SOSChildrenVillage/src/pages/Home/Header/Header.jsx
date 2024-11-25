import { useEffect, useState } from "react";
import { Row, Col, Button, Popover, Avatar, Typography, Spin } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const { Text } = Typography;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userRoleId, setUserRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsLoggedIn(true);
      fetchUserInfo(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();

      setUserName(data.userName || "Guest");
      const imageUrl = data.images?.$values?.[0]?.urlPath;
      setUserImage(imageUrl || "");
      setUserRoleId(data.roleId || null);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const userInfoContent = loading ? (
    <Spin />
  ) : (
    <div className="user-popover">
      <Avatar
        size={80}
        src={userImage || undefined}
        icon={!userImage ? <UserOutlined /> : undefined}
        className="user-avatar"
      />
      <Text strong className="user-name">
        {userName}
      </Text>
      <div className="user-links">
        <Link to="/userDetail">
          <Button type="link">View Profile</Button>
        </Link>
      </div>
      {userRoleId === 1 ? (
        <div className="admin-links">
          <Link to="/admin">
            <Button type="link">Dashboard</Button>
          </Link>
        </div>
      ) : (
        <div className="user-menu">
          <Link to="/donateHistory">
            <Button type="link">Donate History</Button>
          </Link>
          <Link to="/villageHistory">
            <Button type="link">Village History</Button>
          </Link>
          <Link to="/bookingHistory">
            <Button type="link">Booking History</Button>
          </Link>
        </div>
      )}
      <Button
        type="primary"
        danger
        onClick={handleLogout}
        className="logout-btn"
      >
        Đăng xuất
      </Button>
    </div>
  );

  return (
    <header className="w-full">
      <div className="bg-white py-2 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Row justify="space-between" align="middle">
            <Col className="flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FacebookOutlined />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <InstagramOutlined />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                <TwitterOutlined />
              </a>
            </Col>
            <Col>
              {isLoggedIn ? (
                <Popover
                  content={userInfoContent}
                  title="User Info"
                  trigger="click"
                  placement="bottomRight"
                  overlayClassName="user-popover-overlay"
                >
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    className="flex items-center hover:text-blue-600"
                  >
                    {userName}
                  </Button>
                </Popover>
              ) : (
                <Row gutter={16} className="items-center">
                  <Col>
                    <Link to="/login">
                      <Button
                        type="primary"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                  </Col>
                  <Col>
                    <Link to="/register">
                      <Button className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Đăng ký
                      </Button>
                    </Link>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};

export default Header;

/* import { useEffect, useState } from 'react';
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

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();

      setUserName(data.userName || 'Guest');
      const imageUrl = data.images?.$values?.[0]?.urlPath;
      setUserImage(imageUrl || '');
      setUserRoleId(data.roleId || null);
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const userInfoContent = loading ? (
    <Spin />
  ) : (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        minWidth: '250px',
      }}
    >
      <Avatar
        size={80}
        src={userImage || undefined}
        icon={!userImage ? <UserOutlined /> : undefined}
        style={{
          marginBottom: '15px',
          border: '2px solid #1890ff',
        }}
      />
      <Text
        strong
        style={{
          display: 'block',
          fontSize: '16px',
          marginBottom: '15px',
          color: '#000',
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
      {userRoleId === 1 ? (
        <div style={{ marginBottom: '15px' }}>
          <Link to="/admin">
            <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
              Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <>
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
          <div style={{ marginBottom: '10px' }}>
            <Link to="/bookingHistory">
              <Button type="link" style={{ fontSize: '14px', color: '#000' }}>
                Booking History
              </Button>
            </Link>
          </div>
        </>
      )}
      <Button
        type="primary"
        danger
        onClick={handleLogout}
        style={{
          borderRadius: '8px',
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
                {userName}
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

export default Header; */
