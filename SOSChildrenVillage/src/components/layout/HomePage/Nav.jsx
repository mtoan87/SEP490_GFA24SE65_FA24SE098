import React from 'react';
import { Menu, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Nav = () => {
    return (
        <nav className="nav">
            <Row justify="space-between" align="middle">
                {/* Logo */}
                <Col>
                    <img src="https://placehold.co/150x50" alt="SOS Children's Village Vietnam Logo" className="logo" />
                </Col>
                
                {/* Navigation Links */}
                <Col>
                    <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                        <Menu.Item key="home">
                            <Link to="/home">Trang chủ</Link> {/* Link to /home */}
                        </Menu.Item>
                        <Menu.Item key="about">
                            <Link to="/about">Giới thiệu</Link> {/* Link to /about */}
                        </Menu.Item>
                        <Menu.Item key="help">
                            <Link to="/help">Giúp đỡ</Link> {/* Link to /help */}
                        </Menu.Item>
                        <Menu.Item key="info">
                            <Link to="/info">Thông tin</Link> {/* Link to /info */}
                        </Menu.Item>
                    </Menu>
                </Col>

                {/* Search Icon and Donate Button */}
                <Col>
                    <Row align="middle">
                        <Button type="link" icon={<SearchOutlined />} />
                        <Button type="primary">Tài trợ ngay</Button>
                    </Row>
                </Col>
            </Row>
        </nav>
    );
};

export default Nav;
