import { Modal, Button, Typography, Table, Row, Col } from "antd";
import { MapPin, Home, Users, CalendarDays, Phone, Mail } from "lucide-react";
import PropTypes from "prop-types";
import moment from "moment";

const { Title } = Typography;

const ViewDetailsVillage = ({
  isVisible,
  village,
  onClose,
  //onViewHouseDetails,
}) => {
  console.log("Village data:", village);
  console.log("Houses data:", village?.houses);
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
    // {
    //   title: "Actions",
    //   key: "actions",
    //   align: "center",
    //   render: (_, record) => (
    //     <Button
    //       type="link"
    //       onClick={() => onViewHouseDetails(record)}
    //       className="px-0"
    //     >
    //       View Details
    //     </Button>
    //   ),
    // },
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
              {village.villageName}
            </Title>
          </div>
          <div style={{ ...infoItemStyle, fontSize: "14px", color: "#666" }}>
            <MapPin size={18} />
            {village.location}
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
                Established:{" "}
                {village.establishedDate
                  ? moment(village.establishedDate).format("DD/MM/YYYY")
                  : "N/A"}
              </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Mail size={18} />
              <span>{village.email || "N/A"}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Phone size={18} />
              <span>{village.contactNumber || "N/A"}</span>
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Home size={18} />
              <span>Total Houses: {village.totalHouses || 0}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...infoItemStyle, color: "#000" }}>
              <Users size={18} />
              <span>Total Children: {village.totalChildren || 0}</span>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <Title level={4} style={{ marginBottom: "16px", fontSize: "20px" }}>
          Houses in {village.villageName}
        </Title>
        <Table
          columns={columns}
          dataSource={village?.houses?.$values?.map((house) => ({
            key: house.id,
            ...house,
          })) || []}
          rowKey="id"
          pagination={{
            pageSize: 5,
            total: village?.houses?.$values?.length || 0,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: "No houses available in this village",
          }}
          style={{ fontSize: "16px" }}
          scroll={{ y: 300 }}
        />
      </div>
    </Modal>
  );
};

ViewDetailsVillage.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  village: PropTypes.shape({
    id: PropTypes.string,
    villageName: PropTypes.string,
    location: PropTypes.string,
    totalHouses: PropTypes.number,
    totalChildren: PropTypes.number,
    establishedDate: PropTypes.string,
    email: PropTypes.string,
    contactNumber: PropTypes.string,
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
  onViewHouseDetails: PropTypes.func,
};

export default ViewDetailsVillage;
