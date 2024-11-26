import React from 'react';
import { Button, message } from 'antd'; // Added message here
import { HomeOutlined, InfoCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './HeroSection.css'; // Import CSS file if needed

const HeroSection = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    console.log('Donate button clicked'); // Check if this is called
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/donate');
    } else {
      message.warning('Please log in before donating.');
      navigate('/login');
    }
  };

  return (
    <div>
      {/* First Section */}
      <section className="bg-gray-100 py-16">
        <div className="container2 mx-auto flex flex-wrap items-center justify-center">
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <h1
              style={{ fontSize: '48px' }}
              className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6 text-center md:text-left"
            >
              Every Child Deserves a Loving Family
            </h1>
            <p
              style={{ fontSize: '20px' }}
              className="text-gray-600 text-center md:text-left mb-8"
            >
              Help children and build a brighter future for them
            </p>
            <div className="text-center md:text-left">
              {/* Using Link to navigate to /donate */}
              <Button style={{width: "200px"}}
                type="primary"
                onClick={handleDonateClick}
                icon={<HeartOutlined />}
                className="bg-blue-500 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
              >
                Donate Now
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <img
              src="https://baovinhlong.com.vn/file/e7837c027f6ecd14017ffa4e5f2a0e34/dataimages/201612/original/images1782825_image001.jpg"
              alt="Smiling child"
              className="rounded-full w-3/4 mx-auto md:mx-0"
            />
            <div
              className="absolute top-0 right-0 w-1/2 h-full bg-blue-500"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            ></div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      {/* <section className="bg-white py-16">
        <div className="container2 mx-auto flex justify-around items-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-500">20M</h2>
            <p className="text-gray-600">Supporters</p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-500">15K+</h2>
            <p className="text-gray-600">Volunteers Worldwide</p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-500">68K+</h2>
            <p className="text-gray-600">Funds Raised</p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HeroSection;
