import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { Card } from "antd";
import { childTrendData, years, colors } from "../../constants/data";

const ChildTrends = () => {
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