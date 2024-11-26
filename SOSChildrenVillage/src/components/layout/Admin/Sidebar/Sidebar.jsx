import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css'
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  WalletOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  //PayCircleOutlined,
  FileImageOutlined,
  SettingOutlined,
  BankOutlined,
  ScheduleOutlined,
  //TransactionOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import logo from '../../../../assets/images/logo3.png';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onToggle }) => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Overview dashboard</Link>,
    },
    {
      type: 'group',
      label: 'User & Organization',
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: <Link to="/admin/user-management">Users</Link>,
        },
        /* {
          key: 'roles',
          icon: <UserOutlined />,
          label: <Link to="/admin/roles-management">Roles</Link>,
        }, */
        {
          key: 'villages',
          icon: <BankOutlined />,
          label: <Link to="/admin/village-management">Villages</Link>,
        },
        {
          key: 'houses',
          icon: <HomeOutlined />,
          label: <Link to="/admin/house-management">Houses</Link>,
        },
        {
          key: 'children',
          icon: <TeamOutlined />,
          label: <Link to="/admin/child-management">Children</Link>,
        },
      ],
    },
    {
      type: 'group',
      label: 'Academic & Health Reports',
      children: [
        {
          key: 'academic',
          icon: <BookOutlined />,
          label: <Link to="/admin/academic-report">Academic</Link>,
        },
        {
          key: 'health',
          icon: <MedicineBoxOutlined />,
          label: <Link to="/admin/health-report">Health</Link>,
        },
      ],
    },
    {
      type: 'group',
      label: 'Event & Booking',
      children: [
        {
          key: 'events',
          icon: <CalendarOutlined />,
          label: <Link to="/admin/event-management">Events</Link>,
        },
        {
          key: 'bookings',
          icon: <ScheduleOutlined />,
          label: <Link to="/admin/booking-management">Bookings</Link>,
        },
        /* {
          key: 'bookingslot',
          icon: <ScheduleOutlined />,
          label: <Link to="/admin/booking-slot-management">Schedule booking</Link>,
        }, */
      ],
    },
    {
      type: 'group',
      label: 'Financial',
      children: [
        {
          key: 'income',
          icon: <PlusCircleOutlined />,
          label: <Link to="/admin/income-management">Income</Link>,
        },
        {
          key: 'expense',
          icon: <MinusCircleOutlined />,
          label: <Link to="/admin/expense-management">Expense</Link>,
        },
        {
          key: 'donations',
          icon: <DollarOutlined />,
          label: <Link to="/admin/donation-management">Donations</Link>,
        },
        /* {
          key: 'payments',
          icon: <PayCircleOutlined />,
          label: <Link to="/admin/payment-management">Payments</Link>,
        }, */
        /* {
          key: 'transactions',
          icon: <TransactionOutlined />,
          label: <Link to="/admin/transaction-management">Transactions</Link>,
        }, */
        {
          type: 'group',
          key: 'wallets-group',
          label: 'Wallets',
          children: [
            {
              key: 'foodstuff-wallet',
              icon: <WalletOutlined />,
              label: <Link to="/admin/foodstuff-wallet">Food & Stuff</Link>,
            },
            {
              key: 'facilities-wallet',
              icon: <WalletOutlined />,
              label: <Link to="/admin/facilities-wallet">Facilities</Link>,
            },
            {
              key: 'health-wallet',
              icon: <WalletOutlined />,
              label: <Link to="/admin/health-wallet">Health</Link>,
            },
            {
              key: 'system-wallet',
              icon: <WalletOutlined />,
              label: <Link to="/admin/system-wallet">System wallet</Link>,
            },
            {
              key: 'necessities-wallet',
              icon: <WalletOutlined />,
              label: <Link to="/admin/necessities-wallet">Necessities wallet</Link>,
            },
          ]
        },
      ],
    },
    {
      type: 'group',
      label: 'System',
      children: [
        {
          key: 'media',
          icon: <FileImageOutlined />,
          label: <Link to="/admin/media-management">Image management</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings-management">Settings</Link>,
        },
      ],
    },
  ];

  return (
<Sider 
      collapsible 
      collapsed={collapsed}
      trigger={null}
      width={250}
      collapsedWidth={80}
      className="site-sidebar"
    >
      {/* Header với logo */}
      <div className="sidebar-header">
      <img
          src={logo}
          alt="Project Logo"
          className="logo-image"
          style={{
            height: '40px', // Chiều cao logo
            marginRight: collapsed ? 0 : '10px', // Thay đổi margin dựa trên trạng thái collapsed
            transition: 'margin 0.3s', // Hiệu ứng chuyển đổi
          }}
        />
        <button
          onClick={() => onToggle(!collapsed)}
          className="collapse-button"
        >
          <span className="text-xl">☰</span>
        </button>        
      </div>
      
      <div className="sidebar-menu custom-scrollbar">
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
        />
      </div>
    </Sider>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;