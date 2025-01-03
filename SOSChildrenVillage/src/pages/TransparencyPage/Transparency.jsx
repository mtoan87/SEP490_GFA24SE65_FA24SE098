import React from 'react';
import { Layout, Typography, List, Image, message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './Transparency.css';

const { Content } = Layout;
const { Title, Paragraph, Link } = Typography;

const Transparency = () => {
    const handleDownloadReport = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7073/api/Incomes/ExportExcel',
                {
                    responseType: 'blob', // Ensure the response is a file
                }
            );
            // Create file from blob and save it
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Income_Report_${new Date().toISOString()}.xlsx`); // Name the file with a timestamp
            message.success('Report downloaded successfully!');
        } catch (error) {
            console.error('Error downloading report:', error);
            message.error('Failed to download report');
        }
    };

    const data = [
        { 
            text: 'List of Sponsors for 2024', 
            onClick: handleDownloadReport 
        },
    ];

    return (
        <Layout className="transparency-layout">
            <Content className="transparency-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Image
                            src="https://sosvietnam.org/getmedia/1b063691-ac64-4512-b2fa-e0e9871b2dbc/Scene1-02_o.jpg?width=1920"
                            alt="Two children smiling in front of a green background with text overlay"
                            preview={false}
                            style={{ borderRadius: '8px' }}
                        />
                    </div>
                    <div>
                        <Title level={2} className="transparency-title">
                            LIST OF DOMESTIC SPONSORSHIPS
                        </Title>
                        <Paragraph className="transparency-paragraph">
                            Over the past 30 years, Vietnam has attracted nearly 120 million USD from SOS Children's Villages International.
                            This non-refundable funding is maintained annually with approximately 7-8 million USD for regular activities.
                        </Paragraph>
                        <Paragraph className="transparency-paragraph">
                            In recent years, SOS Children's Villages Vietnam has actively sought domestic funding sources as 
                            SOS Children's Villages International gradually reduces its financial aid to support children in
                            other areas where the need is greater, as Vietnam has become a middle-income country.
                        </Paragraph>
                        <List
                            size="small"
                            header={<Title level={4} className="transparency-list-header">List of Sponsorships:</Title>}
                            bordered
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <Link onClick={item.onClick}>
                                        {item.text}
                                    </Link>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Transparency;
