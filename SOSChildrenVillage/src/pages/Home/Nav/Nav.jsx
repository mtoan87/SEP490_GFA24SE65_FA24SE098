import React from 'react';
import { Menu, Button, Row, Col, message } from 'antd';
import { HomeOutlined, InfoCircleOutlined, HeartOutlined, HistoryOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll'; // Import from react-scroll
import './Nav.css';
import logo from '../../../assets/images/logo3.png';

const Nav = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy location để kiểm tra đường dẫn hiện tại

    const handleDonateClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/donate');
        } else {
            message.warning('Please log in before donating.');
            navigate('/login');
        }
    };

    // Hàm xử lý click vào "About Us"
    const handleAboutUsClick = () => {
        // Nếu đang ở trang khác, chuyển về trang Home và cuộn đến phần About Us
        if (location.pathname !== '/home') {
            navigate('/home', { state: { scrollToAbout: true } }); // Truyền state để biết cần cuộn đến phần nào
        } else {
            // Nếu đang ở trang Home, trực tiếp cuộn xuống phần About Us
            scrollToAboutSection();
        }
    };

    // Hàm cuộn đến phần About Us
    const scrollToAboutSection = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            window.scrollTo({
                top: aboutSection.offsetTop - 70, // Điều chỉnh khoảng cách để không bị che bởi header
                behavior: 'smooth',
            });
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
                        <Menu.Item key="history" icon={<HistoryOutlined />}>
                            <Link to="/history" className="nav-link">History</Link>
                        </Menu.Item>
                        <Menu.Item key="about" icon={<InfoCircleOutlined />} onClick={handleAboutUsClick}>
                            About Us
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
