import React, { useEffect, useState } from 'react';
import { Table, message, Button, Input, Modal, Form, Upload, DatePicker } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

const ChildrenBadManagement = () => {
    const [childrenData, setChildrenData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [description, setDescription] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [roleId, setRoleId] = useState(null);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [eventDetails, setEventDetails] = useState({
        eventCode: '',
        createdBy: '',
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        img: null,
    });
    const [uploadFiles, setUploadFiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                message.error('User information not found');
                return;
            }

            try {
                // Fetch user data and roleId
                const userResponse = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`);
                setUserName(userResponse.data.userName);
                setRoleId(userResponse.data.roleId);

                // Fetch appropriate data based on roleId
                if (userResponse.data.roleId === 3) {
                    const childrenResponse = await axios.get(
                        `https://soschildrenvillage.azurewebsites.net/api/Children/GetChildrenBadStatusByUserId?userAccountId=${userId}`
                    );
                    setChildrenData(childrenResponse.data);
                } else if (userResponse.data.roleId === 4) {
                    const expensesResponse = await axios.get(
                        `https://soschildrenvillage.azurewebsites.net/api/Expenses/GetUnConfirmHouseExpense`
                    );
                    setChildrenData(expensesResponse.data);
                } else if (userResponse.data.roleId === 6) {
                    const villageExpensesResponse = await axios.get(
                        `https://soschildrenvillage.azurewebsites.net/api/Expenses/GetUnComfirmVillageExpense`
                    );
                    setChildrenData(villageExpensesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Not found!');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = (selectedRowKeys) => {
        setSelectedChildren(selectedRowKeys);
    };

    const handleExpenseSelectChange = (selectedRowKeys) => {
        setSelectedExpenses(selectedRowKeys);
    };

    const columns = [
        {
            title: 'Child ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'Child Name',
            dataIndex: 'childName',
            key: 'childName',
            align: 'center',
        },
        {
            title: 'Health Status',
            dataIndex: 'healthStatus',
            key: 'healthStatus',
            align: 'center',
        },
        {
            title: 'House ID',
            dataIndex: 'houseId',
            key: 'houseId',
            align: 'center',
        },
        {
            title: 'Amount Needed',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
    ];

    const unconfirmedColumns = [
        {
            title: 'Expense Amount',
            dataIndex: 'expenseAmount',
            key: 'expenseAmount',
            align: 'center',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
        },
        {
            title: 'Expense Day',
            dataIndex: 'expenseday',
            key: 'expenseday',
            align: 'center',
        },
        {
            title: 'Expense Type',
            dataIndex: 'expenseType',
            key: 'expenseType',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
        },
        {
            title: 'Requested By',
            dataIndex: 'requestedBy',
            key: 'requestedBy',
            align: 'center',
        },
        {
            title: 'House ID',
            dataIndex: 'houseId',
            key: 'houseId',
            align: 'center',
        },
    ];

    const villageExpenseColumns = [
        {
            title: 'Expense Amount',
            dataIndex: 'expenseAmount',
            key: 'expenseAmount',
            align: 'center',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
        },
        {
            title: 'Expense Day',
            dataIndex: 'expenseday',
            key: 'expenseday',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
        },
        {
            title: 'Requested By',
            dataIndex: 'requestedBy',
            key: 'requestedBy',
            align: 'center',
        },
    ];

    const handleCreateExpense = () => {
        if (selectedChildren.length === 0) {
            message.warning('Please select at least one child');
            return;
        }

        if (!description) {
            message.warning('Please provide description');
            return;
        }

        const selectedHouseIds = childrenData
            .filter((child) => selectedChildren.includes(child.id))
            .map((child) => child.houseId);

        if (selectedHouseIds.length === 0) {
            message.warning('No valid house selected');
            return;
        }

        const requestPayload = {
            description,
            houseId: selectedHouseIds[0],
            requestedBy: userName,
            selectedChildrenIds: selectedChildren,
        };

        axios
            .post('https://soschildrenvillage.azurewebsites.net/api/Expenses/RequestChildExpense', requestPayload)
            .then(() => {
                message.success('Expense request created successfully');
                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error('Error creating expense request:', error);
                message.error('Failed to create expense request');
            });
    };

    const handleConfirmExpense = () => {
        if (selectedExpenses.length === 0) {
            message.warning('Please select at least one expense');
            return;
        }

        if (!description) {
            message.warning('Please provide description');
            return;
        }

        const selectedHouseIds = childrenData
            .filter((expense) => selectedExpenses.includes(expense.id))
            .map((expense) => expense.houseId);

        if (selectedHouseIds.length === 0) {
            message.warning('No valid house selected');
            return;
        }

        const requestPayload = selectedHouseIds;

        axios
            .put(
                `https://soschildrenvillage.azurewebsites.net/api/Expenses/ConfirmSpecialExpense?description=${description}&userName=${userName}`,
                requestPayload
            )
            .then(() => {
                message.success('Expenses confirmed successfully');
                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error('Error confirming expense:', error);
                message.error('Failed to confirm expense');
            });
    };

    const handleCreateEvent = () => {
        const selectedExpense = childrenData.find((expense) => selectedExpenses.includes(expense.id));
        if (!selectedExpense) {
            message.warning('Please select a valid expense');
            return;
        }

        const formData = new FormData();
        formData.append('createdBy', userName);
        formData.append('name', eventDetails.name);
        formData.append('description', eventDetails.description);
        formData.append('startTime', eventDetails.startTime);
        formData.append('endTime', eventDetails.endTime);

        if (uploadFiles && uploadFiles.length > 0) {
            uploadFiles.forEach((file) => {
                if (file.originFileObj) {
                    formData.append("Img", file.originFileObj);
                }
            });
        }
        const userId = localStorage.getItem('userId');
            if (!userId) {
                message.error('User information not found');
                return;
            }

        axios
            .post(
                `https://soschildrenvillage.azurewebsites.net/api/Event/ApproveEvent?villageExpenseId=${selectedExpense.id}&userId=${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            .then(() => {
                message.success('Event created successfully');
                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error('Error creating event:', error);
                message.error('Failed to create event');
            });
    };

    const uploadProps = {
        name: "images",
        multiple: true,
        fileList: uploadFiles,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error(`${file.name} is not an image file`);
                return Upload.LIST_IGNORE;
            }
            return false;
        },
        onChange: (info) => {
            setUploadFiles(info.fileList);
        },
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>
                {roleId === 3
                    ? 'List of Children with Bad Health Status'
                    : roleId === 4
                        ? 'List of Unconfirmed House Expenses'
                        : 'List of Unconfirmed Village Expenses'}
            </h2>
            <Button
                type="primary"
                onClick={handleOpenModal}
                style={{ marginBottom: '20px', maxWidth: '300px' }}
            >
                {roleId === 3 ? 'Create Expense' : roleId === 6 ? 'Create Event' : 'Request To Event'}
            </Button>

            <Table
                columns={roleId === 3 ? columns : roleId === 4 ? unconfirmedColumns : villageExpenseColumns}
                dataSource={childrenData}
                loading={loading}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    pageSizeOptions: ['10', '20', '50'],
                }}
                rowSelection={{
                    selectedRowKeys: roleId === 3 ? selectedChildren : selectedExpenses,
                    onChange: roleId === 3 ? handleSelectChange : handleExpenseSelectChange,
                }}
            />
            <Modal
                title="Provide Description"
                visible={isModalVisible}
                onCancel={handleCancelModal}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'right', gap: '10px' }}>
                        <Button key="cancel" onClick={handleCancelModal} style={{ width: '100px' }}>
                            Cancel
                        </Button>
                        <Button
                            key="submit"
                            type="primary"
                            onClick={roleId === 3 ? handleCreateExpense : roleId === 6 ? handleCreateEvent : handleConfirmExpense}
                            style={{ width: '100px' }}
                        >
                            Submit
                        </Button>
                    </div>
                }
            >

                {roleId === 6 ? (
                    <Form layout="vertical">

                        <Form.Item
                            label="Event Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input the event name!' }]}
                        >
                            <Input
                                placeholder="Event Name"
                                value={eventDetails.name}
                                onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please provide a description!' }]}
                        >
                            <Input
                                placeholder="Description"
                                value={eventDetails.description}
                                onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Start Time"
                            name="startTime"
                            rules={[{ required: true, message: 'Please select the start time!' }]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD"
                                value={eventDetails.startTime}
                                onChange={(date, dateString) => setEventDetails({ ...eventDetails, startTime: dateString })}
                            />
                        </Form.Item>

                        <Form.Item
                            label="End Time"
                            name="endTime"
                            rules={[{ required: true, message: 'Please select the end time!' }]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD"
                                value={eventDetails.endTime}
                                onChange={(date, dateString) => setEventDetails({ ...eventDetails, endTime: dateString })}
                            />
                        </Form.Item>

                        <Form.Item label="Upload New Images">
                            <Upload.Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag files to upload</p>
                                <p className="ant-upload-hint">
                                    Support for single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please provide a description!' }]}
                    >
                        <Input.TextArea
                            placeholder="Provide description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                )}
            </Modal>

        </div >
    );
};

export default ChildrenBadManagement;
