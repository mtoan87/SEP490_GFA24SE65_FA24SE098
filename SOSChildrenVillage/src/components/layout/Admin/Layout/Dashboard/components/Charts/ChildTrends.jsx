import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { Card } from "antd";
import { getChildTrends } from "../../../../../../../services/chart.api";

const colors = ["#8884d8", "#82ca9d", "#ffc658"];
const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ChildTrends = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getChildTrends();
      if (response) {
        const transformedData = Array.from({ length: 12 }, (_, i) => ({
          month: monthAbbreviations[i],
          "2023": response.data2023.$values[i].count,
          "2024": response.data2024.$values[i].count,
          "2025": response.data2025.$values[i].count,
        }));
        setChartData(transformedData);
      }
    };

    fetchData();
  }, []);

  const years = ["2023", "2024", "2025"];

  return (
    <Card title="Child Trend Over Time">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => value}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [`${value} Children`, `Year ${name}`]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend formatter={(value) => `Year ${value}`} />
          {years.map((year, index) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              stroke={colors[index]}
              activeDot={{ r: 8 }}
              name={year}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ChildTrends;