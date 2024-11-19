import { Layout, Card, Row, Col, Statistic, Tabs} from "antd";
import { Outlet } from "react-router-dom";
import {
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../AdminLayout";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";


const { Content } = Layout;
const { TabPane } = Tabs;

const DashboardLayout = () => {
  // Sample data (you should replace this with real data from your backend)
  const userStats = {
    total: 1200,
    children: 890,
    houses: 345,
    villages: 12,
    newUsers: 50,
  };

  const financialData = [
    { month: "Jan", income: 4000, expense: 2400, donation: 2400 },
    { month: "Feb", income: 3000, expense: 1398, donation: 2210 },
    { month: "Mar", income: 2000, expense: 9800, donation: 2290 },
    { month: "Apr", income: 2780, expense: 3908, donation: 2000 },
    { month: "May", income: 1890, expense: 4800, donation: 2181 },
    { month: "Jun", income: 2390, expense: 3800, donation: 2500 },
    { month: "Jul", income: 3490, expense: 4300, donation: 2100 },
  ];

  const walletDistribution = [
    { name: "FoodStuff", value: 400, color: "#ff7300" },
    { name: "Facilities", value: 300, color: "#0088FE" },
    { name: "Health", value: 300, color: "#00C49F" },
    { name: "Necessities", value: 200, color: "#FFBB28" },
  ];

  const bookingStats = [
    { date: "Mon", count: 10 },
    { date: "Tue", count: 15 },
    { date: "Wed", count: 8 },
    { date: "Thu", count: 12 },
    { date: "Fri", count: 20 },
    { date: "Sat", count: 17 },
    { date: "Sun", count: 25 },
  ];

  const donationData = [
    { month: "Jan", individual: 1000, corporate: 2000, ngo: 1500 },
    { month: "Feb", individual: 1200, corporate: 1800, ngo: 1700 },
    { month: "Mar", individual: 900, corporate: 2200, ngo: 1400 },
    { month: "Apr", individual: 1500, corporate: 2500, ngo: 2000 },
    { month: "May", individual: 1300, corporate: 2300, ngo: 1800 },
    { month: "Jun", individual: 1100, corporate: 2100, ngo: 1600 },
    { month: "Jul", individual: 1400, corporate: 2400, ngo: 1900 },
  ];

  const paymentMethodData = [
    { method: "Credit Card", count: 350 },
    { method: "Bank Transfer", count: 270 },
    { method: "PayPal", count: 180 },
    { method: "Cash", count: 90 },
    { method: "Crypto", count: 50 },
  ];

  const villageHouseData = [
    { village: "Village A", houses: 50 },
    { village: "Village B", houses: 35 },
    { village: "Village C", houses: 45 },
    { village: "Village D", houses: 30 },
    { village: "Village E", houses: 40 },
  ];

  const childrenDemographics = [
    { age: "0-5", male: 120, female: 100 },
    { age: "6-10", male: 150, female: 130 },
    { age: "11-15", male: 100, female: 110 },
    { age: "16-18", male: 80, female: 70 },
  ];

  const academicData = [
    {
      level: "Primary School",
      excellent: 45,
      good: 30,
      average: 15,
      belowAverage: 10,
    },
    {
      level: "Secondary School",
      excellent: 40,
      good: 35,
      average: 20,
      belowAverage: 5,
    },
    {
      level: "High School",
      excellent: 35,
      good: 40,
      average: 20,
      belowAverage: 5,
    },
  ];

  const childTrendData = [
    { month: 'Jan', '2022': 100, '2023': 120, '2024': 150 },
    { month: 'Feb', '2022': 110, '2023': 130, '2024': 160 },
    { month: 'Mar', '2022': 120, '2023': 140, '2024': 170 },
    { month: 'Apr', '2022': 130, '2023': 150, '2024': 180 },
    { month: 'May', '2022': 140, '2023': 160, '2024': 190 },
    { month: 'Jun', '2022': 150, '2023': 170, '2024': 200 },
    { month: 'Jul', '2022': 160, '2023': 180, '2024': 210 },
    { month: 'Aug', '2022': 170, '2023': 190, '2024': 220 },
    { month: 'Sep', '2022': 180, '2023': 200, '2024': 230 },
    { month: 'Oct', '2022': 190, '2023': 210, '2024': 240 },
    { month: 'Nov', '2022': 200, '2023': 220, '2024': 250 },
    { month: 'Dec', '2022': 210, '2023': 230, '2024': 260 },
  ];
  
  const years = ['2022', '2023', '2024'];
  const colors = ['#8884d8', '#82ca9d', '#ffc658'];


  return (
    <AdminLayout>
      <Content className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          SOS Children Village Overview
        </h1>

        {/* Top Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow bg-blue-50"
            >
              <Statistic
                title="Total Users"
                value={userStats.total}
                prefix={<TeamOutlined className="text-blue-500" />}
                valueStyle={{ color: "#3f8600" }}
              />
              <div className="text-xs text-gray-500 mt-2">{`+${userStats.newUsers} this week`}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow bg-green-50"
            >
              <Statistic
                title="Active Children"
                value={userStats.children}
                prefix={<TeamOutlined className="text-green-500" />}
                valueStyle={{ color: "#cf1322" }}
              />
              <div className="text-xs text-gray-500 mt-2">+12 this month</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow bg-yellow-50"
            >
              <Statistic
                title="Total Events"
                value={45}
                prefix={<CalendarOutlined className="text-yellow-500" />}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="text-xs text-gray-500 mt-2">8 ongoing</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow bg-red-50"
            >
              <Statistic
                title="Total Donations"
                value={28500}
                prefix={<DollarOutlined className="text-red-500" />}
                valueStyle={{ color: "#52c41a" }}
              />
              <div className="text-xs text-gray-500 mt-2">
                +2,345 this month
              </div>
            </Card>
          </Col>
        </Row>

        {/* Key Performance Indicators */}
        <Card title="Key Performance Indicators" className="mb-6 shadow-md">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Cost per Child"
                value={500}
                prefix="$"
                valueStyle={{ color: "#3f8600" }}
                suffix={<RiseOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Budget Utilization"
                value={85}
                suffix="%"
                valueStyle={{ color: "#cf1322" }}
                prefix={<FallOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Donor Retention Rate"
                value={75}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
                prefix={<RiseOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Donation Efficiency"
                value={92}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
                prefix={<RiseOutlined />}
              />
            </Col>
          </Row>
        </Card>

        {/* Main Dashboard Tabs */}
        <Card className="mb-6 shadow-md">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Child Trends" key="1">
              <Card title="Child Trend Over Time">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={childTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {years.map((year, index) => (
                      <Line
                        key={year}
                        type="monotone"
                        dataKey={year}
                        stroke={colors[index]}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabPane>

            <TabPane tab="Financial Overview" key="2">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Income vs Expense" key="1">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabPane>
                <TabPane tab="Donations" key="2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="donation" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </TabPane>
              </Tabs>
            </TabPane>

            <TabPane tab="Resource Distribution" key="3">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Wallet Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={walletDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {walletDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Booking Trends">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={bookingStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Donation Analytics" key="4">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Donation Trends">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={donationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="individual"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                        <Area
                          type="monotone"
                          dataKey="corporate"
                          stackId="1"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                        />
                        <Area
                          type="monotone"
                          dataKey="ngo"
                          stackId="1"
                          stroke="#ffc658"
                          fill="#ffc658"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Payment Methods">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={paymentMethodData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="method" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#1890ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Village Statistics" key="5">
              <Card title="Villages and Houses Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={villageHouseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="village" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="houses" fill="#722ed1" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabPane>

            <TabPane tab="Demographics & Academic" key="6">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Children Demographics">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={childrenDemographics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="male" fill="#8884d8" />
                        <Bar dataKey="female" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Academic Performance Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={academicData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="excellent"
                          name="Excellent"
                          stackId="a"
                          fill="#52c41a"
                        />
                        <Bar
                          dataKey="good"
                          name="Good"
                          stackId="a"
                          fill="#1890ff"
                        />
                        <Bar
                          dataKey="average"
                          name="Average"
                          stackId="a"
                          fill="#faad14"
                        />
                        <Bar
                          dataKey="belowAverage"
                          name="Below Average"
                          stackId="a"
                          fill="#ff4d4f"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
        <Outlet />
      </Content>
    </AdminLayout>
  );
};

export default DashboardLayout;
