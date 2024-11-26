import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Card } from "antd";
import { getVillageHouseDistribution } from '../../../../../../../services/chart.api';

const VillageStats = () => {
  const [villageData, setVillageData] = useState([]);

  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        const response = await getVillageHouseDistribution();
        const transformedData = response.$values.map(item => ({
          village: item.villageName,
          houses: item.houseCount
        }));
        setVillageData(transformedData);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    };

    fetchVillageData();
  }, []);

  return (
    <Card title="Villages and Houses Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={villageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="village"
            angle={0}
            textAnchor="middle"
            height={40}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="houses" fill="#722ed1" name="Houses" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default VillageStats;
