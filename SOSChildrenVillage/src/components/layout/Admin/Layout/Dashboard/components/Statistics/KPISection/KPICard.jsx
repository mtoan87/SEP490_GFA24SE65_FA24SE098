import { Card, Row, Col, Statistic } from "antd";
import { RiseOutlined, FallOutlined } from "@ant-design/icons";

const KPIStats = () => {
  return (
    <Card title="Key Performance Indicators" className="mb-6 shadow-md">
      <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Cost per Child"
                value={500}
                prefix="$"
                valueStyle={{ color: "#3f8600" }}
                suffix={<RiseOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Budget Utilization"
                value={85}
                suffix="%"
                valueStyle={{ color: "#cf1322" }}
                prefix={<FallOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Donor Retention Rate"
                value={75}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
                prefix={<RiseOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Donation Efficiency"
                value={92}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
                prefix={<RiseOutlined />}
              />
            </Col>
          </Row>
    </Card>
  );
};

export default KPIStats;