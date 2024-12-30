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
  const [selectedHouse, setSelectedHouse] = useState(null); // State for modal
  const [loadingHouseDetails, setLoadingHouseDetails] = useState(false);

  useEffect(() => {
    const fetchVillageInfo = async () => {
      try {
        const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Village/GetVillageByEventId?eventId=${eventId}`);
        console.log('Village Info Response:', response.data);
        const villageData = response.data[0];
        setVillageInfo({
          villageName: villageData.villageName,
          totalHouses: villageData.totalHouses,
          totalChildren: villageData.totalChildren,
          location: villageData.location,
          imageUrls: villageData.imageUrls || [],
          villageId: villageData.id, // Include villageId for dynamic house fetching
        });
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
        const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByVillageId/${villageId}`);
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
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByIdWithImg/${houseId}`);
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
          <div className="village-layout">
            {/* Village Images */}
            <div className="village-images">
              {villageInfo.imageUrls.length > 0 ? (
                villageInfo.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Village Image ${index + 1}`} className="village-image" />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
  
            {/* Village Information */}
            <div className="village-info">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Village Name">{villageInfo.villageName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Location">{villageInfo.location || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Total Houses">{villageInfo.totalHouses || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Total Children">{villageInfo.totalChildren || 'N/A'}</Descriptions.Item>
              </Descriptions>
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
                  <Button type="link" onClick={() => fetchHouseDetails(record.id)}>
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
    </div>
  );  
};

export default VillageDetails;
