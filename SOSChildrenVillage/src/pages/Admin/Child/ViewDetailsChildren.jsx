import { Modal, Tabs, Descriptions, Tag, Row, Col, Card } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  BookOutlined,
  SmileOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import moment from "moment";
import PropTypes from "prop-types";

const { TabPane } = Tabs;

const ViewDetailsChildren = ({ isVisible, child, onClose }) => {
  if (!child) return null;

  return (
    <Modal
      title={<h2 className="text-2xl font-bold">Child Details</h2>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width="65%"
      bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <h2 className="text-xl font-bold mb-4">{child.childName || "Unknown"}</h2>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={<><CalendarOutlined /> Date of Birth</>}>
                {child.dob ? moment(child.dob).format("DD/MM/YYYY") : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label={<><UserOutlined /> Gender</>}>
                {child.gender || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label={<><EnvironmentOutlined /> House</>}>
                {child.houseName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label={<><SmileOutlined /> Status</>}>
                {child.status || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Tabs defaultActiveKey="health" type="card">
            <TabPane tab={<span><HeartOutlined /> Health</span>} key="health">
              {child.healthReports && child.healthReports.$values && child.healthReports.$values.length > 0 ? (
                child.healthReports.$values.map((report, index) => (
                  <Card key={index} className="mb-4">
                    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                      <Descriptions.Item label="Nutritional Status">{report.nutritionalStatus}</Descriptions.Item>
                      <Descriptions.Item label="Medical History">{report.medicalHistory}</Descriptions.Item>
                      <Descriptions.Item label="Vaccination Status">{report.vaccinationStatus}</Descriptions.Item>
                      <Descriptions.Item label="Weight">{report.weight} kg</Descriptions.Item>
                      <Descriptions.Item label="Height">{report.height} cm</Descriptions.Item>
                      <Descriptions.Item label="Health Status">{report.healthStatus}</Descriptions.Item>
                      <Descriptions.Item label="Illnesses">{report.illnesses}</Descriptions.Item>
                      <Descriptions.Item label="Allergies">{report.allergies}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                ))
              ) : (
                <p>No health reports available.</p>
              )}
            </TabPane>

            <TabPane tab={<span><BookOutlined /> Education</span>} key="education">
              {child.academicReports && child.academicReports.$values && child.academicReports.$values.length > 0 ? (
                child.academicReports.$values.map((report, index) => (
                  <Card key={index} className="mb-4">
                    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                      <Descriptions.Item label="Diploma">{report.diploma}</Descriptions.Item>
                      <Descriptions.Item label="School Level">{report.schoolLevel}</Descriptions.Item>
                      <Descriptions.Item label="GPA">{report.gpa}</Descriptions.Item>
                      <Descriptions.Item label="Semester">{report.semester}</Descriptions.Item>
                      <Descriptions.Item label="Academic Year">{report.academicYear}</Descriptions.Item>
                      <Descriptions.Item label="Achievement">{report.achievement}</Descriptions.Item>
                    </Descriptions>
                    <h4 className="mt-4 mb-2 font-bold">Subjects</h4>
                    {report.subjectDetails && report.subjectDetails.$values && report.subjectDetails.$values.length > 0 ? (
                      <ul>
                        {report.subjectDetails.$values.map((subject, subIndex) => (
                          <li key={subIndex}>
                            {subject.subjectName}: {subject.score} ({subject.remarks})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No subjects available.</p>
                    )}
                  </Card>
                ))
              ) : (
                <p>No academic reports available.</p>
              )}
            </TabPane>

            <TabPane tab={<span><SmileOutlined /> Progress</span>} key="childProgress">
              {child.childProgresses && child.childProgresses.$values && child.childProgresses.$values.length > 0 ? (
                <Card>
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Event">
                      {child.childProgresses.$values.some((progress) => progress.eventName) ? (
                        child.childProgresses.$values
                          .filter((progress) => progress.eventName)
                          .map((progress, index) => (
                            <Tag color="blue" key={index}>{progress.eventName}</Tag>
                          ))
                      ) : (
                        <Tag color="red">No Event</Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Activity">
                      {child.childProgresses.$values.some((progress) => progress.activityName) ? (
                        child.childProgresses.$values
                          .filter((progress) => progress.activityName)
                          .map((progress, index) => (
                            <Tag color="green" key={index}>{progress.activityName}</Tag>
                          ))
                      ) : (
                        <Tag color="red">No Activity</Tag>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ) : (
                <p>No progress records available.</p>
              )}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
  );
};

ViewDetailsChildren.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  child: PropTypes.shape({
    id: PropTypes.string,
    childName: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    status: PropTypes.string,
    houseName: PropTypes.string,

    healthReports: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          nutritionalStatus: PropTypes.string,
          medicalHistory: PropTypes.string,
          vaccinationStatus: PropTypes.string,
          weight: PropTypes.number,
          height: PropTypes.number,
          healthStatus: PropTypes.string,
          illnesses: PropTypes.string,
          allergies: PropTypes.string,
        })
      ),
    }),

    academicReports: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          diploma: PropTypes.string,
          schoolLevel: PropTypes.string,
          gpa: PropTypes.number,
          semester: PropTypes.string,
          academicYear: PropTypes.string,
          achievement: PropTypes.string,
          subjectDetails: PropTypes.shape({
            $values: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.number,
                subjectName: PropTypes.string,
                score: PropTypes.number,
                remarks: PropTypes.string,
              })
            ),
          }),
        })
      ),
    }),

    childProgresses: PropTypes.shape({
      $values: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          description: PropTypes.string,
          date: PropTypes.string,
          category: PropTypes.string,
          eventId: PropTypes.number,
          activityId: PropTypes.number,
          eventName: PropTypes.string,
          activityName: PropTypes.string,
        })
      ),
    }),

    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsChildren;
