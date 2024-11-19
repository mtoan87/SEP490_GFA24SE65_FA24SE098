import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChildTrends = () => {
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
  );
};

export default ChildTrends;