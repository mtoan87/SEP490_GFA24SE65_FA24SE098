import { Tabs } from "antd";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { TabPane } = Tabs;

const FinancialOverview = () => {
  const financialData = [
    { month: "Jan", income: 4000, expense: 2400, donation: 2400 },
    { month: "Feb", income: 3000, expense: 1398, donation: 2210 },
    { month: "Mar", income: 2000, expense: 9800, donation: 2290 },
    { month: "Apr", income: 2780, expense: 3908, donation: 2000 },
    { month: "May", income: 1890, expense: 4800, donation: 2181 },
    { month: "Jun", income: 2390, expense: 3800, donation: 2500 },
    { month: "Jul", income: 3490, expense: 4300, donation: 2100 },
  ];

  return (
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
  );
};

export default FinancialOverview;
