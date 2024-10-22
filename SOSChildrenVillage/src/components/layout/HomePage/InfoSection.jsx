import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const InfoSection = () => {
    return (
        <section className="info-section" style={{ padding: '50px 0', textAlign: 'center', backgroundColor: '#fff' }}>
            <div className="container">
                <Paragraph style={{ fontSize: '18px', color: '#595959' }}>
                    Làng trẻ em SOS là nơi chăm sóc, nuôi dưỡng, hỗ trợ trẻ em mồ côi, trẻ em bị bỏ rơi và trẻ em có hoàn cảnh khó khăn.
                </Paragraph>
            </div>
        </section>
    );
};

export default InfoSection;
