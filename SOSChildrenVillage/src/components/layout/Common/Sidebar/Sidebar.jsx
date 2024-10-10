import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, UserOutlined, HomeFilled, TeamOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider width={300} theme="blue">
      <div style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: '20px' }}>Logo của Project</span>
      </div>
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
            label: <Link to="/admin/user-management">Users management</Link>,
          },
          {
            key: '3',
            icon: <HomeFilled style={{ fontSize: '24px' }} />,
            label: <Link to="/admin/village-management">Villages management</Link>,
          },
          {
            key: '4',
            icon: <HomeFilled style={{ fontSize: '24px' }} />,
            label: <Link to="/admin/house-management">Houses management</Link>,
          },
          {
            key: '5',
            icon: <TeamOutlined style={{ fontSize: '24px' }} />,
            label: <Link to="/admin/child-management">Child management</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;