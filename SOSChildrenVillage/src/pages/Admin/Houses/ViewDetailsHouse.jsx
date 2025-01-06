import { useState } from "react";
import {
  Modal,
  Tabs,
  Card,
  Button,
  Statistic,
  List,
  Table,
  Typography,
  Row,
  Col,
  Progress,
  Image,
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  ToolOutlined,
  PictureOutlined,
  TrophyOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";
import { MapPin, CalendarDays } from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const ViewDetailsHouse = ({ isVisible, house, onClose }) => {
  const [activeTab, setActiveTab] = useState("1");

  if (!house) return null;

  const childrenColumns = [
    {
      title: "Child Id",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Child Name",
      dataIndex: "childName",
      key: "childName",
      align: "center",
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (text) => text || "N/A",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      align: "center",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
      align: "center",
      render: (text) => (
        <span style={{ color: text === "Healthy" ? "#52c41a" : "#ff4d4f" }}>
          {text || "Unknown"}
        </span>
      ),
    },
  ];

  const inventoryColumns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      align: "center",
    },
    {
      title: "Maintenance Status",
      dataIndex: "maintenanceStatus",
      key: "maintenanceStatus",
      align: "center",
    },
    {
      title: "Last Inspection Date",
      dataIndex: "lastInspectionDate",
      key: "lastInspectionDate",
      align: "center",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={
        <Button
          type="primary"
          onClick={onClose}
          block
          style={{ height: "40px", fontSize: "16px" }}
        >
          Close
        </Button>
      }
      width={1000}
      title={
        <div style={{ marginBottom: "16px" }}>
          <div className="flex items-center gap-2 mb-2">
            <Title level={3} style={{ margin: 0, fontSize: "28px" }}>
              {house.houseName}
            </Title>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={18} />
            {house.location}
          </div>
        </div>
      }
      className="house-details-modal"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "1",
            label: (
              <span className="flex items-center gap-3">
                <HomeOutlined />
                Overview
              </span>
            ),
            children: (
              <AnimatePresence>
                <div
                  className="flex gap-4 mb-6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          title={
                            <span className="flex items-center gap-4">
                              <HomeOutlined className="text-blue-500" />
                              Basic Information
                            </span>
                          }
                        >
                          <List
                            className="text-base"
                            split={false}
                            dataSource={[
                              {
                                key: "foundationDate",
                                icon: <CalendarDays size={18} />,
                                label: "Foundation Date",
                                value: moment(house.foundationDate).format(
                                  "DD/MM/YYYY"
                                ),
                              },
                              {
                                key: "houseNumber",
                                icon: <HomeOutlined />,
                                label: "House Number",
                                value: house.houseNumber || "N/A",
                              },
                              {
                                key: "houseOwner",
                                icon: <UserOutlined />,
                                label: "House Owner",
                                value: house.houseOwner || "N/A",
                              },
                              {
                                key: "houseMember",
                                icon: <TeamOutlined />,
                                label: "House Member",
                                value: house.houseMember || "N/A",
                              },
                              {
                                key: "maintenanceStatus",
                                icon: <ToolOutlined />,
                                label: "Maintenance Status",
                                value: house.maintenanceStatus || "N/A",
                              },
                            ]}
                            renderItem={(item) => (
                              <List.Item key={item.key}>
                                <div className="flex items-center gap-4">
                                  {item.icon}
                                  <span className="font-medium">
                                    {item.label}:
                                  </span>
                                  <span>{item.value}</span>
                                </div>
                              </List.Item>
                            )}
                          />
                        </Card>
                      </motion.div>
                    </Col>
                    <Col span={12}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Card
                          title={
                            <span className="flex items-center gap-2">
                              <TeamOutlined className="text-green-500" />
                              Statistics
                            </span>
                          }
                        >
                          <Row gutter={[16, 16]}>
                            <Col span={12}>
                              <Statistic
                                title="Current Members"
                                value={house.currentMembers}
                                valueStyle={{ color: "#f97316" }}
                                prefix={<TeamOutlined />}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Average Age"
                                value={house.averageAge.toFixed(1)}
                                valueStyle={{ color: "#2563eb" }}
                                prefix={<UserOutlined />}
                                suffix="years"
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Male Children"
                                value={house.maleCount}
                                valueStyle={{ color: "#0ea5e9" }}
                                prefix={<TeamOutlined />}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Female Children"
                                value={house.femaleCount}
                                valueStyle={{ color: "#ec4899" }}
                                prefix={<TeamOutlined />}
                              />
                            </Col>
                            <Col span={24}>
                              <Statistic
                                title="Achievements"
                                value={house.achievementCount}
                                valueStyle={{ color: "#eab308" }}
                                prefix={<TrophyOutlined />}
                              />
                            </Col>
                          </Row>
                        </Card>
                      </motion.div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Card
                          title={
                            <span className="flex items-center gap-2">
                              <BoxPlotOutlined className="text-purple-500" />
                              Age Distribution
                            </span>
                          }
                        >
                          <Row gutter={16}>
                            {Object.entries(house.ageGroups)
                              .filter(([key]) => key !== "$id")
                              .map(([group, count]) => (
                                <Col span={6} key={group}>
                                  <Text>{group} years</Text>
                                  <Progress
                                    percent={(count / house.currentMembers) * 100}
                                    format={() => `${count}`}
                                  />
                                </Col>
                              ))}
                          </Row>
                        </Card>
                      </motion.div>
                    </Col>
                  </Row>
                </div>
              </AnimatePresence>
            ),
          },
          {
            key: "2",
            label: (
              <span className="flex items-center gap-3">
                <TeamOutlined />
                Children
              </span>
            ),
            children: (
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <TeamOutlined className="text-blue-500" />
                    Children in {house.houseName}
                  </span>
                }
              >
                <Table
                  columns={childrenColumns}
                  dataSource={
                    house?.children?.$values?.map((child) => ({
                      key: child.id,
                      ...child,
                    })) || []
                  }
                  pagination={{
                    pageSize: 5,
                    total: house?.children?.$values?.length || 0,
                    showSizeChanger: false,
                  }}
                  locale={{
                    emptyText: "No children available in this house",
                  }}
                  style={{ fontSize: "16px" }}
                  scroll={{ y: 300 }}
                />
              </Card>
            ),
          },
          {
            key: "3",
            label: (
              <span className="flex items-center gap-3">
                <ToolOutlined />
                Inventory
              </span>
            ),
            children: (
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <ToolOutlined className="text-blue-500" />
                    House Inventory
                  </span>
                }
              >
                <Table
                  columns={inventoryColumns}
                  dataSource={
                    house?.inventory?.$values?.map((inventory) => ({
                      key: inventory.id,
                      ...inventory,
                    })) || []
                  }
                  pagination={{
                    pageSize: 5,
                    total: house?.inventory?.$values?.length || 0,
                    showSizeChanger: false,
                  }}
                  locale={{
                    emptyText: "No inventory items available in this house",
                  }}
                  style={{ fontSize: "16px" }}
                  scroll={{ y: 300 }}
                />
              </Card>
            ),
          },
          {
            key: "4",
            label: (
              <span className="flex items-center gap-1">
                <PictureOutlined />
                Images
              </span>
            ),
            children: (
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <PictureOutlined className="text-blue-500" />
                    House Images
                  </span>
                }
              >
                {house.imageUrls && house.imageUrls.length > 0 ? (
                  <Row gutter={[16, 16]}>
                    {house.imageUrls.$values.map((imageUrl, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card
                          hoverable
                          cover={
                            <Image
                              alt={`House image ${index + 1}`}
                              src={imageUrl}
                              width={300}
                              height={200}
                              objectFit="cover"
                            />
                          }
                        >
                          <Card.Meta title={`Image ${index + 1}`} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No images available for this house
                  </div>
                )}
              </Card>
            ),
          },
        ]}
      />
    </Modal>
  );
};

ViewDetailsHouse.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  house: PropTypes.shape({
    id: PropTypes.string,
    houseName: PropTypes.string,
    houseNumber: PropTypes.number,
    location: PropTypes.string,
    description: PropTypes.string,
    houseOwner: PropTypes.string,
    houseMember: PropTypes.string,
    currentMembers: PropTypes.number,
    foundationDate: PropTypes.string,
    maintenanceStatus: PropTypes.string,

    children: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          childName: PropTypes.string,
          gender: PropTypes.string,
          dob: PropTypes.string,
          healthStatus: PropTypes.string,
        })
      ),
    }),

    inventory: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          itemName: PropTypes.string,
          quantity: PropTypes.number,
          purpose: PropTypes.string,
          maintenanceStatus: PropTypes.string,
          lastInspectionDate: PropTypes.string,
        })
      ),
    }),

    ageGroups: PropTypes.objectOf(PropTypes.number),
    averageAge: PropTypes.number,
    maleCount: PropTypes.number,
    femaleCount: PropTypes.number,
    achievementCount: PropTypes.number,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsHouse;
