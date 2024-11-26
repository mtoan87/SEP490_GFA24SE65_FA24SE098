import { useState, useEffect } from "react";
import { Table, Space, Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getAcademicReport } from "../../../services/api";
import axios from "axios";

const AcademicReport = () => {
  const [reports, setReports] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingReports, setEditingReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAcademicReports();
  }, []);

  const fetchAcademicReports = async () => {
    try {
      setLoading(true);
      const data = await getAcademicReport();
      setReports(data?.$values || []);
      //setReports(Array.isArray(data) ? data : []);
      console.log("Fetched academic report data:", data);
    } catch (error) {
      console.log(error);
      message.error("Can not get academic report data");
    } finally {
      setLoading(false);
    }
  };
  const showModal = (report = null) => {
    setEditingReports(report);
    if (report) {
      form.setFieldsValue({
        ...report,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();

        formData.append("diploma", values.diploma || "");
        formData.append("childId", values.childId || "");
        formData.append("gpa", values.gpa || "");
        formData.append("schoolReport", values.schoolReport || "");

        console.log("Academic Report Values:", values);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        if (editingReports) {
          await axios.put(
            `https://soschildrenvillage.azurewebsites.net/api/AcademicReport/UpdateAcademicReport/${editingReports.id}`,
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Update Academic Report Successfully");
        } else {
          await axios.post(
            "https://soschildrenvillage.azurewebsites.net/api/AcademicReport/CreateAcademicReport",
            values,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          message.success("Add Academic Report Successfully");
        }
        setIsModalVisible(false);
        fetchAcademicReports();
      } catch (error) {
        console.error("Error occurred when saving data:", error);
        message.error("Unable to save data");
      }
    });
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://soschildrenvillage.azurewebsites.net/api/AcademicReport/DeleteAcademicReport/${id}`
      );
      message.success("Delete Academic Report Successfully");
      fetchAcademicReports();
    } catch (error) {
      console.error("Error occurred when deleting report:", error);
      message.error("Unable to delete report");
    }
  };
  const columns = [
    {
      title: "Academic Report Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Diploma",
      dataIndex: "diploma",
      key: "diploma",
    },
    {
      title: "Child Id",
      dataIndex: "childId",
      key: "childId",
    },
    {
      title: "GPA",
      dataIndex: "gpa",
      key: "gpa",
    },
    {
      title: "School Report",
      dataIndex: "schoolReport",
      key: "schoolReport",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
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
        </Space>
      ),
    },
  ];
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Search for report"
            prefix={<SearchOutlined />}
            style={{ width: 500, marginRight: 8 }}
          />
          <div
            style={{
              display: "flex",
            }}
          >
            <Button
              onClick={() => showModal()}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: 8 }}
            >
              Add New Report
            </Button>

            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Table
          columns={columns}
          dataSource={reports}
          loading={loading}
          rowKey={(record) => record.id}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
              );
            },
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: reports.length,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            position: ["Left"],
            itemRender: (_, type, originalElement) => {
              if (type === "prev") {
                return <Button>Previous</Button>;
              }
              if (type === "next") {
                return <Button>Next</Button>;
              }
              return originalElement;
            },
          }}
        />
      </div>

      <Modal
        title={
          editingReports
            ? "Update Academic Reports"
            : "Add New Academic Reports"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={650}
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
        <Form form={form} layout="vertical">
          <Form.Item
            name="diploma"
            label="Diploma"
            rules={[{ required: true, message: "Please enter diploma" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="childId"
            label="Child Id"
            rules={[{ required: true, message: "Please enter child ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gpa"
            label="GPA"
            rules={[{ required: true, message: "Please enter GPA" }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default AcademicReport;
