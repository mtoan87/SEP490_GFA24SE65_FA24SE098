import { Layout, Button, Space, Dropdown, Menu, Avatar } from 'antd';
import { BellOutlined, SettingOutlined, UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderComponent = ({ userInfo }) => {
  // Define the dropdown menu for user actions
  
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<ProfileOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="text-xl font-bold">Admin Dashboard</div>
      <Space>
        {/* Notification button */}
        <Button type="text" icon={<BellOutlined />} />

        {/* User dropdown with avatar and name */}
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="text">
            <Space>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span>{userInfo?.name || 'User'}</span>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderComponent;
