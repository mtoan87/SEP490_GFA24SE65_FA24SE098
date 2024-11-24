import { forwardRef } from 'react';
import { Row, Col, Divider } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  InstagramOutlined
} from '@ant-design/icons';

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <h2 className="text-xl font-bold mb-4">CONTACT INFORMATION</h2>
            <Divider className="my-4 border-white/30" />
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">National Office</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <EnvironmentOutlined /> 1 Pham Van Dong, Mai Dich, Cau Giay, Hanoi
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneOutlined /> +84.24.37644019
                  </p>
                  <p className="flex items-center gap-2">
                    <MailOutlined /> office@sosvietnam.org
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Media & Sponsor Office</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <EnvironmentOutlined /> 45 Pham Ngoc Thach, District 3, HCM
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneOutlined /> +84.28.38227227
                  </p>
                  <p className="flex items-center gap-2" >
                    <MailOutlined /> phatttrienquy@sosvietnam.org
                  </p>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h2 className="text-xl font-bold mb-4">LINKS</h2>
            <Divider className="my-4 border-white/30" />
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  Download Materials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  SOS Children Villages International
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h2 className="text-xl font-bold mb-4">MEDIA</h2>
            <Divider className="my-4 border-white/30" />
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  <FacebookOutlined /> Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  <YoutubeOutlined /> Youtube
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  <InstagramOutlined /> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-300 flex items-center gap-2">
                  Press Releases
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h2 className="text-xl font-bold mb-4">TRANSPARENCY</h2>
            <Divider className="my-4 border-white/30" />
            <a href="#" className="hover:text-blue-200 transition-colors duration-300">
              Annual Financial and Activity Reports
            </a>
          </Col>
        </Row>

        <div className="mt-12 text-center">
          <p className="text-2xl font-bold italic mb-8">A loving home for every child</p>
          <Divider className="border-white/30" />
          <div className="flex justify-center items-center flex-wrap gap-6 pt-4">
            <a href="#" className="hover:text-blue-200 transition-colors duration-300">Careers</a>
            <a href="#" className="hover:text-blue-200 transition-colors duration-300">News</a>
            <span className="flex items-center gap-2" >
              <PhoneOutlined /> Hotline: 0989 73 77 33
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer'; 

export default Footer;

/* import React, { forwardRef } from 'react';
import { Row, Col, Divider } from 'antd';

const Footer = forwardRef((props, ref) => {
  return (
    <div ref={ref} style={{ padding: '32px', backgroundColor: '#1890ff', color: '#ffffff' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>CONTACT INFORMATION</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p style={{ fontWeight: 'bold' }}>National Office</p>
          <p>1 Pham Van Dong, Mai Dich, Cau Giay, Hanoi</p>
          <p>Tel: +84.24.37644019</p>
          <p>Email: office@sosvietnam.org</p>
          <p style={{ fontWeight: 'bold', marginTop: '16px' }}>Media & Sponsor Development Office</p>
          <p>45 Pham Ngoc Thach, Vo Thi Sau, District 3, HCM</p>
          <p>Tel: +84.28.38227227/ 66822068</p>
          <p>Email: phatttrienquy@sosvietnam.org</p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>LINKS</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p><a href="#" style={{ color: '#ffffff' }}>Download Materials</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Careers</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>SOS Children’s Villages International</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Privacy Policy</a></p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>MEDIA</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p><a href="#" style={{ color: '#ffffff' }}>Press Releases</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Facebook</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Youtube</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Instagram</a></p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>TRANSPARENCY</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p><a href="#" style={{ color: '#ffffff' }}>Annual Financial and Activity Reports</a></p>
        </Col>
      </Row>
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p>A loving home for every child</p>
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid #ffffff', paddingTop: '16px' }}>
        <a href="#" style={{ color: '#ffffff', margin: '0 8px' }}>Careers</a>
        <a href="#" style={{ color: '#ffffff', margin: '0 8px' }}>News</a>
        <span style={{ margin: '0 8px' }}>Hotline: 0989 73 77 33</span>
      </div>
    </div>
  );
});

export default Footer; */
