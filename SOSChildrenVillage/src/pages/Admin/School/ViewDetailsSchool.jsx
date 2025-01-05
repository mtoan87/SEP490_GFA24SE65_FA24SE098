import { Modal, Card, Table, Button, Typography, List } from "antd";
import PropTypes from "prop-types";
import { TeamOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SchoolDetailsModal = ({ isVisible, school, onClose }) => {
  if (!school) return null;

  const columnsChildren = [
    {
      title: "Child Name",
      dataIndex: "childName",
      key: "childName",
      align: "center",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
      align: "center",
      render: (text) => text || "Unknown",
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      align: "center",
      render: (text) => text || "Unknown",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      align: "center",
      render: (text) => text || "Unknown",
    },
  ];

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={
        <Button type="primary" onClick={onClose} block>
          Close
        </Button>
      }
      width={800}
      title={
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {school.schoolName}
          </Title>
          <div style={{ fontSize: "14px", color: "#999" }}>
            {school.address}
          </div>
        </div>
      }
    >
      <Card title="School Information" bordered={false}>
        <List
          dataSource={[
            {
              label: "School Type",
              value: school.schoolType,
            },
            {
              label: "Phone Number",
              value: school.phoneNumber || "N/A",
              icon: <PhoneOutlined />,
            },
            {
              label: "Email",
              value: school.email || "N/A",
              icon: <MailOutlined />,
            },
            {
              label: "Current Students",
              value: school.currentStudents,
              icon: <TeamOutlined />,
            },
          ]}
          renderItem={(item) => (
            <List.Item key={item.label}>
              <div className="flex items-center gap-2">
                {item.icon}
                <span style={{ fontWeight: 600 }}>{item.label}:</span>
                <span>{item.value}</span>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Children Details" style={{ marginTop: 16 }}>
        <Table
          columns={columnsChildren}
          dataSource={school.children.$values.map((child, index) => ({
            key: child.id || `child-${index}`,
            childName: child.childName,
            academicYear: child.academicYear,
            semester: child.semester,
            class: child.class,
          }))}
          pagination={{ pageSize: 5 }}
          locale={{
            emptyText: "No children data available",
          }}
        />
      </Card>
    </Modal>
  );
};

SchoolDetailsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  school: PropTypes.shape({
    id: PropTypes.string.isRequired,
    schoolName: PropTypes.string.isRequired,
    address: PropTypes.string,
    schoolType: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    currentStudents: PropTypes.number,
    children: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          childName: PropTypes.string,
          academicYear: PropTypes.string,
          semester: PropTypes.string,
          class: PropTypes.string,
        })
      ),
    }),
  }),
  onClose: PropTypes.func.isRequired,
};

export default SchoolDetailsModal;
