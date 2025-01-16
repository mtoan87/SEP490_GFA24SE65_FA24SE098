import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Spin, Table } from 'antd';
import axios from 'axios';
import './ChildrenDetails.css';

const ChildrenDetails = () => {
    const { id: childId } = useParams();
    const navigate = useNavigate();
    const [childInfo, setChildInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('/default-placeholder.png');

    // Fetch child details from the API
    useEffect(() => {
        const fetchChildDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Children/GetChildWithImg?id=${childId}`);
                console.log('Child Details Response:', response.data);
                setChildInfo(response.data);
                setSelectedImage(response.data.imageUrls[0] || '/default-placeholder.png');
            } catch (error) {
                console.error('Error fetching child details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChildDetails();
    }, [childId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="child-detail-container">
            {loading ? (
                <div className="child-loading">
                    <Spin size="large" />
                </div>
            ) : childInfo ? (
                <>
                    <div className="child-content">
                        {/* Child Image Gallery Section */}
                        <div className="child-gallery">
                            <div className="main-image">
                                <img
                                    src={selectedImage}
                                    alt={childInfo.childName}
                                    className="gallery-main-image"
                                />
                            </div>
                            <div className="thumbnail-images">
                                {childInfo.imageUrls.map((url, index) => (
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

                        {/* Child Information Section */}
                        <div className="child-info">
                            <h1 className="child-name">{childInfo.childName || 'N/A'}</h1>
                            <p className="child-info-text">Health Status: {childInfo.healthStatus || 'N/A'}</p>
                            <p className="child-info-text">Gender: {childInfo.gender || 'N/A'}</p>
                            <p className="child-info-text">Date of Birth: {childInfo.dob ? formatDate(childInfo.dob) : 'N/A'}</p>
                            <p className="child-info-text">House Name: {childInfo.houseName || 'N/A'}</p>
                            <p className="child-info-text">School Name: {childInfo.schoolName || 'N/A'}</p>
                        </div>
                    </div>
                </>
            ) : (
                <p>Child not found</p>
            )}
        </div>
    );
};

export default ChildrenDetails;
