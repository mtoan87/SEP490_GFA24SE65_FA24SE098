import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { TeamOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { 
    getActiveChildrenStat, 
    getTotalUsersStat, 
    getTotalEventsStat, 
    getTotalDonationStat, 
    getTotalIncomeStat, 
    getTotalExpenseStat 
} from '../../../../../../../../services/chart.api';

const TopStatsCards = () => {
  const [stats, setStats] = useState({
    totalUsers: { totalUsers: 0, newUsersThisWeek: 0 },
    activeChildren: { totalActiveChildren: 0, changeThisMonth: 0 },
    totalEvents: { totalEvents: 0, onGoingEvents: 0 },
  });

  const [donationStats, setDonationStats] = useState({ totalDonation: 0, totalDonationThisMonth: 0 });
  const [incomeStats, setIncomeStats] = useState({ totalIncome: 0, totalIncomeThisMonth: 0 });
  const [expenseStats, setExpenseStats] = useState({ totalExpense: 0, totalExpenseThisMonth: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          usersData,
          childrenData,
          eventsData,
          donationsData,
          incomeData,
          expensesData
        ] = await Promise.all([
          getTotalUsersStat(),
          getActiveChildrenStat(),
          getTotalEventsStat(),
          getTotalDonationStat(),
          getTotalIncomeStat(),
          getTotalExpenseStat()
        ]);

        setStats({
          totalUsers: usersData,
          activeChildren: childrenData,
          totalEvents: eventsData,
        });
        setDonationStats(donationsData);
        setIncomeStats(incomeData);
        setExpenseStats(expensesData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {/* Row 1 */}
      <Col xs={24} sm={12} lg={8}>
        <Card bordered={false} className="hover:shadow-lg transition-shadow bg-blue-50">
          <Statistic
            title="Total Users"
            value={stats.totalUsers.totalUsers}
            prefix={<TeamOutlined className="text-blue-500" />}
            valueStyle={{ color: "#3f8600" }}
          />
          <div className="text-xs text-gray-500 mt-2">
            +{stats.totalUsers.newUsersThisWeek} this week
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card bordered={false} className="hover:shadow-lg transition-shadow bg-green-50">
          <Statistic
            title="Active Children"
            value={stats.activeChildren.totalActiveChildren}
            prefix={<TeamOutlined className="text-green-500" />}
            valueStyle={{ color: "#cf1322" }}
          />
          <div className="text-xs text-gray-500 mt-2">
            +{stats.activeChildren.changeThisMonth} this month
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card bordered={false} className="hover:shadow-lg transition-shadow bg-yellow-50">
          <Statistic
            title="Total Events"
            value={stats.totalEvents.totalEvents}
            prefix={<CalendarOutlined className="text-yellow-500" />}
            valueStyle={{ color: "#1890ff" }}
          />
          <div className="text-xs text-gray-500 mt-2">
            {stats.totalEvents.onGoingEvents} ongoing
          </div>
        </Card>
      </Col>

      {/* Row 2 */}
      <Col xs={24} sm={12} lg={8}>
        <Card bordered={false} className="hover:shadow-lg transition-shadow bg-red-50">
          <Statistic
            title="Total Donations"
            value={donationStats.totalDonation}
            prefix={<DollarOutlined className="text-red-500" />}
            valueStyle={{ color: "#52c41a" }}
          />
          <div className="text-xs text-gray-500 mt-2">
            +{donationStats.totalDonationThisMonth} this month
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card bordered={false} className="hover:shadow-lg transition-shadow bg-teal-50">
          <Statistic
            title="Total Income"
            value={incomeStats.totalIncome}
            prefix={<DollarOutlined className="text-teal-500" />}
            valueStyle={{ color: "#52c41a" }}
          />
          <div className="text-xs text-gray-500 mt-2">
            +{incomeStats.totalIncomeThisMonth} this month
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card bordered={false} className="hover:shadow-lg transition-shadow bg-gray-50">
          <Statistic
            title="Total Expense"
            value={expenseStats.totalExpense}
            prefix={<DollarOutlined className="text-gray-500" />}
            valueStyle={{ color: "#cf1322" }}
          />
          <div className="text-xs text-gray-500 mt-2">
            +{expenseStats.totalExpenseThisMonth} this month
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default TopStatsCards;