import { Layout, Card, Tabs, message } from "antd";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../AdminLayout";
import TopStatsCards from "../Dashboard/components/Statistics/StatCards/StatCard";
import KPIStats from "../Dashboard/components/Statistics/KPISection/KPICard";
import ChildTrends from "../Dashboard/components/Charts/ChildTrends";
import Demographics from "../Dashboard/components/Charts/Demographics";
import DonationAnalytics from "../Dashboard/components/Charts/DonationAnalytics";
import FinancialOverview from "../Dashboard/components/Charts/FinancialOverview";
import ResourceDistribution from "../Dashboard/components/Charts/ResourceDistribution";
import VillageStats from "../Dashboard/components/Charts/VillageStats";
import "./DashboardLayout.css";

const { Content } = Layout;
const { TabPane } = Tabs;

const DashboardLayout = () => {
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("roleId");

    if (!token || !["1", "3", "4", "5", "6"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/home");
        messageShown.current = true;
      }
    } else {
      "/admin";
    }
  }, [navigate, redirecting]);

  return (
    <AdminLayout>
      <Content className="dashboard-content">
        <h1 className="dashboard-title">SOS Children Villages Overview</h1>

        <div className="stats-section">
          <TopStatsCards />
        </div>

        <div className="stats-section">
          <KPIStats />
        </div>

        {/* Main Dashboard Tabs */}
        <Card className="main-dashboard-card">
          <Tabs defaultActiveKey="1" className="dashboard-tabs">
            <TabPane tab="Child Trends" key="1">
              <div className="dashboard-tab-content">
                <ChildTrends />
              </div>
            </TabPane>
            <TabPane tab="Financial Overview" key="2">
              <div className="dashboard-tab-content">
                <FinancialOverview />
              </div>
            </TabPane>
            <TabPane tab="Resource Distribution" key="3">
              <div className="dashboard-tab-content">
                <ResourceDistribution />
              </div>
            </TabPane>
            <TabPane tab="Donation Analytics" key="4">
              <div className="dashboard-tab-content">
                <DonationAnalytics />
              </div>
            </TabPane>
            <TabPane tab="Village Statistics" key="5">
              <div className="dashboard-tab-content">
                <VillageStats />
              </div>
            </TabPane>
            <TabPane tab="Demographics & Academic" key="6">
              <div className="dashboard-tab-content">
                <Demographics />
              </div>
            </TabPane>
          </Tabs>
        </Card>
        <Outlet />
      </Content>
    </AdminLayout>
  );
};

export default DashboardLayout;