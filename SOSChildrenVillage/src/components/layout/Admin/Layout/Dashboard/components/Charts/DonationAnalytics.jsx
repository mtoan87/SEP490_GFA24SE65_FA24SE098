import { ResponsiveContainer, AreaChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Bar } from "recharts";
import { Card, Row, Col } from "antd";
import { donationData, paymentMethodData } from "../../constants/data";

const DonationAnalytics = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Donation Trends">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="individual" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="corporate" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="ngo" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
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