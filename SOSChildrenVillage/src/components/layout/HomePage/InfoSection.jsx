import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './MyComponent.css';

const MyComponent = () => {
  const [events, setEvents] = useState([]);  // Sử dụng mảng rỗng làm giá trị mặc định
  const [visibleStart, setVisibleStart] = useState(0);
  const visibleCount = 6;

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://localhost:7073/api/Event'); // API của bạn trả về mảng
        if (Array.isArray(response.data)) {  // Kiểm tra dữ liệu trả về là mảng
          // Map dữ liệu sự kiện, lấy imageUrl từ imageUrls và thêm vào event
          const updatedEvents = response.data.map(event => {
            // Lấy đường dẫn hình ảnh đầu tiên trong array imageUrls
            const imageUrl = event.imageUrls?.[0] || ''; // Default nếu không có hình ảnh
            return {
              ...event,
              imageUrl: imageUrl
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
          {Array.isArray(events) && events.length > 0 && events.slice(visibleStart, visibleStart + visibleCount).map((event) => (
            <Col key={event.id} style={{ flex: '0 0 280px', maxWidth: '280px' }}>
              <Card
                hoverable
                cover={<img alt={event.name} src={event.imageUrl} className="custom-card-image" />}
                bordered={false}
                className="custom-card"
              >
                <h2 className="custom-title">{event.name}</h2>
                <p className="custom-description">{event.description}</p>
                <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(event.endTime).toLocaleString()}</p>
                <p><strong>Amount:</strong> {event.amount}</p>
                <p><strong>Amount Limit:</strong> {event.amountLimit ? event.amountLimit : 'Not set'}</p> {/* Thêm amountLimit */}
                <p><strong>Status:</strong> {event.status}</p>
              </Card>
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
