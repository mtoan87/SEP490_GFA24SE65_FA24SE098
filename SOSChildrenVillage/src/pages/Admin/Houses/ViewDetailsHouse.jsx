import { Modal, Button, Typography, Divider } from "antd";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const ViewDetailsHouse = ({ isVisible, house, onClose }) => {
  if (!house) return null;

  return (
    <Modal
      title={<Title level={3}>House Details</Title>}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} type="primary">
          Close
        </Button>,
      ]}
      width={700}
    >
      <div className="space-y-4">
        <div>
          <Text strong>House ID:</Text>
          <Text className="ml-2">{house.houseId}</Text>
        </div>
        <div>
          <Text strong>House Name:</Text>
          <Text className="ml-2">{house.houseName}</Text>
        </div>
        <div>
          <Text strong>House Number:</Text>
          <Text className="ml-2">{house.houseNumber}</Text>
        </div>
        <div>
          <Text strong>Location:</Text>
          <Text className="ml-2">{house.location}</Text>
        </div>
        <div>
          <Text strong>Description:</Text>
          <Text className="ml-2">{house.description}</Text>
        </div>
        <div>
          <Text strong>House Members:</Text>
          <Text className="ml-2">{house.houseMember}</Text>
        </div>
        <div>
          <Text strong>House Owner:</Text>
          <Text className="ml-2">{house.houseOwner}</Text>
        </div>
        <div>
          <Text strong>User Account ID:</Text>
          <Text className="ml-2">{house.userAccountId}</Text>
        </div>
        <div>
          <Text strong>Village ID:</Text>
          <Text className="ml-2">{house.villageId}</Text>
        </div>
        <div>
          <Text strong>Status:</Text>
          <Text className="ml-2">{house.status}</Text>
        </div>

        <Divider />

        {house.imageUrls && house.imageUrls.length > 0 && (
          <div>
            <Title level={4}>Images</Title>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {house.imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`House Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg transition-all duration-300 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      type="primary"
                      onClick={() => window.open(url, "_blank")}
                    >
                      View Full
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

ViewDetailsHouse.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  house: PropTypes.shape({
    houseId: PropTypes.number,
    houseName: PropTypes.string,
    houseNumber: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    houseMember: PropTypes.string,
    houseOwner: PropTypes.string,
    userAccountId: PropTypes.number,
    villageId: PropTypes.number,
    status: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsHouse;

{
  /* <Modal
        title="House Details"
        visible={isViewModalVisible}
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal}>
            Close
          </Button>,
        ]}
      >
        {viewingHouse && (
          <div>
            <p>
              <strong>House Name:</strong> {viewingHouse.houseName}
            </p>
            <p>
              <strong>House Number:</strong> {viewingHouse.houseNumber}
            </p>
            <p>
              <strong>Location:</strong> {viewingHouse.location}
            </p>
            <p>
              <strong>Description:</strong> {viewingHouse.description}
            </p>
            <p>
              <strong>Owner:</strong> {viewingHouse.houseOwner}
            </p>
            {viewingHouse.imageUrls?.length > 0 && (
              <div>
                <strong>Images:</strong>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  {viewingHouse.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`House Image ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal> */
}
