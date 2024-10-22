import React from 'react';
import { Button } from 'antd';

const HeroSection = () => {
    return (
        <section className="hero-section" style={{ backgroundColor: '#1890ff', padding: '100px 0', color: '#fff', textAlign: 'center' }}>
            <div className="container">
                <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>Mọi trẻ em đều cần một người mẹ yêu thương</h1>
                <Button type="primary" size="large" style={{ marginTop: '20px' }}>Đỡ đầu ngay</Button>
            </div>
        </section>
    );
};

export default HeroSection;
