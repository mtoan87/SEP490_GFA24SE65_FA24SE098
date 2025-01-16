import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";
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
  ReadOutlined,
  ToolOutlined,
  LineChartOutlined,
  SwapOutlined,
  HistoryOutlined,
  //PayCircleOutlined,
  //FileImageOutlined,
  //SettingOutlined,
  HeartOutlined,
  BankOutlined,
  ScheduleOutlined,
  //TransactionOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import logo from "../../../../assets/images/logo3.png";

const { Sider } = Layout;

const Sidebar = ({ collapsed, onToggle }) => {
  const menuItems = [
    {
      type: "group",
      label: <span className="font-bold">Overview dashboard</span>,
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/admin">Dashboard</Link>,
        },
      ],
    },
    {
      type: "group",
      label: <span className="font-bold">User & Organization</span>,
      children: [
        {
          key: "users",
          icon: <UserOutlined />,
          label: <Link to="/admin/user-management">Users</Link>,
        },
        /* {
          key: 'roles',
          icon: <UserOutlined />,
          label: <Link to="/admin/roles-management">Roles</Link>,
        }, */
        {
          key: "villages",
          icon: <BankOutlined />,
          label: <Link to="/admin/village-management">Villages</Link>,
        },
        {
          key: "houses",
          icon: <HomeOutlined />,
          label: <Link to="/admin/house-management">Houses</Link>,
        },
        {
          key: "children",
          icon: <TeamOutlined />,
          label: <Link to="/admin/child-management">Children</Link>,
        },
      ],
    },
    {
      type: "group",
      key: "child-transfers",
      label: <span className="font-bold">Child Transfers</span>,
      children: [
        {
          key: "transfer-requests",
          icon: <SwapOutlined />,
          label: (
            <Link to="/admin/transfer-request-management">
              Transfer Requests
            </Link>
          ),
        },
        {
          key: "transfer-history",
          icon: <HistoryOutlined />,
          label: (
            <Link to="/admin/transfer-history-management">
              Transfer History
            </Link>
          ),
        },
      ],
    },
    {
      type: "group",
      label: <span className="font-bold">Academic Management</span>,
      children: [
        {
          key: "schools",
          icon: <ReadOutlined />,
          label: <Link to="/admin/school-management">Schools</Link>,
        },
        {
          key: "subjects",
          icon: <BookOutlined />,
          label: <Link to="/admin/subjects-management">Subjects</Link>,
        },
        {
          key: "activities",
          icon: <ToolOutlined />,
          label: <Link to="/admin/activity-management">Activities</Link>,
        },
        {
          key: "child-progress",
          icon: <LineChartOutlined />,
          label: (
            <Link to="/admin/child-progress-management">Child Progress</Link>
          ),
        },
      ],
    },
    {
      type: "group",
      label: <span className="font-bold">Child Care</span>,
      children: [
        {
          key: "child-needs",
          icon: <HeartOutlined />,
          label: <Link to="/admin/child-need-management">Child Needs</Link>,
        },
        {
          key: "academic",
          icon: <BookOutlined />,
          label: <Link to="/admin/academic-report">Academic Reports</Link>,
        },
        {
          key: "health",
          icon: <MedicineBoxOutlined />,
          label: <Link to="/admin/health-report">Health Reports</Link>,
        },
      ],
    },
    {
      type: "group",
      label: <span className="font-bold">Event & Booking</span>,
      children: [
        {
          key: "events",
          icon: <CalendarOutlined />,
          label: <Link to="/admin/event-management">Events</Link>,
        },
        {
          key: "bookings",
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
      type: "group",
      label: <span className="font-bold">Financial</span>,
      children: [
        {
          key: "income",
          icon: <PlusCircleOutlined />,
          label: <Link to="/admin/income-management">Income</Link>,
        },
        {
          key: "expense",
          icon: <MinusCircleOutlined />,
          label: <Link to="/admin/expense-management">Expense</Link>,
        },
        {
          key: "childrenbad",
          icon: <CheckCircleOutlined />,
          label: <Link to="/admin/children-bad-management">Expense Children</Link>,
        },
        {
          key: "donations",
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
          type: "group",
          key: "wallets-group",
          label: <span className="font-bold">Wallets</span>,
          children: [
            {
              key: "foodstuff-wallet",
              icon: <WalletOutlined />,
              label: <Link to="/admin/foodstuff-wallet">Food & Stuff</Link>,
            },
            {
              key: "facilities-wallet",
              icon: <WalletOutlined />,
              label: <Link to="/admin/facilities-wallet">Facilities</Link>,
            },
            {
              key: "health-wallet",
              icon: <WalletOutlined />,
              label: <Link to="/admin/health-wallet">Health</Link>,
            },
            {
              key: "system-wallet",
              icon: <WalletOutlined />,
              label: <Link to="/admin/system-wallet">System</Link>,
            },
            {
              key: "necessities-wallet",
              icon: <WalletOutlined />,
              label: (
                <Link to="/admin/necessities-wallet">Necessities</Link>
              ),
            },
          ],
        },
      ],
    },
    {
      type: "group",
      label: <span className="font-bold">Inventory</span>,
      children: [
        {
          key: "inventory",
          icon: <ShoppingCartOutlined />,
          label: <Link to="/admin/inventory-management">Inventory</Link>,
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
            height: "40px",
            marginRight: collapsed ? 0 : "10px", // Thay đổi margin dựa trên trạng thái collapsed
            transition: "margin 0.3s",
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
          defaultSelectedKeys={["1"]}
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
