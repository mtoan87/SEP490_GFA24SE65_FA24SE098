import { Modal, Button, Typography, Table, Row, Col } from "antd";
import { MapPin, CalendarDays, Home, Users, User, Hammer } from "lucide-react";
import PropTypes from "prop-types";
import moment from "moment";

const { Title } = Typography;

const ViewDetailsHouse = ({ isVisible, house, onClose }) => {
  console.log("House data:", house);
  console.log("Children data:", house?.children);

  if (!house) return null;

  // Columns for Children Table
  const columns = [
    {
      title: "Child Id",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
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

  const infoItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    marginBottom: "16px",
  };

  return (
    <Modal
      title={
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <Title level={3} style={{ margin: 0, fontSize: "28px" }}>
              {house.houseName}
            </Title>
          </div>
          <div style={{ ...infoItemStyle, fontSize: "14px", color: "#666" }}>
            <MapPin size={18} />
            {house.location}
          </div>
        </div>
      }
      open={isVisible}
      width={800}
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
      onCancel={onClose}
    >
      <div style={{ marginBottom: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <CalendarDays size={18} />
              <span>
                Foundation Date:{" "}
                {house.foundationDate
                  ? moment(house.foundationDate).format("DD/MM/YYYY")
                  : "N/A"}
              </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Home size={18} />
              <span>House Number: {house.houseNumber || "N/A"}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <User size={18} />
              <span>House Owner: {house.houseOwner || "N/A"}</span>
            </div>
          </Col>      
        </Row>
        <Row gutter={[24, 24]}>
        <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Users size={18} />
              <span>Current Members: {house.currentMembers || 0}</span>
            </div>
          </Col>  
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Hammer size={18} />
              <span>Maintenance Status: {house.maintenanceStatus || "N/A"}</span>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <Title level={4} style={{ marginBottom: "16px", fontSize: "20px" }}>
          Children in {house.houseName}
        </Title>
        <Table
          columns={columns}
          dataSource={
            house?.children?.$values?.map((child) => ({
              key: child.id,
              ...child,
            })) || []
          }
          rowKey="id"
          pagination={{
            pageSize: 5,
            total: house?.children?.$values?.length || 0,
            showSizeChanger: false
          }}
          locale={{
            emptyText: "No children available in this house",
          }}
          style={{ fontSize: "16px" }}
          scroll={{ y: 300 }}
        />
      </div>
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
    houseOwner: PropTypes.string,
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
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsHouse;