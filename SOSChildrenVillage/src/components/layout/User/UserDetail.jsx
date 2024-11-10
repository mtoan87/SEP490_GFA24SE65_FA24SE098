import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin, message, Row, Col, Image } from 'antd';
import axios from 'axios';

const UserDetail = () => {
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch user information
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
          `https://localhost:7073/api/UserAccount/GetUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUserInfo(response.data); // Set user info in state
        } else {
          message.error('No user information found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        message.error('Failed to fetch user details.');
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Display loading spinner while fetching user details
  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', paddingTop: '50px' }} />;
  }

  // If userInfo is available, display user details
  return (
    <div className="flex flex-col items-center p-5">
      <Row justify="center" className="w-full">
        <Col xs={24} sm={12} md={8}>
          <Card
            title="User Details"
            bordered={false}
            className="shadow-lg rounded-lg"
            style={{ maxWidth: '400px', margin: 'auto' }}
          >
            <p className="text-lg font-semibold"><strong>Name:</strong> {userInfo.userName || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Email:</strong> {userInfo.userEmail || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Phone:</strong> {userInfo.phone || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Address:</strong> {userInfo.address || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Date of Birth:</strong> {userInfo.dob || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Gender:</strong> {userInfo.gender || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Country:</strong> {userInfo.country || 'N/A'}</p>
            <p className="text-lg font-semibold"><strong>Status:</strong> {userInfo.status || 'N/A'}</p>

            {/* Display User Images */}
            {userInfo?.images?.$values?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">User Images:</h3>
                <Row gutter={[26, 26]}>
                  {userInfo.images.$values.map((image) => (
                    <Col key={image.id} xs={24} sm={12}>
                      <Image
                        width={500}
                        src={image.urlPath}
                        alt={`User image ${image.id}`}
                        style={{ borderRadius: '8px' }}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail;
