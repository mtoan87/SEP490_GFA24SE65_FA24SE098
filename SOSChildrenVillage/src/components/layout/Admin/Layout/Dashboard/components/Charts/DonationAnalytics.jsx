import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
  BarChart,
} from "recharts";
import { Card, Row, Col, Select, Spin } from "antd";
import { getDonationTrends } from "../../../../../../../services/chart.api";
import { paymentMethodData } from "../../constants/data";

const { Option } = Select;

const DonationAnalytics = () => {
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  useEffect(() => {
    // Giả sử lấy danh sách các năm từ API hoặc cấu hình sẵn
    setYears([2023, 2024, 2025]); // Bạn có thể thay đổi hoặc lấy từ BE
  }, []);

  useEffect(() => {
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

    fetchDonationTrends(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Donation Trends">
          <Select
            style={{ width: 150, marginBottom: 16 }}
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          {loading ? (
            <Spin tip="Loading..." />
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
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default DonationAnalytics;
