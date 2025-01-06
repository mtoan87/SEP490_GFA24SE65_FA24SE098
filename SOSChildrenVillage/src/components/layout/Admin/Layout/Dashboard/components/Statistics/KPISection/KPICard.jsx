import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import {
  getEfficiencyByMonth,
  getBudgetUtilizationPercentage,
  getCostPerChild,
} from "../../../../../../../../services/chart.api";

const KPIStats = () => {
  const [loading, setLoading] = useState(true);
  const [costPerChild, setCostPerChild] = useState(0);
  const [budgetUtilization, setBudgetUtilization] = useState(0);
  const [donationEfficiency, setDonationEfficiency] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cost = await getCostPerChild();
        const budget = await getBudgetUtilizationPercentage();
        const efficiencyResponse = await getEfficiencyByMonth();

        setCostPerChild(cost || 0);
        setBudgetUtilization(budget || 0);
        setDonationEfficiency(efficiencyResponse.efficiency || 0);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card 
      title="Key Performance Indicators" 
      className="mb-6 shadow-md"
      bodyStyle={{ padding: '24px 24px' }}
    >
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={0} className="w-full">
          <Col xs={24} sm={8} className="text-center">
            <Statistic
              title="Cost per Child"
              value={costPerChild}
              prefix="$"
              valueStyle={{ 
                color: "#3f8600",
                fontSize: '24px',
                fontWeight: 'bold'
              }}
              suffix={<RiseOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} className="text-center">
            <Statistic
              title="Budget Utilization"
              value={budgetUtilization}
              suffix="%"
              valueStyle={{ 
                color: "#cf1322",
                fontSize: '24px',
                fontWeight: 'bold'
              }}
              prefix={<FallOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} className="text-center">
            <Statistic
              title="Donation Efficiency"
              value={donationEfficiency}
              suffix="%"
              valueStyle={{ 
                color: donationEfficiency >= 50 ? "#3f8600" : "#cf1322",
                fontSize: '24px',
                fontWeight: 'bold'
              }}
              prefix={donationEfficiency >= 50 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default KPIStats;


{
  /* <Col xs={24} sm={12} md={8} lg={6}>
              <Statistic
                title="Donor Retention Rate"
                value={75}
                suffix="%"
                valueStyle={{ color: "#3f8600" }}
                prefix={<RiseOutlined />}
              />
            </Col> */
}
