import { Layout, Button, Space, Badge, Avatar, Dropdown, Modal } from 'antd';
import { 
  BellOutlined, 
  SettingOutlined, 
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './Header.css';

const { Header } = Layout;

const HeaderComponent = ({ collapsed, userInfo }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const showProfileModal = () => {
    setIsProfileModalVisible(true);
  };

  const handleCancel = () => {
    setIsProfileModalVisible(false);
  };

  const userMenuItems = {
    items: [
      {
        key: 'profile',
        icon: <ProfileOutlined />,
        label: 'Profile',
        onClick: showProfileModal,
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
      },
    ],
  };

  const notificationItems = {
    items: [
      {
        key: '1',
        label: 'You have a new message',
      },
      {
        key: '2',
        label: 'System update completed',
      },
      {
        key: '3',
        label: 'New user registered',
      },
    ],
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      // Handle logout
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <>
      <Header className={`site-header ${collapsed ? 'collapsed' : ''}`}>
        <div className="header-left">
          <span className="page-title">Admin Dashboard</span>
        </div>
        
        <Space className="header-right" size="large">
          <Dropdown 
            menu={notificationItems} 
            placement="bottomRight" 
            trigger={['click']}
          >
            <Badge count={3} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="header-icon-btn"
              />
            </Badge>
          </Dropdown>

          <Button 
            type="text" 
            icon={<SettingOutlined />} 
            className="header-icon-btn"
          />

          <Dropdown 
            menu={{ 
              ...userMenuItems, 
              onClick: handleMenuClick 
            }} 
            placement="bottomRight" 
            trigger={['click']}
          >
            <Space className="user-dropdown" size="small">
              <Avatar icon={<UserOutlined />} />
              <span className="username">{userInfo?.user_Name || 'Admin User'}</span>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Modal
        title="Profile Information"
        open={isProfileModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <div className="profile-info">
          <div className="profile-item">
            <strong>User ID:</strong> {userInfo?.id}
          </div>
          <div className="profile-item">
            <strong>Name:</strong> {userInfo?.user_Name}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {userInfo?.user_Email}
          </div>
          <div className="profile-item">
            <strong>Phone:</strong> {userInfo?.phone}
          </div>
          <div className="profile-item">
            <strong>Address:</strong> {userInfo?.address}
          </div>
          <div className="profile-item">
            <strong>Date of Birth:</strong> {formatDate(userInfo?.dob)}
          </div>
          <div className="profile-item">
            <strong>Gender:</strong> {userInfo?.gender}
          </div>
          <div className="profile-item">
            <strong>Country:</strong> {userInfo?.country}
          </div>
        </div>
      </Modal>
    </>
  );
};

HeaderComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    user_Name: PropTypes.string,
    user_Email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    dob: PropTypes.string,
    gender: PropTypes.string,
    country: PropTypes.string,
  }),
};

export default HeaderComponent;