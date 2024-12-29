import { Modal, Tabs, Descriptions, Image, Space} from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  BookOutlined, 
  SmileOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import PropTypes from 'prop-types';

const { TabPane } = Tabs;

const ViewDetailsChildren = ({ isVisible, child, onClose }) => {
  if (!child) return null;

  return (
    <Modal
      title={<h2 className="text-2xl font-bold">Detailed Information</h2>}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      {/* Header: Child Image and Basic Info */}
      <div className="flex gap-6 mb-6">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden">
          <Image
            src={child.imageUrls?.[0] || "/placeholder.svg"}
            alt={child.childName}
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">{child.childName || "Unknown"}</h2>
          <Descriptions column={2}>
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
        </div>
      </div>

      {/* Tabs: Health, Education, Achievements */}
      <Tabs defaultActiveKey="health">
        {/* Health Tab */}
        <TabPane tab={<span><HeartOutlined /> Health</span>} key="health">
          {child.healthReports && child.healthReports.length > 0 ? (
            child.healthReports.map((report, index) => (
              <Descriptions key={index} bordered column={1}>
                <Descriptions.Item label="Nutritional Status">{report.nutritionalStatus}</Descriptions.Item>
                <Descriptions.Item label="Medical History">{report.medicalHistory}</Descriptions.Item>
                <Descriptions.Item label="Vaccination Status">{report.vaccinationStatus}</Descriptions.Item>
                <Descriptions.Item label="Weight">{report.weight} kg</Descriptions.Item>
                <Descriptions.Item label="Height">{report.height} cm</Descriptions.Item>
                <Descriptions.Item label="Health Status">{report.healthStatus}</Descriptions.Item>
                <Descriptions.Item label="Illnesses">{report.illnesses}</Descriptions.Item>
                <Descriptions.Item label="Allergies">{report.allergies}</Descriptions.Item>
              </Descriptions>
            ))
          ) : (
            <p>No health reports available.</p>
          )}
        </TabPane>

        {/* Education Tab */}
        <TabPane tab={<span><BookOutlined /> Education</span>} key="education">
          {child.academicReports && child.academicReports.length > 0 ? (
            child.academicReports.map((report, index) => (
              <Descriptions key={index} bordered column={1}>
                <Descriptions.Item label="Diploma">{report.diploma}</Descriptions.Item>
                <Descriptions.Item label="School Level">{report.schoolLevel}</Descriptions.Item>
                <Descriptions.Item label="GPA">{report.gpa}</Descriptions.Item>
                <Descriptions.Item label="Semester">{report.semester}</Descriptions.Item>
                <Descriptions.Item label="Academic Year">{report.academicYear}</Descriptions.Item>
                <Descriptions.Item label="Achievement">{report.achievement}</Descriptions.Item>
                <Descriptions.Item label="Subjects">
                  {report.subjectDetails && report.subjectDetails.length > 0 ? (
                    report.subjectDetails.map((subject, subIndex) => (
                      <div key={subIndex}>
                        {subject.subjectName}: {subject.score} ({subject.remarks})
                      </div>
                    ))
                  ) : (
                    <p>No subjects available.</p>
                  )}
                </Descriptions.Item>
              </Descriptions>
            ))
          ) : (
            <p>No academic reports available.</p>
          )}
        </TabPane>

        {/* Achievements Tab */}
        <TabPane tab={<span><SmileOutlined /> Achievements</span>} key="achievements">
          <p>Additional achievements or hobbies can be displayed here if available.</p>
        </TabPane>
      </Tabs>

      {/* Additional Images */}
      {child.imageUrls && child.imageUrls.length > 1 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Images</h3>
          <Space size="middle" wrap>
            {child.imageUrls.map((url, index) => (
              <Image
                key={index}
                width={100}
                src={url}
                alt={`Child image ${index + 1}`}
                className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            ))}
          </Space>
        </div>
      )}
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
    
    healthReports: PropTypes.arrayOf(
      PropTypes.shape({
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
    academicReports: PropTypes.arrayOf(
      PropTypes.shape({
        diploma: PropTypes.string,
        schoolLevel: PropTypes.string,
        gpa: PropTypes.number,
        semester: PropTypes.string,
        academicYear: PropTypes.string,
        achievement: PropTypes.string,
        subjectDetails: PropTypes.arrayOf(
          PropTypes.shape({
            subjectName: PropTypes.string,
            score: PropTypes.number,
            remarks: PropTypes.string,
          })
        ),
      })
    ),
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDetailsChildren;
