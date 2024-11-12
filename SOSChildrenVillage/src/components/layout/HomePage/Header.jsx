import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Dropdown, Menu } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userName, setUserName] = useState(''); // Optionally track user's name or other details
  const navigate = useNavigate();

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('User'); // Assuming you store user's name after login

    if (token) {
      setIsLoggedIn(true);
      setUserName(storedUserName ); // Set userName if available
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('userName'); // Clear user info if stored
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  // Menu for the user icon dropdown
  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/userDetail">View Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header style={{ backgroundColor: '#f0f2f5', padding: '15px 0' }}>
      <Row justify="space-between" align="middle" style={{ maxWidth: '1800px', margin: '0 auto' }}>
        <Col>
          <a href="#"><FacebookOutlined style={{ fontSize: '20px', marginRight: '10px' }} /></a>
          <a href="#"><InstagramOutlined style={{ fontSize: '20px', marginRight: '10px' }} /></a>
          <a href="#"><TwitterOutlined style={{ fontSize: '20px' }} /></a>
        </Col>
        <Col>
          {/* Conditionally render login/register or user icon based on login state */}
          {isLoggedIn ? (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button type="text" icon={<UserOutlined />} style={{ fontSize: '20px' }}>
                {userName} {/* Optionally show user's name */}
              </Button>
            </Dropdown>
          ) : (
            <>
              <Link to="/login">
                <Button type="primary" style={{ marginRight: '10px' }}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button type="default">
                  Register
                </Button>
              </Link>
            </>
          )}
        </Col>
      </Row>
    </header>
  );
};

export default Header;
