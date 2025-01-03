import { Layout, Space, Avatar, Dropdown, Modal } from 'antd';
import {
  // BellOutlined,
  // SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './Header.css';

const { Header } = Layout;

const HeaderComponent = ({ collapsed }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  // Lấy thông tin userId từ localStorage
  const userId = localStorage.getItem('userId');

  // Gọi API để lấy thông tin user
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://localhost:7073/api/UserAccount/GetUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token vào header
            },
          }
        );
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const showProfileModal = () => {
    setIsProfileModalVisible(true);
  };

  const handleCancel = () => {
    setIsProfileModalVisible(false);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      // Xóa token và điều hướng về trang login
      localStorage.removeItem('token');
      localStorage.removeItem('roleId');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const userMenuItems = {
    items: [
      {
        key: 'profile',
        icon: <ProfileOutlined />,
        label: 'Profile',
        onClick: showProfileModal,
      },
      // {
      //   key: 'settings',
      //   icon: <SettingOutlined />,
      //   label: 'Settings',
      // },
      // {
      //   type: 'divider',
      // },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
      },
    ],
  };

  // const notificationItems = {
  //   items: [
  //     {
  //       key: '1',
  //       label: 'You have a new message',
  //     },
  //     {
  //       key: '2',
  //       label: 'System update completed',
  //     },
  //     {
  //       key: '3',
  //       label: 'New user registered',
  //     },
  //   ],
  // };

  return (
    <>
      <Header className={`site-header ${collapsed ? 'collapsed' : ''}`}>
        <div className="header-left">
          <span className="page-title">Admin Dashboard</span>
        </div>

        <Space className="header-right" size="large">
          {/* <Dropdown menu={notificationItems} placement="bottomRight" trigger={['click']}>
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} className="header-icon-btn" />
            </Badge>
          </Dropdown> */}

          {/* <Button type="text" icon={<SettingOutlined />} className="header-icon-btn" /> */}

          <Dropdown
            menu={{
              ...userMenuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Space className="user-dropdown" size="small">
              <Avatar icon={<UserOutlined />} />
              <span className="username">{userInfo?.userName || 'Admin User'}</span>
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
            <strong>Name:</strong> {userInfo?.userName}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {userInfo?.userEmail}
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
};

export default HeaderComponent;
