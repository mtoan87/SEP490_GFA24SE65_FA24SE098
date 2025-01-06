import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { Card } from "antd";
import { getChildTrends } from "../../../../../../../services/chart.api"; // Đường dẫn tới file api của bạn

const colors = ["#8884d8", "#82ca9d", "#ffc658"]; // Màu cho từng Year

const ChildTrends = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getChildTrends();
      if (response) {
        // Chuyển đổi dữ liệu từ API sang format phù hợp với biểu đồ
        const transformedData = Array.from({ length: 12 }, (_, i) => ({
          month: (i + 1).toString(),
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
            tickFormatter={(value) => `Month ${value}`}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [`${value} Children`, `Year ${name}`]}
            labelFormatter={(label) => `Month ${label}`}
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