import { Modal, Button, Descriptions, Image, Spin } from 'antd';
import PropTypes from 'prop-types';

const ViewDetailsVillage = ({ isVisible, village, onClose }) => {
  if (!village) return null;

  return (
    <Modal
      title="Village Details"
      visible={isVisible}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      onCancel={onClose}
    >
      {village ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">{village.villageName}</Descriptions.Item>
          <Descriptions.Item label="Location">{village.location}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {village.description || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{village.status}</Descriptions.Item>
          <Descriptions.Item label="Created By">
            {village.createdBy || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Images">
            {village.imageUrls?.length > 0
              ? village.imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    style={{ margin: "5px", maxHeight: "100px" }}
                  />
                ))
              : "No images available"}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Spin tip="Loading details..." />
      )}
    </Modal>
  );
};

ViewDetailsVillage.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  village: PropTypes.shape({
    villageName: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    createdBy: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsVillage;



{/* <Modal
        title="Village Details"
        visible={isDetailModalVisible}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {detailVillage ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {detailVillage.villageName}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {detailVillage.location}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {detailVillage.description || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {detailVillage.status}
            </Descriptions.Item>
            <Descriptions.Item label="Created By">
              {detailVillage.createdBy || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Images">
              {detailVillage.imageUrls?.length > 0
                ? detailVillage.imageUrls.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      alt={`Image ${index + 1}`}
                      style={{ margin: "5px", maxHeight: "100px" }}
                    />
                  ))
                : "No images available"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Spin tip="Loading details..." />
        )}
      </Modal> */}