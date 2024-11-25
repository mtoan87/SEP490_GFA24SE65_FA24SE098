import { useRef } from 'react';
import { Menu, Button, Row, Col, message } from 'antd';
import { HomeOutlined, InfoCircleOutlined, QuestionCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
    const navigate = useNavigate();
    const footerRef = useRef(null);

    const handleDonateClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/donate');
        } else {
            message.warning('Please log in before donating.');
            navigate('/login');
        }
    };

    const handleAboutClick = (e) => {
        e.preventDefault();
        if (footerRef.current) {
            footerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="nav-container">
            <Row justify="space-between" align="middle" className="nav-row">
                <Col className="logo-container">
                    <img src="/src/assets/images/logo3-zJq9mO6I.png" alt="Logo" className="nav-logo" />
                </Col>
                
                <Col className="menu-container">
                    <Menu mode="horizontal" className="nav-menu">
                        <Menu.Item key="home" icon={<HomeOutlined />}>
                            <Link to="/home" className="nav-link">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="about" icon={<InfoCircleOutlined />}>
                            <a href="#" onClick={handleAboutClick} className="nav-link">About</a>
                        </Menu.Item>
                        <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
                            <Link to="/help" className="nav-link">Help</Link>
                        </Menu.Item>
                    </Menu>
                </Col>

                <Col className="donate-container">
                    <Button 
                        type="primary" 
                        onClick={handleDonateClick}
                        icon={<HeartOutlined />}
                        className="donate-button"
                    >
                        Tài trợ ngay
                    </Button>
                </Col>
            </Row>
        </nav>
    );
};

export default Nav;

/* import { useRef } from 'react';
import { Menu, Button, Row, Col, message } from 'antd';
//import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';

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
                    <img src="/src/assets/images/logo3.png" alt="Logo" className="logo logo-shift" />
                </Col>
                
                <Col>
                    <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                        <Menu.Item key="home" style={{ lineHeight: '64px', fontWeight: 'bold' }}>
                            <Link to="/home">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="about" style={{ lineHeight: '64px', fontWeight: 'bold' }}>
                            <a href="#" onClick={handleAboutClick}>About</a>
                        </Menu.Item>
                        <Menu.Item key="help" style={{ lineHeight: '64px', fontWeight: 'bold' }}>
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

export default Nav; */
