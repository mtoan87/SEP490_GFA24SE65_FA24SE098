import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { Table, Space, Button, Input, message } from "antd";
import { CheckOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Flag to prevent multiple messages
  const isWarningShown = useRef(false);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId !== "1") {
      if (!isWarningShown.current) {
        message.warning("You do not have permission to access this page.");
        isWarningShown.current = true; // Set flag to true after showing the message
      }
      navigate("/home");
      return;
    }

    // Fetch bookings if user has correct role
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Booking/GetAllBookingsWithSlotsInformation"
      );
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      message.error("Unable to fetch booking data.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/Booking/ConfirmBooking?id=${id}`
      );
      message.success("Booking confirmed successfully.");
      fetchBookings();
    } catch (error) {
      console.error(error);
      message.error("Unable to confirm booking. Please try again.");
    }
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "House ID",
      dataIndex: "houseId",
      key: "houseId",
      align: "center",
    },
    {
      title: "House Name",
      dataIndex: "houseName",
      key: "houseName",
      align: "center",
    },
    {
      title: "Visit Day",
      dataIndex: "visitday",
      key: "visitday",
      align: "center",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Slot Time",
      key: "slotTime",
      align: "center",
      render: (_, record) => `${record.slotStartTime} - ${record.slotEndTime}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleConfirm(record.id)}
            icon={<CheckOutlined />}
            type="primary"
          >
            Confirm
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Search for bookings"
          prefix={<SearchOutlined />}
          style={{ width: 500 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: bookings.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default BookingManagement;
