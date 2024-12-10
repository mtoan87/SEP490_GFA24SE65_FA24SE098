import { Modal, Button, Descriptions, Image, Space } from "antd";
import moment from "moment";
import PropTypes from "prop-types";

const ViewDetailsChildren = ({ isVisible, child, onClose }) => {
  if (!child) return null;

  return (
    <Modal
      title={<h2 className="text-xl font-bold">Child Details</h2>}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} type="primary">
          Close
        </Button>,
      ]}
      width={700}
    >
      <Descriptions bordered column={1} className="bg-white rounded-lg shadow">
        <Descriptions.Item label="Name" labelStyle={{ fontWeight: "bold" }}>
          {child.childName}
        </Descriptions.Item>
        <Descriptions.Item label="Gender" labelStyle={{ fontWeight: "bold" }}>
          {child.gender === "Male" ? "Male" : "Female"}
        </Descriptions.Item>
        <Descriptions.Item
          label="Date of Birth"
          labelStyle={{ fontWeight: "bold" }}
        >
          {child.dob ? moment(child.dob).format("DD/MM/YYYY") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item
          label="Health Status"
          labelStyle={{ fontWeight: "bold" }}
        >
          {child.healthStatus || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="House Id" labelStyle={{ fontWeight: "bold" }}>
          {child.id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Status" labelStyle={{ fontWeight: "bold" }}>
          {child.status || "N/A"}
        </Descriptions.Item>
        {child.imageUrls && child.imageUrls.length > 0 && (
          <Descriptions.Item label="Images" labelStyle={{ fontWeight: "bold" }}>
            <Space size="middle" wrap>
              {child.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  width={100}
                  src={url}
                  alt={`Child image ${index + 1}`}
                  className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                />
              ))}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

ViewDetailsChildren.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  child: PropTypes.shape({
    id: PropTypes.number,
    childName: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    healthStatus: PropTypes.string,
    houseId: PropTypes.string,
    status: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsChildren;

{
  /* <Modal
        title="Child Details"
        visible={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={[
          <Button key="close" onClick={closeDetailModal}>
            Close
          </Button>,
        ]}
      >
        {viewingChild && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {viewingChild.childName}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {viewingChild.gender === "Male" ? "Male" : "Female"}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {viewingChild.dob
                ? moment(viewingChild.dob).format("DD/MM/YYYY")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Health Status">
              {viewingChild.healthStatus || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="House">
              {viewingChild.houseName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {viewingChild.status || "N/A"}
            </Descriptions.Item>
            {viewingChild.imageUrls && viewingChild.imageUrls.length > 0 && (
              <Descriptions.Item label="Images">
                <Space>
                  {viewingChild.imageUrls.map((url, index) => (
                    <Image key={index} width={100} src={url} />
                  ))}
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal> */
}
