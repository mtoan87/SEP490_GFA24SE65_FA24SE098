import { useEffect, useState } from 'react';
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
import { getIncomeExpenseComparison } from '../../../../../../../services/chart.api';

function IncomeExpenseChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = 2025;
        const response = await getIncomeExpenseComparison(year);

        if (response) {
          const transformedData = response.labels.$values.map((label, index) => ({
            month: label,
            income: response.incomeData.$values[index] || 0,
            expense: response.expenseData.$values[index] || 0,
          }));
          setChartData(transformedData);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Card>Loading...</Card>;
  }

  if (error) {
    return <Card>Error: {error}</Card>;
  }

  return (
    <Card title="Income vs Expense Chart" style={{ width: '100%', maxWidth: 1555, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
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