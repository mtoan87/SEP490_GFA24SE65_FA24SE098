import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../Common/Header/Header';
import Sidebar from '../Common/Sidebar/Sidebar';
import axios from 'axios';

const { Content } = Layout;

const AdminLayout = () => {
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user details after component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    } else {
      // Optionally redirect to login if token is missing
      console.log('User not logged in');
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('https://localhost:7073/api/UserAccount/GetUserById/1', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data); // Assuming the user data is in response.data
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Handle token expiration or errors (e.g., redirect to login)
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderComponent userInfo={userInfo} /> {/* Pass user info to header */}
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

/*import { Layout, Menu } from 'antd';
import { UserOutlined, HomeOutlined, TeamOutlined, HomeFilled } from '@ant-design/icons'; // cái này là để import icon vào
import { Link, Outlet }  from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} theme="dark">
        <div style={{ height: 64, margin: 50, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ fontSize: '15px' }}
          items={[
            {
              key: '1',
              icon: <HomeOutlined style={{ fontSize: '24px' }} />,
              label: <Link to="/admin">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <UserOutlined style={{ fontSize: '24px' }} />,
              label: <Link to="/admin/user-management">User Management</Link>,
            },
            {
              key: '3',
              icon: <HomeFilled style={{ fontSize: '24px' }} />,
              label: <Link to="/admin/house-management">House Management</Link>,
            },
            {
              key: '4',
              icon: <TeamOutlined style={{ fontSize: '24px' }} />,
              label: <Link to="/admin/child-management">Child Management</Link>,
            },
            
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 20px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;*/