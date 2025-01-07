import { Card } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Dữ liệu mẫu
const data = [
  { month: 'Jan', income: 4000, expense: 2400 },
  { month: 'Feb', income: 3000, expense: 1398 },
  { month: 'Mar', income: 2000, expense: 9800 },
  { month: 'Apr', income: 2780, expense: 3908 },
  { month: 'May', income: 1890, expense: 4800 },
  { month: 'Jun', income: 2390, expense: 3800 },
  { month: 'Jul', income: 3490, expense: 4300 },
  { month: 'Aug', income: 4000, expense: 2400 },
  { month: 'Sep', income: 3000, expense: 1398 },
  { month: 'Oct', income: 2000, expense: 9800 },
  { month: 'Nov', income: 2780, expense: 3908 },
  { month: 'Dec', income: 1890, expense: 4800 },
];

function IncomeExpenseChart() {
  return (
    <Card title="Income vs Expense Chart" style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#8884d8" name="Income" />
          <Bar dataKey="expense" fill="#82ca9d" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default IncomeExpenseChart;
