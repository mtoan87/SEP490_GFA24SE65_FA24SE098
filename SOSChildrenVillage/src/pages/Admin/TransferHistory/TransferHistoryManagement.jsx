import { useEffect, useState, useCallback, useRef } from "react";
import { Table, Input, message, Tooltip, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getTransferHistory } from "../../../services/api";

const TransferHistoryManagement = () => {
  const [transferHistories, setTransferHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const userRole = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");

  const fetchTransferHistories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransferHistory();
      let requests = data?.$values || [];

      // Filter requests based on user role
      if (userRole === "3") {
        // HouseMother
        requests = requests.filter(
          (request) => String(request.createdBy) === userId
        );
      }

      setTransferHistories(requests);
    } catch (error) {
      console.error("Error fetching transfer requests:", error);
      message.error("Failed to load transfer requests");
      setTransferHistories([]);
    } finally {
      setLoading(false);
    }
  }, [userRole, userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !["1", "3", "6"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/admin");
        messageShown.current = true;
      }
    } else {
      fetchTransferHistories();
    }
  }, [navigate, redirecting, userRole, fetchTransferHistories]);

  const showModal = (record) => {
    setSelectedHistory(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "History ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Child ID",
      dataIndex: "childId",
      key: "childId",
      align: "center",
    },
    {
      title: "From House",
      dataIndex: "fromHouseId",
      key: "fromHouseId",
      align: "center",
    },
    {
      title: "To House",
      dataIndex: "toHouseId",
      key: "toHouseId",
      align: "center",
    },
    {
      title: "Transfer Date",
      dataIndex: "transferDate",
      key: "transferDate",
      align: "center",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const statusColors = {
          Completed: "green",
          Rejected: "red",
        };
        return <span style={{ color: statusColors[status] }}>{status}</span>;
      },
    },
    {
      title: "Notes",
      key: "notesReason",
      align: "center",
      render: (_, record) => {
        if (record.status === "Completed") {
          return (
            <Tooltip placement="topLeft" title={record.notes}>
              <span>{record.notes}</span>
            </Tooltip>
          );
        }
        if (record.status === "Rejected") {
          return (
            <Tooltip placement="topLeft" title={record.rejectionReason}>
              <span>{record.rejectionReason}</span>
            </Tooltip>
          );
        }
        return null;
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Handled By",
      dataIndex: "handledBy",
      key: "handledBy",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a onClick={() => showModal(record)}>View Details</a>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Input
          placeholder="Search for transfer history"
          prefix={<SearchOutlined />}
          style={{ width: 500, marginRight: 8 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={transferHistories}
        loading={loading}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: transferHistories.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title="Transfer History Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedHistory && (
          <div>
            <p>
              <strong>History ID:</strong> {selectedHistory.id}
            </p>
            <p>
              <strong>Child ID:</strong> {selectedHistory.childId}
            </p>
            <p>
              <strong>From House:</strong> {selectedHistory.fromHouseId}
            </p>
            <p>
              <strong>To House:</strong> {selectedHistory.toHouseId}
            </p>
            <p>
              <strong>Transfer Date:</strong>{" "}
              {moment(selectedHistory.transferDate).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    selectedHistory.status === "Completed" ? "green" : "red",
                }}
              >
                {selectedHistory.status}
              </span>
            </p>
            <p>
              <strong>Notes/Reason:</strong>{" "}
              {selectedHistory.status === "Completed"
                ? selectedHistory.notes
                : selectedHistory.rejectionReason}
            </p>
            <p>
              <strong>Handled By:</strong> {selectedHistory.handledBy}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransferHistoryManagement;
