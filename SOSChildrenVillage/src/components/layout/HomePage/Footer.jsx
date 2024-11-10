import React from 'react';
import { Row, Col, Divider } from 'antd';


const Footer = () => {
  return (
    <div style={{ padding: '32px', backgroundColor: '#1890ff', color: '#ffffff' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>THÔNG TIN LIÊN LẠC</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p style={{ fontWeight: 'bold' }}>Văn phòng quốc gia</p>
          <p>Ngõ 1 Phạm Văn Đồng, P.Mai Dịch, Q.Cầu Giấy, Hà Nội</p>
          <p>Tel: +84.24.37644019</p>
          <p>Email: office@sosvietnam.org</p>
          <p style={{ fontWeight: 'bold', marginTop: '16px' }}>VP Truyền thông & Phát triển nhà tài trợ</p>
          <p>45 Phạm Ngọc Thạch, P. Võ Thị Sáu, Q.3, HCM</p>
          <p>Tel: +84.28.38227227/ 66822068</p>
          <p>Email: phatttrienquy@sosvietnam.org</p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>LIÊN KẾT</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p><a href="#" style={{ color: '#ffffff' }}>Tải liệu</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Tuyển dụng</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Làng trẻ em SOS Quốc tế</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Privacy Policy</a></p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>MEDIA</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p><a href="#" style={{ color: '#ffffff' }}>Thông cáo báo chí</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Facebook</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Youtube</a></p>
          <p><a href="#" style={{ color: '#ffffff' }}>Instagram</a></p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>THÔNG TIN MINH BẠCH</h2>
          <Divider style={{ borderColor: '#ffffff' }} />
          <p><a href="#" style={{ color: '#ffffff' }}>Báo cáo tài chính và hoạt động hàng năm</a></p>
        </Col>
      </Row>
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p>Mái ấm yêu thương cho mọi trẻ em</p>
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid #ffffff', paddingTop: '16px' }}>
        <a href="#" style={{ color: '#ffffff', margin: '0 8px' }}>Tuyển dụng</a>
        <a href="#" style={{ color: '#ffffff', margin: '0 8px' }}>Tin tức</a>
        <span style={{ margin: '0 8px' }}>Hotline: 0989 73 77 33</span>
      </div>
    </div>
  );
};

export default Footer;
