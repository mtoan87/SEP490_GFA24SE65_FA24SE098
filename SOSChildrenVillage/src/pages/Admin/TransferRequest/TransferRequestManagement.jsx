import { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
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

const { Option } = Select;
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
  const [selectedRequestForAction, setSelectedRequestForAction] = useState(null);
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
      if (userRole === "3") { // HouseMother
        requests = requests.filter(request => String(request.createdBy) === userId);
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

  // const handleStatusUpdate = async (request, newStatus) => {
  //   try {
  //     const formData = new FormData();
      
  //     formData.append("id", request.id);
  //     formData.append("childId", request.childId);
  //     formData.append("fromHouseId", request.fromHouseId);
  //     formData.append("toHouseId", request.toHouseId);
  //     formData.append("requestReason", request.requestReason);
  //     formData.append("status", newStatus);
  //     formData.append("modifiedBy", userId);
  //     //formData.append("approvedBy", userId);
  //     //formData.append("directorNote", "");
  
  //     await axios.put(
  //       `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${request.id}`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  
  //     message.success(`Request ${newStatus.toLowerCase()} successfully`);
  //     fetchTransferRequests();
  //   } catch (error) {
  //     console.error("Error updating request status:", error);
  //     if (error.response?.data) {
  //       message.error(error.response.data);
  //     } else {
  //       message.error("Failed to update request status");
  //     }
  //   }
  // };

  const handleApprove = async () => {
    try {
      const values = await approvalForm.validateFields();
      const formData = new FormData();
      
      formData.append("id", selectedRequestForAction.id);
      formData.append("childId", selectedRequestForAction.childId);
      formData.append("fromHouseId", selectedRequestForAction.fromHouseId);
      formData.append("toHouseId", selectedRequestForAction.toHouseId);
      formData.append("requestReason", selectedRequestForAction.requestReason);
      formData.append("status", "Approved");
      formData.append("modifiedBy", userId);
      formData.append("approvedBy", userId);
      formData.append("directorNote", values.notes);

      await axios.put(
        `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${selectedRequestForAction.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Request approved successfully");
      setIsApproveModalVisible(false);
      fetchTransferRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      message.error(error.response?.data || "Failed to approve request");
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
      fetchTransferRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      message.error(error.response?.data || "Failed to reject request");
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
        Object.keys(values).forEach(key => {
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
            message.error("Only House Mothers can create new transfer requests");
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
      const request = transferRequests.find(r => r.id === id);
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

  const columns = [
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
          Approved: "green",
          Rejected: "red",
        };
        return (
          <span style={{ color: statusColors[status] }}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => {
        if (userRole === "3") { // HouseMother
          return (
            <Space size="middle">
              {record.status === "Pending" && record.createdBy === userId && (
                <>
                  <Button 
                    onClick={() => showModal(record)} 
                    icon={<EditOutlined />}
                    title="Edit Request"
                  />
                  <Button
                    onClick={() => handleDelete(record.id)}
                    icon={<DeleteOutlined />}
                    danger
                    title="Delete Request"
                  />
                </>
              )}
            </Space>
          );
        }

        if (["1", "6"].includes(userRole)) { // Admin or Director
          return (
            <Space size="middle">
              {record.status === "Pending" && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => showApproveModal(record)}
                    title="Approve Request"
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => showRejectModal(record)}
                    title="Reject Request"
                  >
                    Reject
                  </Button>
                </>
              )}
            </Space>
          );
        }

        return null;
      },
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
        title={selectedRequest ? "Edit Transfer Request" : "New Transfer Request"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
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

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select disabled={userRole === "3"}>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>
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
            rules={[{ required: true, message: "Please enter rejection reason" }]}
          >
            <TextArea rows={4} placeholder="Enter your reason for rejection" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferRequestManagement;

// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   Table,
//   Space,
//   Button,
//   Modal,
//   Form,
//   Input,
//   message,
//   Select,
//   Tooltip,
// } from "antd";
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";
// import axios from "axios";
// import { getTransferRequest } from "../../../services/api";

// const { Option } = Select;
// const { TextArea } = Input;

// const TransferRequestManagement = () => {
//   const [transferRequests, setTransferRequests] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [statusAction, setStatusAction] = useState(null);
//   const [form] = Form.useForm();
//   const [statusForm] = Form.useForm();
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [redirecting, setRedirecting] = useState(false);
//   const navigate = useNavigate();
//   const messageShown = useRef(false);

//   // Get user role and ID from localStorage
//   const userRole = localStorage.getItem("roleId");
//   const userId = localStorage.getItem("userId");

//   const fetchTransferRequests = useCallback(async () => {
//     try {
//       setLoading(true);
//       const data = await getTransferRequest();
//       let requests = data?.$values || [];

//       // Filter requests based on user role
//       if (userRole === "3") { // HouseMother
//         requests = requests.filter(request => String(request.createdBy) === userId);
//       }

//       setTransferRequests(requests);
//     } catch (error) {
//       console.error("Error fetching transfer requests:", error);
//       message.error("Failed to load transfer requests");
//       setTransferRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [userRole, userId]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token || !["1", "3", "6"].includes(userRole)) {
//       if (!redirecting && !messageShown.current) {
//         setRedirecting(true);
//         message.error("You do not have permission to access this page");
//         navigate("/home");
//         messageShown.current = true;
//       }
//     } else {
//       fetchTransferRequests();
//     }
//   }, [navigate, redirecting, userRole, fetchTransferRequests]);

//   const showStatusModal = (request, action) => {
//     setSelectedRequest(request);
//     setStatusAction(action);
//     setIsStatusModalVisible(true);
//     statusForm.resetFields();
//   };

//   const handleStatusUpdate = async () => {
//     try {
//       const values = await statusForm.validateFields();
//       const formData = new FormData();
      
//       formData.append("status", statusAction === 'approve' ? "Approved" : "Rejected");
//       formData.append("directorNote", values.note || "");
//       formData.append("modifiedBy", userId);
      
//       await axios.put(
//         `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${selectedRequest.id}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       message.success(`Request ${statusAction === 'approve' ? 'approved' : 'rejected'} successfully`);
//       setIsStatusModalVisible(false);
//       fetchTransferRequests();
//     } catch (error) {
//       console.error("Error updating request status:", error);
//       message.error("Failed to update request status");
//     }
//   };

//   const showModal = (request = null) => {
//     setSelectedRequest(request);
//     if (request) {
//       form.setFieldsValue({
//         ...request,
//         requestDate: moment(request.requestDate),
//       });
//     } else {
//       form.resetFields();
//       form.setFieldsValue({
//         status: "Pending",
//       });
//     }
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     form.validateFields().then(async (values) => {
//       try {
//         const formData = new FormData();
//         Object.keys(values).forEach(key => {
//           formData.append(key, values[key] || "");
//         });

//         if (selectedRequest) {
//           // Only allow HouseMother to edit their own requests
//           if (userRole === "3" && selectedRequest.createdBy !== userId) {
//             message.error("You can only edit your own requests");
//             return;
//           }

//           formData.append("modifiedBy", userId);
//           await axios.put(
//             `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/UpdateTransferRequest/${selectedRequest.id}`,
//             formData,
//             {
//               headers: { "Content-Type": "multipart/form-data" },
//             }
//           );
//           message.success("Transfer request updated successfully");
//         } else {
//           // Only HouseMother can create new requests
//           if (userRole !== "3") {
//             message.error("Only House Mothers can create new transfer requests");
//             return;
//           }

//           formData.append("createdBy", userId);
//           await axios.post(
//             "https://soschildrenvillage.azurewebsites.net/api/TransferRequest/CreateTransferRequest",
//             formData,
//             {
//               headers: { "Content-Type": "multipart/form-data" },
//             }
//           );
//           message.success("Transfer request created successfully");
//         }
//         setIsModalVisible(false);
//         form.resetFields();
//         fetchTransferRequests();
//       } catch (error) {
//         console.error("Error saving transfer request:", error);
//         message.error("Failed to save transfer request");
//       }
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Only allow HouseMother to delete their own requests
//       const request = transferRequests.find(r => r.id === id);
//       if (userRole === "3" && request.createdBy !== userId) {
//         message.error("You can only delete your own requests");
//         return;
//       }

//       await axios.delete(
//         `https://soschildrenvillage.azurewebsites.net/api/TransferRequest/DeleteTransferRequest/${id}`
//       );
//       message.success("Transfer request deleted successfully");
//       fetchTransferRequests();
//     } catch (error) {
//       console.error("Error deleting transfer request:", error);
//       message.error("Failed to delete transfer request");
//     }
//   };

//   const columns = [
//     {
//       title: "Request ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Child ID",
//       dataIndex: "childId",
//       key: "childId",
//     },
//     {
//       title: "From House",
//       dataIndex: "fromHouseId",
//       key: "fromHouseId",
//     },
//     {
//       title: "To House",
//       dataIndex: "toHouseId",
//       key: "toHouseId",
//     },
//     {
//       title: "Request Date",
//       dataIndex: "requestDate",
//       key: "requestDate",
//       render: (date) =>
//         moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : "",
//     },
//     {
//       title: "Request Reason",
//       dataIndex: "requestReason",
//       key: "requestReason",
//       ellipsis: {
//         showTitle: false,
//       },
//       render: (reason) => (
//         <Tooltip placement="topLeft" title={reason}>
//           {reason}
//         </Tooltip>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const statusColors = {
//           Pending: "orange",
//           Approved: "green",
//           Rejected: "red",
//         };
//         return (
//           <span style={{ color: statusColors[status] }}>
//             {status}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       key: "action",
//       render: (_, record) => {
//         if (userRole === "3") { // HouseMother
//           return (
//             <Space size="middle">
//               {record.status === "Pending" && record.createdBy === userId && (
//                 <>
//                   <Button 
//                     onClick={() => showModal(record)} 
//                     icon={<EditOutlined />}
//                     title="Edit Request"
//                   />
//                   <Button
//                     onClick={() => handleDelete(record.id)}
//                     icon={<DeleteOutlined />}
//                     danger
//                     title="Delete Request"
//                   />
//                 </>
//               )}
//             </Space>
//           );
//         }

//         if (["1", "6"].includes(userRole)) { // Admin or Director
//           return (
//             <Space size="middle">
//               {record.status === "Pending" && (
//                 <>
//                   <Button
//                     type="primary"
//                     icon={<CheckCircleOutlined />}
//                     onClick={() => showStatusModal(record, 'approve')}
//                     title="Approve Request"
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     danger
//                     icon={<CloseCircleOutlined />}
//                     onClick={() => showStatusModal(record, 'reject')}
//                     title="Reject Request"
//                   >
//                     Reject
//                   </Button>
//                 </>
//               )}
//             </Space>
//           );
//         }

//         return null;
//       },
//     },
//   ];

//   return (
//     <div style={{ padding: "24px" }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "24px",
//           flexWrap: "wrap",
//           gap: "16px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//         <Input
//             placeholder="Search for report"
//             prefix={<SearchOutlined />}
//             style={{ width: 500, marginRight: 8 }}
//           />
//           {userRole === "3" && (
//             <Button
//               onClick={() => showModal()}
//               type="primary"
//               icon={<PlusOutlined />}
//             >
//               New Transfer Request
//             </Button>
//           )}
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={transferRequests}
//         loading={loading}
//         rowKey={(record) => record.id}
//         pagination={{
//           current: currentPage,
//           pageSize: pageSize,
//           total: transferRequests.length,
//           onChange: (page, pageSize) => {
//             setCurrentPage(page);
//             setPageSize(pageSize);
//           },
//           showTotal: (total) => `Total ${total} items`,
//         }}
//       />

//       {/* Modal for Create/Edit */}
//       <Modal
//         title={selectedRequest ? "Edit Transfer Request" : "New Transfer Request"}
//         open={isModalVisible}
//         onOk={handleOk}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//         }}
//         width={600}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{ status: "Pending" }}
//         >
//           <Form.Item
//             name="childId"
//             label="Child ID"
//             rules={[{ required: true, message: "Please enter Child ID" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="fromHouseId"
//             label="From House ID"
//             rules={[{ required: true, message: "Please enter From House ID" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="toHouseId"
//             label="To House ID"
//             rules={[{ required: true, message: "Please enter To House ID" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="requestReason"
//             label="Request Reason"
//             rules={[{ required: true, message: "Please enter request reason" }]}
//           >
//             <TextArea rows={4} />
//           </Form.Item>

//           <Form.Item
//             name="status"
//             label="Status"
//             rules={[{ required: true }]}
//           >
//             <Select disabled={userRole === "3"}>
//               <Option value="Pending">Pending</Option>
//               <Option value="Approved">Approved</Option>
//               <Option value="Rejected">Rejected</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal for Approve/Reject */}
//       <Modal
//         title={`${statusAction === 'approve' ? 'Approve' : 'Reject'} Transfer Request`}
//         open={isStatusModalVisible}
//         onOk={handleStatusUpdate}
//         onCancel={() => {
//           setIsStatusModalVisible(false);
//           statusForm.resetFields();
//         }}
//         width={500}
//       >
//         <Form
//           form={statusForm}
//           layout="vertical"
//         >
//           <Form.Item
//             name="note"
//             label={statusAction === 'approve' ? "Approval Note" : "Rejection Reason"}
//             //rules={[{ required: true, message: `Please enter ${statusAction === 'approve' ? 'approval note' : 'rejection reason'}` }]}
//           >
//             <TextArea rows={4} />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TransferRequestManagement;