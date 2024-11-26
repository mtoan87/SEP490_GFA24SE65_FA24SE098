import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { Card } from "antd";
import { villageHouseData } from "../../constants/data";

const VillageStats = () => {
  return (
    <Card title="
Villages and Houses Distribution">
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
  );
};

export default VillageStats;
