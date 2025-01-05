import { useState } from "react";
import {
  Modal,
  Tabs,
  Card,
  Button,
  Statistic,
  Tag,
  List,
  Table,
  Typography,
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  HeartOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { MapPin, CalendarDays, Phone, Mail } from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "./Style/ViewDetailsVillage.css";

const { Title } = Typography;

const VillageDetailsModal = ({ isVisible, village, onClose }) => {
  const [activeTab, setActiveTab] = useState("1");

  if (!village) return null;

  const columns = [
    {
      title: "House Name",
      dataIndex: "houseName",
      key: "houseName",
      align: "center",
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: "House Owner",
      dataIndex: "houseOwner",
      key: "houseOwner",
      align: "center",
      render: (text) => text || "N/A",
    },
    {
      title: "Children",
      dataIndex: "totalChildren",
      key: "totalChildren",
      align: "center",
      render: (count) => (
        <span style={{ color: count > 0 ? "#52c41a" : "#999" }}>
          {count || 0}
        </span>
      ),
    },
  ];

  // Animation variants
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
              {village.villageName}
            </Title>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={18} />
            {village.location}
          </div>
        </div>
      }
      className="village-details-modal"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "1",
            label: (
              <span className="flex items-center gap-3">
                <TeamOutlined />
                Overview
              </span>
            ),
            children: (
              <AnimatePresence>
                <div
                  className="flex gap-4 mb-6"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    marginBottom: "24px",
                    marginTop: "24px",
                    gap: "10px",
                  }}
                >
                  <motion.div
                    style={{ flex: 1 }}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      title={
                        <span className="flex items-center gap-4">
                          <TeamOutlined className="text-blue-500" />
                          Basic Information
                        </span>
                      }
                    >
                      <List
                        className="text-base"
                        split={false}
                        dataSource={[
                          {
                            key: "established",
                            icon: <CalendarDays size={18} />,
                            label: "Established",
                            value: moment(village.establishedDate).format(
                              "DD/MM/YYYY"
                            ),
                          },
                          {
                            key: "email",
                            icon: <Mail size={18} />,
                            label: "Email",
                            value: village.email || "N/A",
                          },
                          {
                            key: "contactNumber",
                            icon: <Phone size={18} />,
                            label: "Contact Number",
                            value: village.contactNumber || "N/A",
                          },
                          {
                            key: "status",
                            label: "Status",
                            value: <Tag color="success">Active</Tag>,
                          },
                        ]}
                        renderItem={(item) => (
                          <List.Item key={item.key}>
                            <div className="flex items-center gap-4">
                              {item.icon}
                              <span className="font-medium">{item.label}:</span>
                              <span>{item.value}</span>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </motion.div>

                  <motion.div
                    style={{ flex: 1 }}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card
                      title={
                        <span className="flex items-center gap-2">
                          <HeartOutlined className="text-green-500" />
                          Statistics
                        </span>
                      }
                    >
                      <div
                        className="grid grid-cols-2 gap-4"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "stretch",
                        }}
                      >
                        <Statistic
                          title="Total Children"
                          value={village.totalChildren}
                          valueStyle={{ color: "#f97316" }}
                          prefix={<TeamOutlined />}
                        />
                        <Statistic
                          title="SOS Mothers"
                          value={village.totalHouseOwners}
                          valueStyle={{ color: "#2563eb" }}
                          prefix={<HeartOutlined />}
                        />
                        <Statistic
                          title="Total Houses"
                          value={village.totalHouses}
                          valueStyle={{ color: "#16a34a" }}
                          prefix={<HomeOutlined />}
                        />
                        <Statistic
                          title="Matured Children"
                          value={village.totalMatureChildren}
                          valueStyle={{ color: "#9333ea" }}
                          prefix={<TeamOutlined />}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {village.description && (
                  <motion.div
                    className="col-span-2"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card
                      title={
                        <span className="flex items-center gap-4">
                          <HeartOutlined className="text-red-500" />
                          Description
                        </span>
                      }
                    >
                      <p className="text-gray-600">{village.description}</p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            ),
          },
          {
            key: "2",
            label: (
              <span className="flex items-center gap-3">
                <HomeOutlined />
                Houses
              </span>
            ),
            children: (
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <HomeOutlined className="text-blue-500" />
                    List of Houses {village.villageName}
                  </span>
                }
              >
                <Table
                  columns={columns}
                  dataSource={
                    village?.houses?.$values?.map((house, index) => ({
                      key: house.id || `house-${index}`,
                      ...house,
                    })) || []
                  }
                  pagination={{
                    pageSize: 5,
                    total: village?.houses?.$values?.length || 0,
                    showSizeChanger: false,
                  }}
                  locale={{
                    emptyText: "Không có thông tin về nhà trong làng này",
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
              <span className="flex items-center gap-1">
                <PictureOutlined />
                Hình ảnh
              </span>
            ),
            children: (
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <PictureOutlined className="text-blue-500" />
                    Hình ảnh hoạt động
                  </span>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {/* Placeholder for future image gallery */}
                  <div className="text-center text-gray-500 py-8">
                    Chức năng gallery hình ảnh sẽ được cập nhật sau
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />
    </Modal>
  );
};

VillageDetailsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  village: PropTypes.shape({
    id: PropTypes.string,
    villageName: PropTypes.string,
    location: PropTypes.string,
    establishedDate: PropTypes.string,
    description: PropTypes.string,
    contactNumber: PropTypes.string,
    email: PropTypes.string,
    totalHouses: PropTypes.number,
    totalChildren: PropTypes.number,
    totalHouseOwners: PropTypes.number,
    totalMatureChildren: PropTypes.number,
    houses: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          houseName: PropTypes.string,
          houseOwner: PropTypes.string,
          totalChildren: PropTypes.number,
        })
      ),
    }),
  }),
  onClose: PropTypes.func.isRequired,
};

export default VillageDetailsModal;
