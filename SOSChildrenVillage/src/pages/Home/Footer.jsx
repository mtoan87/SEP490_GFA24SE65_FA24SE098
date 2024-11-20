import React, { forwardRef } from 'react';
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

export default Footer;
