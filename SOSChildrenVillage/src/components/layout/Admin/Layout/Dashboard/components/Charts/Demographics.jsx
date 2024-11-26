import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Card, Row, Col } from "antd";
import { getChildrenDemographics, getAcademicPerformanceDistribution } from "../../../../../../../services/chart.api"; // Import API gọi từ BE

const Demographics = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [academicData, setAcademicData] = useState([]);

  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const response = await getChildrenDemographics();
        const transformedData = response.$values.map((item) => ({
          age: item.ageGroup,
          male: item.maleCount,
          female: item.femaleCount,
        }));
        setChildrenData(transformedData);
      } catch (error) {
        console.error("Error fetching children demographics:", error);
      }
    };

    fetchChildrenData();
  }, []);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const response = await getAcademicPerformanceDistribution();
        const transformedData = response.$values.map((item) => ({
          level: item.diploma,
          excellent: item.excellentCount,
          veryGood: item.veryGoodCount,
          good: item.goodCount,
          average: item.averageCount,
          belowAverage: item.belowAverageCount,
        }));
        setAcademicData(transformedData);
      } catch (error) {
        console.error("Error fetching academic performance distribution:", error);
      }
    };

    fetchAcademicData();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Children Demographics">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={childrenData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" fill="#8884d8" name="Male" />
              <Bar dataKey="female" fill="#82ca9d" name="Female" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Academic Performance Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={academicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="excellent" name="Excellent" stackId="a" fill="#52c41a" />
              <Bar dataKey="veryGood" name="Very Good" stackId="a" fill="#73d13d" />
              <Bar dataKey="good" name="Good" stackId="a" fill="#1890ff" />
              <Bar dataKey="average" name="Average" stackId="a" fill="#faad14" />
              <Bar
                dataKey="belowAverage"
                name="Below Average"
                stackId="a"
                fill="#ff4d4f"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default Demographics;
