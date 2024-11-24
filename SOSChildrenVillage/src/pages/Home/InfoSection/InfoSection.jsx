import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './InfoSection.css';

const MyComponent = () => {
  const [events, setEvents] = useState([]);
  const [children, setChildren] = useState([]);
  const [visibleEventStart, setVisibleEventStart] = useState(0);
  const [visibleChildStart, setVisibleChildStart] = useState(0);
  const visibleCount = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://localhost:7073/api/Event');
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
        const response = await axios.get('https://localhost:7073/api/Children/GetAllChildWithImg');
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

  const renderCard = (data, isEvent) => (
    <Col key={data.id} style={{ flex: '0 0 280px', maxWidth: '280px' }}>
      <Link to={isEvent ? `/eventdetail/${data.id}` : `/childdetail/${data.id}`}>
        <Card
          hoverable
          cover={
            <img
              alt={data.name || data.childName}
              src={data.imageUrl || '/placeholder.jpg'} // Thêm ảnh mặc định nếu không có URL
              className="custom-card-image"
            />
          }
          bordered={false}
          className="custom-card"
        >
          <h2 className="custom-title">{data.name || data.childName}</h2>
          <p className="card-description">
            {data.healthStatus ? `Health Status: ${data.healthStatus}` : ''}
          </p>
        </Card>

      </Link>
    </Col>
  );

  return (
    <div>
      <p style={{ fontSize: '40px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
        Các sự kiện đang diễn ra
      </p>

      <div className="scroll-container">
        <Button
          className="scroll-button left"
          onClick={() => handlePrev(setVisibleEventStart, visibleEventStart)}
          icon={<LeftOutlined />}
          disabled={visibleEventStart === 0}
        />
        <div className="scrollable-cards">
          <div className="card-row">
            {Array.isArray(events) &&
              events
                .slice(visibleEventStart, visibleEventStart + visibleCount)
                .map((event) => renderCard(event, true))}
          </div>
        </div>
        <Button
          className="scroll-button right"
          onClick={() => handleNext(setVisibleEventStart, visibleEventStart, events.length)}
          icon={<RightOutlined />}
          disabled={visibleEventStart + visibleCount >= events.length}
        />
      </div>

      <p style={{ fontSize: '40px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
        Trẻ em cần hỗ trợ
      </p>

      <div className="scroll-container">
        <Button
          className="scroll-button left"
          onClick={() => handlePrev(setVisibleChildStart, visibleChildStart)}
          icon={<LeftOutlined />}
          disabled={visibleChildStart === 0}
        />
        <div className="scrollable-cards">
          <div className="card-row">
            {Array.isArray(children) &&
              children
                .slice(visibleChildStart, visibleChildStart + visibleCount)
                .map((child) => renderCard(child, false))}
          </div>
        </div>
        <Button
          className="scroll-button right"
          onClick={() => handleNext(setVisibleChildStart, visibleChildStart, children.length)}
          icon={<RightOutlined />}
          disabled={visibleChildStart + visibleCount >= children.length}
        />
      </div>
    </div>
  );
};

export default MyComponent;
