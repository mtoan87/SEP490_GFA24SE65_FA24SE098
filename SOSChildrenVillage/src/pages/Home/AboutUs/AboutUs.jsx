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
            About Us
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
              SOS Children’s Village is a place that cares for, nurtures, and supports orphaned children, abandoned children, and children in difficult circumstances.
            </h1>

            <p className="description">
              SOS Children’s Village is a loving home for orphaned, abandoned, or disadvantaged children, where they are cared for, nurtured, and supported to fully develop, overcome adversity, and build a bright future.
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
