import { useEffect, useState } from "react";
import { Row, Col, Button, Popover, Avatar, Typography, Spin } from "antd";
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const { Text } = Typography;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userRoleId, setUserRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsLoggedIn(true);
      fetchUserInfo(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();

      setUserName(data.userName || "Guest");
      const imageUrl = data.images?.$values?.[0]?.urlPath;
      setUserImage(imageUrl || "");
      setUserRoleId(data.roleId || null);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const userInfoContent = loading ? (
    <Spin />
  ) : (
    <div className="user-popover">
      <Avatar
        size={80}
        src={userImage || undefined}
        icon={!userImage ? <UserOutlined /> : undefined}
        className="user-avatar"
      />
      <Text strong className="user-name">
        {userName}
      </Text>
      {userRoleId === 1 ? (
        <div className="admin-links">
          <Link to="/userDetail">
            <Button type="link">View Profile</Button>
          </Link>
          <Link to="/admin">
            <Button type="link">Dashboard</Button>
          </Link>
        </div>
      ) : (
        <div className="user-menu">
          <Link to="/userDetail">
            <Button type="link">View Profile</Button>
          </Link>
          <Link to="/donateHistory">
            <Button type="link">Donate History</Button>
          </Link>
          <Link to="/villageHistory">
            <Button type="link">Village History</Button>
          </Link>
          <Link to="/bookingHistory">
            <Button type="link">Booking History</Button>
          </Link>
        </div>
      )}
      <Button
      style={{width:"100px"}}
        type="primary"
        danger
        onClick={handleLogout}
        className="logout-btn"
      >
        Logout
      </Button>
    </div>
  );

  return (
    <header className="w-full">
      <div className="bg-white py-2 border-b border-gray-200">
        <div className="container3 mx-auto">
          <Row justify="end" align="middle">
            <Col>
              {isLoggedIn ? (
                <Popover
                  content={userInfoContent}
                  title="User Info"
                  trigger="click"
                  placement="bottomRight"
                  overlayClassName="user-popover-overlay"
                >
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    className="flex items-center hover:text-blue-600"
                  >
                    {userName}
                  </Button>
                </Popover>
              ) : (
                <Row gutter={16} className="text-center">
                  <Col span={12}>
                    <Link to="/login">
                      <Button type="primary">Login</Button>
                    </Link>
                  </Col>
                  <Col span={12}>
                    <Link to="/register">
                      <Button>Register</Button>
                    </Link>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};

export default Header;
