import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  // Handle button click to navigate to the donate page
  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: "url('https://ktktlaocai.edu.vn/wp-content/uploads/2019/10/tre-em-vung-cao-kho-khan-1.jpg')", // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 0',
        height: '300px',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center', // Horizontally centers the content
        alignItems: 'center', // Vertically centers the content
        flexDirection: 'column', // Stack content vertically
      }}
    >
      {/* Overlay to darken background for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%', // Make the overlay cover the entire section
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>Every child needs a loving mother</h1>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: '20px' }}
          onClick={handleDonateClick}
        >
          Donate Now
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
