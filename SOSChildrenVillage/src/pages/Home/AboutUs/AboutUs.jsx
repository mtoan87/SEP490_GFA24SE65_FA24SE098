//import { Button } from 'antd';
//import { CheckCircleFilled } from '@ant-design/icons';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="container">

        {/* About Us Header */}
         <div className="about-us-header">
          <h2 className="about-us-title">
            Giới thiệu
            <div className="title-underline"></div>
          </h2>
        </div>

        <div className="about-us-content">
          {/* Left Column - Image */}
          <div className="image-container">
            <img
              src="https://ktktlaocai.edu.vn/wp-content/uploads/2019/10/tre-em-vung-cao-kho-khan-1.jpg"
              alt="About us image"
              className="about-us-image"
            />
          </div>

          {/* Right Column - Content */}
          <div className="content-section">
            <h1 className="main-heading">
              Làng trẻ em SOS là nơi chăm sóc, nuôi dưỡng, hỗ trợ trẻ em mồ côi, trẻ em bị bỏ rơi và trẻ em có hoàn cảnh khó khăn.
            </h1>

            <p className="description">
              Làng trẻ em SOS là tổ ấm yêu thương dành cho trẻ em mồ côi, bị bỏ rơi, hoặc có hoàn cảnh khó khăn, nơi các em được chăm sóc, nuôi dưỡng và hỗ trợ để phát triển toàn diện, vượt qua nghịch cảnh và xây dựng tương lai tươi sáng.
            </p>

            {/* Features Grid */}
            {/* <div className="features-grid">
              <div className="features-column">
                <div className="feature-item">
                  <CheckCircleFilled className="icon-blue" />
                  <span>Sport Activities</span>
                </div>
                <div className="feature-item">
                  <CheckCircleFilled className="icon-pink" />
                  <span>Outdoor Games</span>
                </div>
                <div className="feature-item">
                  <CheckCircleFilled className="icon-blue" />
                  <span>Nutritious Foods</span>
                </div>
              </div>
              <div className="features-column">
                <div className="feature-item">
                  <CheckCircleFilled className="icon-blue" />
                  <span>Highly Secured</span>
                </div>
                <div className="feature-item">
                  <CheckCircleFilled className="icon-pink" />
                  <span>Friendly Environment</span>
                </div>
                <div className="feature-item">
                  <CheckCircleFilled className="icon-blue" />
                  <span>Qualified Teacher</span>
                </div>
              </div>
            </div> */}

            {/* More Details Button */}
            {/* <Button 
              type="primary"
              size="large"
              className="more-details-button"
            >
              More Details
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
