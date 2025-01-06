import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, Row, Col, Spin, Select } from "antd";
import {
  getDonationTrends,
  getPaymentMethodStatistics,
} from "../../../../../../../services/chart.api";

const { Option } = Select;

const DonationAnalytics = () => {
  const [donationData, setDonationData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  // Fetch years (you might want to get this from an API in a real scenario)
  useEffect(() => {
    setYears([2023, 2024, 2025]);
  }, []);

  // Fetch payment methods data
  const fetchPaymentMethodsData = async () => {
    try {
      const response = await getPaymentMethodStatistics();

      if (response?.statistics?.$values) {
        const formattedData = response.statistics.$values.map((item) => ({
          method: item.paymentMethod,
          count: item.numberOfUses,
          amount: item.totalAmount,
        }));
        setPaymentMethodData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    }
  };

  // Fetch donation trends data
  const fetchDonationTrends = async (year) => {
    setLoading(true);
    try {
      const response = await getDonationTrends(year);

      const monthlyDetails = response?.monthlyDetails?.$values || [];

      const formattedData = monthlyDetails.map((detail) => ({
        month: new Date(year, detail.month - 1).toLocaleString("en-US", {
          month: "short",
        }),
        event: detail.eventAmount,
        child: detail.childAmount,
        wallet: detail.walletAmount,
        total: detail.totalAmount,
      }));

      setDonationData(formattedData);
    } catch (error) {
      console.error("Failed to fetch donation trends:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment methods data only once when component mounts
  useEffect(() => {
    fetchPaymentMethodsData();
  }, []);

  // Fetch donation trends data when selected year changes
  useEffect(() => {
    fetchDonationTrends(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Donation Trends</span>
              <Select
                style={{ width: 120 }}
                value={selectedYear}
                onChange={handleYearChange}
              >
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>
          }
        >
          {loading ? (
            <div
              style={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin tip="Loading data..." />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="event"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="child"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="wallet"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Payment Methods">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="method" type="category" />
              <Tooltip
                formatter={(value, name) =>
                  name === "count"
                    ? [`${value} uses`, "Number of Uses"]
                    : [`${value}`, "Total Amount"]
                }
              />
              <Legend />
              <Bar dataKey="count" fill="#1890ff" name="Number of Uses" />
              <Bar dataKey="amount" fill="#82ca9d" name="Total Amount" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default DonationAnalytics;
