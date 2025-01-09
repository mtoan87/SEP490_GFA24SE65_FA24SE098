import { useEffect, useState, useCallback, useRef } from "react";
import { Table, Input, message, Tooltip } from "antd";
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
        navigate("/home");
        messageShown.current = true;
      }
    } else {
      fetchTransferHistories();
    }
  }, [navigate, redirecting, userRole, fetchTransferHistories]);

  // useEffect(() => {
  //   fetchTransferHistories();
  // }, []);

  // const fetchTransferHistories = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getTransferHistory();
  //     setTransferHistories(data?.$values || []);
  //     console.log("Fetched transfer histories data:", data);
  //   } catch (error) {
  //     console.error("Error fetching transfer histories:", error);
  //     message.error("Failed to load transfer histories");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const columns = [
    {
      title: "History ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Child ID",
      dataIndex: "childId",
      key: "childId",
    },
    {
      title: "From House",
      dataIndex: "fromHouseId",
      key: "fromHouseId",
    },
    {
      title: "To House",
      dataIndex: "toHouseId",
      key: "toHouseId",
    },
    {
      title: "Transfer Date",
      dataIndex: "transferDate",
      key: "transferDate",
      render: (date) =>
        moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    </div>
  );
};

export default TransferHistoryManagement;
