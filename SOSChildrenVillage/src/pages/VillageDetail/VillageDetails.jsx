import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Table, Button, Modal, Spin, Image } from 'antd';
import axios from 'axios';
import './VillageDetails.css';

const VillageDetails = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [villageInfo, setVillageInfo] = useState(null);
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null); // State for house modal
  const [loadingHouseDetails, setLoadingHouseDetails] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false); // State for description modal
  const [selectedImage, setSelectedImage] = useState('/default-placeholder.png');

  useEffect(() => {
    const fetchVillageInfo = async () => {
      try {
        const response = await axios.get(`https://localhost:7073/api/Village/GetVillageByEventId?eventId=${eventId}`);
        console.log('Village Info Response:', response.data);
        const villageData = response.data[0];
        setVillageInfo({
          villageName: villageData.villageName,
          totalHouses: villageData.totalHouses,
          description: villageData.description,
          totalChildren: villageData.totalChildren,
          location: villageData.location,
          imageUrls: villageData.imageUrls || [],
          villageId: villageData.id, // Include villageId for dynamic house fetching
        });
        setSelectedImage(villageData.imageUrls[0] || '/default-placeholder.png');
      } catch (error) {
        console.error('Error fetching village info:', error);
      }
    };

    fetchVillageInfo();
  }, [eventId]);

  useEffect(() => {
    const fetchHousesInfo = async (villageId) => {
      if (!villageId) {
        console.error('Village ID is missing.');
        return;
      }
      try {
        const response = await axios.get(`https://localhost:7073/api/Houses/GetHouseByVillageId/${villageId}`);
        console.log('Houses Info Response:', response.data);
        setHouses(response.data);
      } catch (error) {
        console.error('Error fetching houses info:', error);
      }
    };

    if (villageInfo?.villageId) {
      fetchHousesInfo(villageInfo.villageId);
    }
  }, [villageInfo]);

  const fetchHouseDetails = async (houseId) => {
    setLoadingHouseDetails(true);
    try {
      const response = await axios.get(`https://localhost:7073/api/Houses/GetHouseByIdWithImg/${houseId}`);
      console.log('House Details Response:', response.data);
      setSelectedHouse(response.data);
    } catch (error) {
      console.error('Error fetching house details:', error);
    } finally {
      setLoadingHouseDetails(false);
    }
  };

  return (
    <div className="village-detail-container">
      {villageInfo ? (
        <>
          {/* Village Content Layout */}
          <div className="village-content">
            {/* Image Gallery */}
            <div className="village-gallery">
              <div className="main-image">
                <img
                  src={selectedImage}
                  alt="Main Village"
                  className="gallery-main-image"
                />
              </div>
              <div className="thumbnail-images">
                {villageInfo.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`gallery-thumbnail ${selectedImage === url ? 'selected' : ''
                      }`}
                    onClick={() => setSelectedImage(url)}
                  />
                ))}
              </div>
            </div>

            {/* Village Information */}
            <div className="village-info">
              <h1 className="village-name">{villageInfo.villageName || 'N/A'}</h1>
              <p className="village-location">Location: {villageInfo.location || 'N/A'}</p>
              <p className="village-description">Description: {villageInfo.description.length > 100
                ? `${villageInfo.description.slice(0, 100)}... `
                : villageInfo.description || 'No description available'}
                {villageInfo.description.length > 100 && (
                  <Button type="link" onClick={() => setShowFullDescription(true)}>
                    Read More
                  </Button>
                )}
              </p>
              <p className="village-location">Total Houses: {villageInfo.totalHouses || 'N/A'}</p>
              <p className="village-location">Total Children: {villageInfo.totalChildren || 'N/A'}</p>
            </div>
          </div>

          {/* Houses Table */}
          <h2 style={{ marginTop: '20px' }}>Houses in {villageInfo.villageName}</h2>
          <Table
            dataSource={houses}
            columns={[
              { title: 'House Name', dataIndex: 'houseName' },
              { title: 'House Number', dataIndex: 'houseNumber' },
              { title: 'Members', dataIndex: 'houseMember' },
              { title: 'Owner', dataIndex: 'houseOwner' },
              {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                  <Button
                    type="link"
                    onClick={() => {
                      window.open(`/housedetail/${record.id}`, '_blank');  // Open in a new tab
                    }}
                  >
                    View
                  </Button>
                ),
              },
            ]}
            rowKey="id"
            pagination={false}
          />

        </>
      ) : (
        <p>Loading village details...</p>
      )}

      {/* House Details Modal */}
      <Modal
        visible={!!selectedHouse}
        title={`House Details - ${selectedHouse?.houseName}`}
        onCancel={() => setSelectedHouse(null)}
        footer={null}
      >
        {loadingHouseDetails ? (
          <Spin />
        ) : (
          selectedHouse && (
            <>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="House Name">{selectedHouse.houseName}</Descriptions.Item>
                <Descriptions.Item label="House Number">{selectedHouse.houseNumber}</Descriptions.Item>
                <Descriptions.Item label="Location">{selectedHouse.location}</Descriptions.Item>
                <Descriptions.Item label="Description">{selectedHouse.description}</Descriptions.Item>
                <Descriptions.Item label="Total Members">{selectedHouse.houseMember}</Descriptions.Item>
                <Descriptions.Item label="Current Members">{selectedHouse.currentMembers}</Descriptions.Item>
                <Descriptions.Item label="Owner">{selectedHouse.houseOwner}</Descriptions.Item>
              </Descriptions>
              <div className="house-images" style={{ marginTop: '20px' }}>
                {selectedHouse.imageUrls.length > 0 ? (
                  selectedHouse.imageUrls.map((url, index) => (
                    <Image key={index} src={url} alt={`House Image ${index + 1}`} style={{ marginRight: '10px' }} />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </>
          )
        )}
      </Modal>

      {/* Description Modal */}
      <Modal
        visible={showFullDescription}
        title="Village Description"
        onCancel={() => setShowFullDescription(false)}
        footer={null}
      >
        <p>{villageInfo?.description}</p>
      </Modal>
    </div>
  );
};

export default VillageDetails;
