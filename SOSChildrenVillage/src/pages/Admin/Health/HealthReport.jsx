import { useState, useEffect } from "react";
import { Table, Space, Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const HealthReport = () => {
  const [reports, setReports] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingReports, setEditingReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchHealthReports();
  }, []);

  const fetchHealthReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://localhost:7073/api/HealthReport");
      setReports(data?.$values || []);
    } catch (error) {
      console.log(error);
      message.error("Can not get health report data");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (report = null) => {
    setEditingReports(report);
    if (report) {
      form.setFieldsValue({ ...report });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();
        formData.append("childId", values.childId || "");
        formData.append("nutritionalStatus", values.nutritionalStatus || "");
        formData.append("medicalHistory", values.medicalHistory || "");
        formData.append("healthCertificate", values.healthCertificate || "");
        formData.append("vaccinationStatus", values.vaccinationStatus || "");
        formData.append("weight", values.weight || "");
        formData.append("height", values.height || "");

        if (editingReports) {
          await axios.put(
            `https://localhost:7073/api/HealthReport/UpdateHealthReport/${editingReports.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          message.success("Update Health Report Successfully");
        } else {
          await axios.post(
            "https://localhost:7073/api/HealthReport/CreateHealthReport",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          message.success("Add Health Report Successfully");
        }
        setIsModalVisible(false);
        fetchHealthReports();
      } catch (error) {
        console.error("Error occurred when saving data:", error);
        message.error("Unable to save data");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://localhost:7073/api/HealthReport/DeleteHealthReport/${id}`
      );
      message.success("Delete Health Report Successfully");
      fetchHealthReports();
    } catch (error) {
      console.error("Error occurred when deleting report:", error);
      message.error("Unable to delete report");
    }
  };

  const columns = [
    {
      title: "Health Report Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Child Id",
      dataIndex: "childId",
      key: "childId",
    },
    {
      title: "Nutritional Status",
      dataIndex: "nutritionalStatus",
      key: "nutritionalStatus",
    },
    {
      title: "Medical History",
      dataIndex: "medicalHistory",
      key: "medicalHistory",
    },
    {
      title: "Health Certificate",
      dataIndex: "healthCertificate",
      key: "healthCertificate",
    },
    {
      title: "Vaccination Status",
      dataIndex: "vaccinationStatus",
      key: "vaccinationStatus",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Search for report"
            prefix={<SearchOutlined />}
            style={{ width: 500, marginRight: 8 }}
          />
          <div style={{ display: "flex" }}>
            <Button
              onClick={() => showModal()}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: 8 }}
            >
              Add New Health Report
            </Button>
            <Button type="default" style={{ marginRight: 8 }}>
              Filter options
            </Button>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", overflow: "auto" }}>
        <Table
          columns={columns}
          dataSource={reports}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: reports.length,
            showSizeChanger: false,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>

      <Modal
        title={
          editingReports ? "Update Health Report" : "Add New Health Report"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={650}
        footer={[
          <div key="footer" style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
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
            name="childId"
            label="Child Id"
            rules={[{ required: true, message: "Please enter child ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="nutritionalStatus"
            label="Nutritional Status"
            rules={[{ required: true, message: "Please enter nutritional status" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="medicalHistory"
            label="Medical History"
            rules={[{ required: true, message: "Please enter medical history" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="healthCertificate"
            label="Health Certificate"
            rules={[{ required: true, message: "Please enter health certificate" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="vaccinationStatus"
            label="Vaccination Status"
            rules={[{ required: true, message: "Please enter vaccination status" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: true, message: "Please enter weight" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="height"
            label="Height"
            rules={[{ required: true, message: "Please enter height" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthReport;
