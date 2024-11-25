import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import HeaderComponent from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import './AdminIndex.css';
import axios from 'axios';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleToggle = (value) => {
    setCollapsed(value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    } else {
      console.log('User not logged in');
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/1', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <Layout className="admin-layout">
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <Layout className={`main-layout ${collapsed ? 'collapsed' : ''}`}>
        <HeaderComponent collapsed={collapsed} userInfo={userInfo} />
        <Layout className="content-layout">
          <Content className="main-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;