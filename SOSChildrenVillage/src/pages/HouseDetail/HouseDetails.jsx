import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Table, Button, Modal, Spin, Image } from 'antd';
import axios from 'axios';
import './HouseDetails.css';

const HouseDetails = () => {
    const { id: houseId } = useParams();
    const navigate = useNavigate();
    const [houseInfo, setHouseInfo] = useState(null);
    const [children, setChildren] = useState([]);
    const [loadingHouseDetails, setLoadingHouseDetails] = useState(false);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedImage, setSelectedImage] = useState('/default-placeholder.png');

    // Fetch house details and children data
    useEffect(() => {
        const fetchHouseDetails = async () => {
            setLoadingHouseDetails(true);
            try {
                const houseResponse = await axios.get(`https://localhost:7073/api/Houses/GetHouseByIdWithImg/${houseId}`);
                console.log('House Details Response:', houseResponse.data);
                setHouseInfo(houseResponse.data);
                setSelectedImage(houseResponse.data.imageUrls[0] || '/default-placeholder.png');

                setLoadingChildren(true);
                const childrenResponse = await axios.get(`https://localhost:7073/api/Children/GetChildByHouseIdArray/${houseId}`);
                console.log('Children Response:', childrenResponse.data);
                setChildren(Array.isArray(childrenResponse.data) ? childrenResponse.data : []);
            } catch (error) {
                console.error('Error fetching house details or children:', error);
            } finally {
                setLoadingHouseDetails(false);
                setLoadingChildren(false);
            }
        };

        fetchHouseDetails();
    }, [houseId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="house-detail-container">
            {loadingHouseDetails ? (
                <div className="house-loading">
                    <Spin size="large" />
                </div>
            ) : houseInfo ? (
                <>
                    <div className="house-content">
                        {/* House Gallery Section */}
                        <div className="house-gallery">
                            <div className="main-image">
                                <img
                                    src={selectedImage}
                                    alt={houseInfo.houseName}
                                    className="gallery-main-image"
                                />
                            </div>
                            <div className="thumbnail-images">
                                {houseInfo.imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`gallery-thumbnail ${selectedImage === url ? 'selected' : ''}`}
                                        onClick={() => setSelectedImage(url)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* House Information Section */}
                        <div className="house-info">
                            <h1 className="house-name">{houseInfo.houseName || 'N/A'}</h1>
                            <p className="house-location">Location: {houseInfo.location || 'N/A'}</p>
                            <p className="house-description">
                                Description: {houseInfo.description.length > 100
                                    ? `${houseInfo.description.slice(0, 100)}... `
                                    : houseInfo.description || 'No description available'}
                                {houseInfo.description.length > 100 && (
                                    <Button type="link" onClick={() => setShowFullDescription(true)}>
                                        Read More
                                    </Button>
                                )}
                            </p>
                            <p className="house-location">House Number: {houseInfo.houseNumber || 'N/A'}</p>
                            <p className="house-location">Total Members: {houseInfo.houseMember || 'N/A'}</p>
                            <p className="house-location">Owner: {houseInfo.houseOwner || 'N/A'}</p>
                        </div>
                    </div>
                    {/* Children Table Section */}
                    <h2 style={{ marginTop: '20px' }}>Children in {houseInfo.houseName}</h2>
                    {loadingChildren ? (
                        <Spin />
                    ) : (
                        <Table
                            dataSource={children}
                            columns={[
                                { title: 'Child Name', dataIndex: 'childName' },
                                { title: 'Health Status', dataIndex: 'healthStatus' },
                                { title: 'Gender', dataIndex: 'gender' },
                                {
                                    title: 'Dob',
                                    dataIndex: 'dob',
                                    render: (dob) => formatDate(dob),
                                },
                                {
                                    title: 'Child Image',
                                    key: 'childImage',
                                    render: (_, record) => (
                                        <img
                                            src={record.imageUrls[0] || '/default-placeholder.png'}
                                            alt={record.childName}
                                            style={{ width: 100, height: 'auto', borderRadius: '5px' }}
                                        />
                                    ),
                                },
                            ]}
                            rowKey="id"
                            pagination={{
                                pageSize: 5, // Set the number of items per page to 5
                                defaultCurrent: 1, // Start on the first page
                            }}
                        />

                    )}
                </>
            ) : (
                <p>House not found</p>
            )}

            {/* Description Modal */}
            <Modal
                visible={showFullDescription}
                title="House Description"
                onCancel={() => setShowFullDescription(false)}
                footer={null}
            >
                <p>{houseInfo?.description}</p>
            </Modal>
        </div>
    );
};

export default HouseDetails;
