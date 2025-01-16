import { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  //Select,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { getTransferRequest } from "../../../services/api";

//const { Option } = Select;
const { TextArea } = Input;

const TransferRequestManagement = () => {
  const [transferRequests, setTransferRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const messageShown = useRef(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedRequestForAction, setSelectedRequestForAction] =
    useState(null);
  const [approvalForm] = Form.useForm();
  const [rejectionForm] = Form.useForm();

  // Get user role and ID from localStorage
  const userRole = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");

  const fetchTransferRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransferRequest();
      let requests = data?.$values || [];

      // Filter requests based on user role
      if (userRole === "3") {
        // HouseMother
        requests = requests.filter(
          (request) => String(request.createdBy) === userId
        );
      }

      setTransferRequests(requests);
    } catch (error) {
      console.error("Error fetching transfer requests:", error);
      message.error("Failed to load transfer requests");
      setTransferRequests([]);
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
      fetchTransferRequests();
    }
  }, [navigate, redirecting, userRole, fetchTransferRequests]);

  const showApproveModal = (request) => {
    setSelectedRequestForAction(request);
    setIsApproveModalVisible(true);
    approvalForm.resetFields();
  };

  const showRejectModal = (request) => {
    setSelectedRequestForAction(request);
    setIsRejectModalVisible(true);
    rejectionForm.resetFields();
  };

  const handleApprove = async () => {
    try {
      const values = await approvalForm.validateFields();
      const formData = new FormData();

      formData.append("id", selectedRequestForAction.id);
      formData.append("childId", selectedRequestForAction.childId);
      formData.append("fromHouseId", selectedRequestForAction.fromHouseId);
      formData.append("toHouseId", selectedRequestForAction.toHouseId);
      formData.append("requestReason", selectedRequestForAction.requestReason);

      // Kiểm tra nếu là approve lần 2
      if (selectedRequestForAction.status === "ReadyToTransfer") {
        formData.append("status", "Completed");
      } else {
        formData.append("status", "InProcess");
      }

      formData.append("modifiedBy", userId);
      formData.append("directorNote", values.notes);

      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${selectedRequestForAction.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success(
        selectedRequestForAction.status === "ReadyToTransfer"
          ? "Transfer completed successfully"
          : "Request approved and moved to InProcess"
      );
      setIsApproveModalVisible(false);
      await fetchTransferRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      message.error(
        error.response?.data?.message || "Failed to approve request"
      );
    }
  };

  const handleReject = async () => {
    try {
      const values = await rejectionForm.validateFields();
      const formData = new FormData();

      formData.append("id", selectedRequestForAction.id);
      formData.append("childId", selectedRequestForAction.childId);
      formData.append("fromHouseId", selectedRequestForAction.fromHouseId);
      formData.append("toHouseId", selectedRequestForAction.toHouseId);
      formData.append("requestReason", selectedRequestForAction.requestReason);
      formData.append("status", "Rejected");
      formData.append("modifiedBy", userId);
      formData.append("directorNote", values.rejectionReason);

      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${selectedRequestForAction.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Request rejected successfully");
      setIsRejectModalVisible(false);
      await fetchTransferRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      message.error(
        error.response?.data?.message || "Failed to reject request"
      );
    }
  };

  const showModal = (request = null) => {
    setSelectedRequest(request);
    if (request) {
      form.setFieldsValue({
        ...request,
        requestDate: moment(request.requestDate),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: "Pending",
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key] || "");
        });

        if (selectedRequest) {
          // Only allow HouseMother to edit their own requests
          if (userRole === "3" && selectedRequest.createdBy !== userId) {
            message.error("You can only edit your own requests");
            return;
          }

          formData.append("modifiedBy", userId);
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${selectedRequest.id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Transfer request updated successfully");
        } else {
          // Only HouseMother can create new requests
          if (userRole !== "3") {
            message.error(
              "Only House Mothers can create new transfer requests"
            );
            return;
          }

          formData.append("createdBy", userId);
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/TransferRequest/CreateTransferRequest",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Transfer request created successfully");
        }
        setIsModalVisible(false);
        form.resetFields();
        fetchTransferRequests();
      } catch (error) {
        console.error("Error saving transfer request:", error);
        message.error("Failed to save transfer request");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      // Only allow HouseMother to delete their own requests
      const request = transferRequests.find((r) => r.id === id);
      if (userRole === "3" && request.createdBy !== userId) {
        message.error("You can only delete your own requests");
        return;
      }

      await axios.delete(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/DeleteTransferRequest/${id}`
      );
      message.success("Transfer request deleted successfully");
      fetchTransferRequests();
    } catch (error) {
      console.error("Error deleting transfer request:", error);
      message.error("Failed to delete transfer request");
    }
  };

  const getVisibleColumns = () => {
    let baseColumns = [
      {
        title: "Request ID",
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
        title: "Request Date",
        dataIndex: "requestDate",
        key: "requestDate",
        render: (date) =>
          moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
      },
      {
        title: "Request Reason",
        dataIndex: "requestReason",
        key: "requestReason",
        ellipsis: {
          showTitle: false,
        },
        render: (reason) => (
          <Tooltip placement="topLeft" title={reason}>
            {reason}
          </Tooltip>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusColors = {
            Pending: "orange",
            InProcess: "blue",
            ReadyToTransfer: "cyan",
            DeclinedToTransfer: "volcano",
            Completed: "green",
            Rejected: "red",
          };
          return <span style={{ color: statusColors[status] }}>{status}</span>;
        },
      },
      {
        title: "Actions",
        key: "action",
        width: 200,
        render: (_, record) => {
          if (userRole === "3") {
            // HouseMother
            return (
              <Space size="middle">
                {record.status === "Pending" && record.createdBy === userId && (
                  <>
                    <Button
                      key={`edit-${record.id}`}
                      onClick={() => showModal(record)}
                      icon={<EditOutlined />}
                    />
                    <Button
                      key={`delete-${record.id}`}
                      onClick={() => handleDelete(record.id)}
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </>
                )}
              </Space>
            );
          }

          // Admin hoặc Director
          if (["1", "6"].includes(userRole)) {
            return (
              <Space
                size="small"
                direction="vertical"
                style={{ width: "100%" }}
              >
                {record.status === "Pending" && (
                  <>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => showApproveModal(record)}
                    >
                      Approve
                    </Button>
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => showRejectModal(record)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {record.status === "ReadyToTransfer" && (
                  <Button
                    type="primary"
                    onClick={() => showApproveModal(record)}
                  >
                    Complete Transfer
                  </Button>
                )}
                {record.status === "DeclinedToTransfer" && (
                  <Button danger onClick={() => showRejectModal(record)}>
                    Confirm Rejection
                  </Button>
                )}
              </Space>
            );
          }

          return null;
        },
      },
    ];

    // Thêm cột CreatedBy nếu user là Admin hoặc Director
    if (["1", "6"].includes(userRole)) {
      baseColumns.splice(6, 0, {
        title: "Created By",
        dataIndex: "createdBy",
        key: "createdBy",
      });
    }

    return baseColumns;
  };

  const columns = getVisibleColumns();

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Input
            placeholder="Search for report"
            prefix={<SearchOutlined />}
            style={{ width: 500, marginRight: 8 }}
          />
          {userRole === "3" && (
            <Button
              onClick={() => showModal()}
              type="primary"
              icon={<PlusOutlined />}
            >
              New Transfer Request
            </Button>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={transferRequests}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: transferRequests.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      {/* Modal for Create/Edit */}
      <Modal
        title={
          selectedRequest ? "Edit Transfer Request" : "New Transfer Request"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
        footer={[
          <div
            key="footer"
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button key="ok" type="primary" onClick={handleOk}>
              OK
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "Pending" }}
        >
          <Form.Item
            name="childId"
            label="Child ID"
            rules={[{ required: true, message: "Please enter Child ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="fromHouseId"
            label="From House ID"
            rules={[{ required: true, message: "Please enter From House ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="toHouseId"
            label="To House ID"
            rules={[{ required: true, message: "Please enter To House ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="requestReason"
            label="Request Reason"
            rules={[{ required: true, message: "Please enter request reason" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select disabled={userRole === "3"}>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="InProcess">InProcess</Option>
              <Option value="ReadyToTransfer">ReadyToTransfer</Option>
              <Option value="DeclinedToTransfer">DeclinedToTransfer</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>

      {/* Modal for Approve */}
      {/* Approve Modal */}
      <Modal
        title="Approve Transfer Request"
        open={isApproveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setIsApproveModalVisible(false);
          approvalForm.resetFields();
        }}
      >
        <Form form={approvalForm} layout="vertical">
          <Form.Item
            name="notes"
            label="Approval Notes"
            rules={[{ required: true, message: "Please enter approval notes" }]}
          >
            <TextArea rows={4} placeholder="Enter your approval notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Transfer Request"
        open={isRejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setIsRejectModalVisible(false);
          rejectionForm.resetFields();
        }}
      >
        <Form form={rejectionForm} layout="vertical">
          <Form.Item
            name="rejectionReason"
            label="Rejection Reason"
            rules={[
              { required: true, message: "Please enter rejection reason" },
            ]}
          >
            <TextArea rows={4} placeholder="Enter your reason for rejection" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferRequestManagement;
