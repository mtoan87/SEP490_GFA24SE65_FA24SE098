import React from 'react';
import { Menu, Button, Row, Col, message } from 'antd';
import { HomeOutlined, InfoCircleOutlined, HeartOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';
import logo from '../../../assets/images/logo3.png';

const Nav = () => {
    const navigate = useNavigate();

    const handleDonateClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/donate');
        } else {
            message.warning('Please log in before donating.');
            navigate('/login');
        }
    };

    return (
        <nav className="nav-container">
            <Row justify="space-between" align="middle" className="nav-row">
                {/* Logo Section */}
                <Col className="logo-container">
                    <img
                        src={logo}
                        alt="Logo"
                        className="nav-logo"
                        onClick={() => navigate('/home')}
                    />
                </Col>

                {/* Menu Section */}
                <Col className="menu-container">
                    <Menu mode="horizontal" className="nav-menu">
                        <Menu.Item key="home" icon={<HomeOutlined />}>
                            <Link to="/home" className="nav-link">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="about" icon={<InfoCircleOutlined />}>
                            <Link to="/about" className="nav-link">About Us</Link>
                        </Menu.Item>
                        {/* Thêm mục Help */}
                        <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
                            <Link to="/help" className="nav-link">Help</Link>
                        </Menu.Item>
                    </Menu>
                </Col>

                {/* Donate Section */}
                <Col className="donate-container">
                    <Button
                        type="primary"
                        onClick={handleDonateClick}
                        icon={<HeartOutlined />}
                        className="donate-button"
                    >
                        Donate Now
                    </Button>
                </Col>
            </Row>
        </nav>
    );
};

export default Nav;
