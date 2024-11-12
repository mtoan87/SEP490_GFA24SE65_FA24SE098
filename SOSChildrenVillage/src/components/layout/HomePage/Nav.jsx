import React, { useRef } from 'react';
import { Menu, Button, Row, Col, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();
    const footerRef = useRef(null); // Create a ref for the footer

    // Handle click event for "Donate Now"
    const handleDonateClick = () => {
        const token = localStorage.getItem('token');  // Check if the user is logged in

        if (token) {
            navigate('/donate');  // Navigate to /donate if logged in
        } else {
            message.warning('Please log in before donating.');
            navigate('/login');  // Navigate to /login if not logged in
        }
    };

    // Scroll to footer when "About" is clicked
    const handleAboutClick = (e) => {
        e.preventDefault();  // Prevent default anchor link behavior
        if (footerRef.current) {
            footerRef.current.scrollIntoView({ behavior: 'smooth' });  // Scroll smoothly to footer
        }
    };

    return (
        <nav className="nav">
            <Row justify="space-between" align="middle">
                <Col>
                    <img src="/src/assets/images/logo3.png" alt="Logo" className="logo" />
                </Col>
                
                <Col>
                    <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                        <Menu.Item key="home" style={{ lineHeight: '64px', fontWeight: 'bold' }}> {/* Adjust line height to raise the text */}
                            <Link to="/home">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="about" style={{ lineHeight: '64px', fontWeight: 'bold' }}> {/* Adjust line height to raise the text */}
                            <a href="#" onClick={handleAboutClick}>About</a>
                        </Menu.Item>
                        <Menu.Item key="help" style={{ lineHeight: '64px', fontWeight: 'bold' }}> {/* Adjust line height to raise the text */}
                            <Link to="/help">Help</Link>
                        </Menu.Item>
                    </Menu>
                </Col>

                <Col>
                    <Row align="middle">
                        <Button type="primary" onClick={handleDonateClick}>Donate Now</Button>
                    </Row>
                </Col>
            </Row>
        </nav>
    );
};

export default Nav;
