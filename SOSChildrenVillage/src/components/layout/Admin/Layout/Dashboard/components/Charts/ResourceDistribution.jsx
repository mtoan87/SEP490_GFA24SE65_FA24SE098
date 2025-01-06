import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Cell,
} from "recharts";
import { Card, Row, Col, Spin, Alert, Select } from "antd";
import {
  getWalletDistribution,
  getBookingTrends,
} from "../../../../../../../services/chart.api";

const { Option } = Select;

const ResourceDistribution = () => {
  const [walletData, setWalletData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false); // Chỉ loading cho booking data
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("Year");

  // Tách riêng fetch wallet data
  const fetchWalletData = async () => {
    try {
      const userAccountId = "UA001";
      const walletResponse = await getWalletDistribution(userAccountId);

      if (walletResponse) {
        setWalletData([
          {
            name: "Food Stuff",
            value: walletResponse.foodStuffPercentage,
            color: "#8884d8",
          },
          {
            name: "Health",
            value: walletResponse.healthPercentage,
            color: "#82ca9d",
          },
          {
            name: "Facilities",
            value: walletResponse.facilitiesPercentage,
            color: "#ffc658",
          },
          {
            name: "Necessities",
            value: walletResponse.necessitiesPercentage,
            color: "#ff8042",
          },
          {
            name: "System",
            value: walletResponse.systemPercentage,
            color: "#8dd1e1",
          },
        ]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch wallet data");
    }
  };

  // Tách riêng fetch booking data
  const fetchBookingData = async (timeFrameValue) => {
    setLoading(true);
    try {
      const bookingResponse = await getBookingTrends(timeFrameValue);

      if (bookingResponse) {
        const { bookingCounts, labels } = bookingResponse;
        const formattedLabels = labels?.$values || labels;
        const formattedBookingCounts = bookingCounts?.$values || bookingCounts;

        if (formattedLabels && formattedBookingCounts) {
          const formattedBookingData = formattedLabels.map((label, index) => ({
            date: label,
            count: formattedBookingCounts[index],
          }));
          setBookingData(formattedBookingData);
        } else {
          throw new Error("Invalid booking trends data format");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch booking data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet data chỉ 1 lần khi component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  // Fetch booking data khi timeFrame thay đổi
  useEffect(() => {
    fetchBookingData(timeFrame);
  }, [timeFrame]);

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Wallet Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={walletData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {walletData.map((entry, index) => (
                  <Cell key={`wallet-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Booking Trends</span>
              <Select
                defaultValue="Year"
                onChange={handleTimeFrameChange}
                style={{ width: 120 }}
              >
                <Option value="Week">Week</Option>
                <Option value="Month">Month</Option>
                <Option value="Year">Year</Option>
              </Select>
            </div>
          }
        >
          {loading ? (
            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spin tip="Loading data..." />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  key="booking-line"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ResourceDistribution;