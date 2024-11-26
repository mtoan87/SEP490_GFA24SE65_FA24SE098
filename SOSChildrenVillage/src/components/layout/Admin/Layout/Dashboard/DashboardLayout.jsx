import { Layout, Card, Tabs, message } from "antd";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../AdminLayout";
import { userStats } from "../Dashboard/constants/data";
import TopStatsCards from "../Dashboard/components/Statistics/StatCards/StatCard";
import KPIStats from "../Dashboard/components/Statistics/KPISection/KPICard";
import ChildTrends from "../Dashboard/components/Charts/ChildTrends";
import Demographics from "../Dashboard/components/Charts/Demographics";
import DonationAnalytics from "../Dashboard/components/Charts/DonationAnalytics";
import FinancialOverview from "../Dashboard/components/Charts/FinancialOverview";
import ResourceDistribution from "../Dashboard/components/Charts/ResourceDistribution";
import VillageStats from "../Dashboard/components/Charts/VillageStats";

const { Content } = Layout;
const { TabPane } = Tabs;

const DashboardLayout = () => {
  const [redirecting, setRedirecting] = useState(false); 
  const navigate = useNavigate();
  const messageShown = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("roleId");
  
    // Chỉ cho phép roleId là "1", "3", hoặc "4"
    if (!token || !["1", "3", "4"].includes(userRole)) {
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
      <Content className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          SOS Children Village Overview
        </h1>

        <TopStatsCards userStats={userStats} />
        <KPIStats />

        {/* Main Dashboard Tabs */}
        <Card className="mb-6 shadow-md">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Child Trends" key="1">
              <ChildTrends />
            </TabPane>
            <TabPane tab="Financial Overview" key="2">
              <FinancialOverview />
            </TabPane>
            <TabPane tab="Resource Distribution" key="3">
              <ResourceDistribution />
            </TabPane>
            <TabPane tab="Donation Analytics" key="4">
              <DonationAnalytics />
            </TabPane>
            <TabPane tab="Village Statistics" key="5">
              <VillageStats />
            </TabPane>
            <TabPane tab="Demographics & Academic" key="6">
              <Demographics />
            </TabPane>
          </Tabs>
        </Card>
        <Outlet />
      </Content>
    </AdminLayout>
  );
};

export default DashboardLayout;
