import React from 'react';
import { Row, Col, Button } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{ backgroundColor: '#f0f2f5', padding: '15px 0' }}>
            <Row justify="space-between" align="middle" style={{ maxWidth: '1800px', margin: '0 auto' }}>
                <Col>
                    <a href="#"><FacebookOutlined style={{ fontSize: '20px', marginRight: '10px' }} /></a>
                    <a href="#"><InstagramOutlined style={{ fontSize: '20px', marginRight: '10px' }} /></a>
                    <a href="#"><TwitterOutlined style={{ fontSize: '20px' }} /></a>
                </Col>
                <Col>
                <Link to="/login">
                        <Button type="primary" style={{ marginRight: '10px' }}>
                            Đăng nhập
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button type="default">
                            Đăng ký
                        </Button>
                    </Link>
                </Col>
            </Row>
        </header>
    );
};

export default Header;
