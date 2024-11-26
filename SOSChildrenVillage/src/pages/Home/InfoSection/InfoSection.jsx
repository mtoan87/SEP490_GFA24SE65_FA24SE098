import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Button, Row } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './InfoSection.css';

const InfoSection = () => {
  const [events, setEvents] = useState([]);
  const [children, setChildren] = useState([]);
  const [visibleEventStart, setVisibleEventStart] = useState(0);
  const [visibleChildStart, setVisibleChildStart] = useState(0);
  const visibleCount = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://soschildrenvillage.azurewebsites.net/api/Event');
        if (Array.isArray(response.data)) {
          const updatedEvents = response.data
            .map((event) => ({
              ...event,
              imageUrl: event.imageUrls?.[0] || '',
            }))
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)); // Sort by createdDate descending
          setEvents(updatedEvents);
        } else {
          console.error('Data is not an array');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchChildren = async () => {
      try {
        const response = await axios.get('https://soschildrenvillage.azurewebsites.net/api/Children/GetAllChildWithHealthStatusBad');
        if (Array.isArray(response.data)) {
          const updatedChildren = response.data
            .map((child) => ({
              ...child,
              imageUrl: child.imageUrls?.[0] || '',
            }))
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)); // Sort by createdDate descending
          setChildren(updatedChildren);
        } else {
          console.error('Data is not an array');
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    };

    fetchEvents();
    fetchChildren();
  }, []);

  const handleNext = (setVisibleStart, currentStart, totalLength) => {
    if (currentStart + visibleCount < totalLength) {
      setVisibleStart(currentStart + 1);
    }
  };

  const handlePrev = (setVisibleStart, currentStart) => {
    if (currentStart > 0) {
      setVisibleStart(currentStart - 1);
    }
  };

  const renderCard = (data, isEvent) => {
    const currentAmount = data.currentAmount || 0; // Default value is 0 if no currentAmount
    const amountLimit = data.amountLimit || 0; // Default value is 0 if no amountLimit
    const donationProgress = (currentAmount / amountLimit) * 100 || 0; // Calculate percentage

    return (
      <Col key={data.id} style={{ flex: '0 0 280px', maxWidth: '280px' }}>
        <Link to={isEvent ? `/eventdetail/${data.id}` : `/childdetail/${data.id}`}>
          <Card
            hoverable
            cover={
              <img
                alt={data.name || data.childName}
                src={data.imageUrls?.[0] || '/placeholder.jpg'}
                className="custom-card-image"
              />
            }
            bordered={false}
            className="custom-card"
          >
            <h2 className="custom-title">{data.name || data.childName}</h2>
            {isEvent && (
              <div className="donation-progress-container2">
                <div className="donation-progress-bar2">
                  <div
                    className="donation-progress-fill2"
                    style={{
                      width: `${donationProgress}%`,
                      backgroundColor: donationProgress === 100 ? '#28a745' : '#1677ff',
                    }}
                  />
                </div>
                <p>{Math.round(donationProgress)}% of goal reached</p>
              </div>
            )}
            {!isEvent && data.healthStatus && (
              <p className="health-status">
                <strong>Health Status: </strong>
                {data.healthStatus}
              </p>
            )}
          </Card>
        </Link>
      </Col>
    );
  };

  return (
    <div>
      <section className="section-background">
        <p
          style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            marginLeft: '20px',
          }}
        >
          Ongoing Events
        </p>
        <div className="scroll-container">
          <Button
            className="scroll-button left"
            onClick={() => handlePrev(setVisibleEventStart, visibleEventStart)}
            icon={<LeftOutlined />}
            disabled={visibleEventStart === 0}
          />
          <div className="scrollable-cards">
            <Row gutter={16} className="card-row">
              {events
                .slice(visibleEventStart, visibleEventStart + visibleCount)
                .map((event) => renderCard(event, true))}
            </Row>
          </div>
          <Button
            className="scroll-button right"
            onClick={() => handleNext(setVisibleEventStart, visibleEventStart, events.length)}
            icon={<RightOutlined />}
            disabled={visibleEventStart + visibleCount >= events.length}
          />
        </div>

        <p
          style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            marginLeft: '20px',
          }}
        >
          Children in Need of Support
        </p>
        <div className="scroll-container">
          <Button
            className="scroll-button left"
            onClick={() => handlePrev(setVisibleChildStart, visibleChildStart)}
            icon={<LeftOutlined />}
            disabled={visibleChildStart === 0}
          />
          <div className="scrollable-cards">
            <Row gutter={16} className="card-row">
              {children
                .slice(visibleChildStart, visibleChildStart + visibleCount)
                .map((child) => renderCard(child, false))}
            </Row>
          </div>
          <Button
            className="scroll-button right"
            onClick={() => handleNext(setVisibleChildStart, visibleChildStart, children.length)}
            icon={<RightOutlined />}
            disabled={visibleChildStart + visibleCount >= children.length}
          />
        </div>
      </section>
    </div>
  );
};

export default InfoSection;
