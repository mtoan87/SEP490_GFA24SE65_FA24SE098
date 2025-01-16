import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin, message, Row, Col, Image, Button } from 'antd';
import axios from 'axios';

const UserDetail = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      message.error('User not logged in. Redirecting to login...');
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUserInfo(response.data);
        } else {
          message.error('No user information found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        message.error('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  // Format Date of Birth to "DD Month YYYY"
  const formatDateOfBirth = (dob) => {
    if (!dob) return 'N/A';
    const date = new Date(dob);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', paddingTop: '50px' }} />;
  }

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '10vh' }}>
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            title="User Profile"
            bordered={false}
            style={{
              maxWidth: '500px',
              margin: 'auto',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              textAlign: 'center',
            }}
            styles={{
              header: {
                fontSize: '1.5rem',
                color: '#1f1f1f',
                background: '#f5f5f5',
                borderRadius: '10px 10px 0 0',
              },
            }}
          >
            {(userInfo?.images?.$values || userInfo?.images || []).length > 0 ? (
              <Row gutter={[16, 16]} justify="center">
                {(userInfo.images.$values || userInfo.images).map((image) => (
                  <Col key={image.id} style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Image
                      width={100}
                      height={100}
                      src={image.urlPath || 'https://via.placeholder.com/100'}
                      alt={`User image ${image.id}`}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ddd',
                      }}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <Image
                  width={100}
                  height={100}
                  src="https://via.placeholder.com/100"
                  alt="Default user image"
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ddd',
                  }}
                />
              </div>
            )}


            <div style={{ marginTop: '20px', textAlign: 'Center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                {capitalizeFirstLetter(userInfo.userName) || 'N/A'}
              </p>
              <p style={{ color: '#888', fontSize: '1rem' }}>{userInfo.userEmail || 'N/A'}</p>
            </div>

            {/* User Info */}
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <p><strong>Phone:</strong> {userInfo.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {userInfo.address || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {formatDateOfBirth(userInfo.dob)}</p>
              <p><strong>Gender:</strong> {userInfo.gender || 'N/A'}</p>
              <p><strong>Country:</strong> {userInfo.country || 'N/A'}</p>
              <p><strong>Status:</strong> {userInfo.status || 'N/A'}</p>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button
                type="primary"
                onClick={() => navigate(`/edituserprofile`)}
              >
                Edit Profile
              </Button>
              <Button
                type="default"
                onClick={() => navigate(`/changepassword`)}
              >
                Change Password
              </Button>
            </div>


          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail;
