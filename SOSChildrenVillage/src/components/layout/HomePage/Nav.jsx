import React from 'react';
import { Menu, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
                        <Menu.Item key="home">Trang chủ</Menu.Item>
                        <Menu.Item key="about">Giới thiệu</Menu.Item>
                        <Menu.Item key="help">Giúp đỡ</Menu.Item>
                        <Menu.Item key="info">Thông tin</Menu.Item>
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
