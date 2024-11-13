import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import './MyComponent.css';

const MyComponent = () => {
  const [events, setEvents] = useState([]);
  const [visibleStart, setVisibleStart] = useState(0);
  const visibleCount = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://localhost:7073/api/Event');
        if (Array.isArray(response.data)) {
          const updatedEvents = response.data.map((event) => {
            const imageUrl = event.imageUrls?.[0] || '';
            return {
              ...event,
              imageUrl: imageUrl,
            };
          });
          setEvents(updatedEvents);
        } else {
          console.error('Dữ liệu không phải là mảng');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleNext = () => {
    if (visibleStart + visibleCount < events.length) {
      setVisibleStart(visibleStart + 1);
    }
  };

  const handlePrev = () => {
    if (visibleStart > 0) {
      setVisibleStart(visibleStart - 1);
    }
  };

  return (
    <div className="scroll-container">
      <Button
        className="scroll-button left"
        onClick={handlePrev}
        icon={<LeftOutlined />}
        disabled={visibleStart === 0}
      />
      <div className="scrollable-cards">
        <div className="card-row">
          {Array.isArray(events) &&
            events.length > 0 &&
            events.slice(visibleStart, visibleStart + visibleCount).map((event) => (
              <Col key={event.id} style={{ flex: '0 0 280px', maxWidth: '280px' }}>
                {/* Chỉnh sửa Link để truyền id vào URL */}
                <Link to={`/eventdetail/${event.id}`}>
                  <Card
                    hoverable
                    cover={<img alt={event.name} src={event.imageUrl} className="custom-card-image" />}
                    bordered={false}
                    className="custom-card"
                  >
                    <h2 style={{ margin: '5px' }} className="custom-title">
                      {event.name}
                    </h2>
                  </Card>
                </Link>

              </Col>
            ))}
        </div>
      </div>
      <Button
        className="scroll-button right"
        onClick={handleNext}
        icon={<RightOutlined />}
        disabled={visibleStart + visibleCount >= events.length}
      />
    </div>
  );
};

export default MyComponent;
