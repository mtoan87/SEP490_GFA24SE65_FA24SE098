import React from 'react';
import { Layout, Typography, Divider, Image } from 'antd';
import './History.css'; // Ensure the CSS file path is correct

const { Title, Paragraph, Text } = Typography;

const HistoryPage = () => {
  return (
    <>
      {/* Content container1: Image and History */}
      <div className="content-container1">
        <div className="image-container1">
          <Image
            src="https://sosvietnam.org/getmedia/6d39223f-815f-4206-add5-beba9f750761/Asia_Jordan_HGA-Archives_Alexander_Gabriel_42-Jordanien-3-1984_1.jpg?width=1920"
            alt="Hermann Gmeiner with children"
          />
        </div>
        <div className="text-container1">
          <Title className="title">History</Title>
          <Paragraph className="paragraph">
            Hermann Gmeiner, the founder of SOS Children's Villages, once said:{" "}
            <i>
              "All great things in life can only become a reality when someone does more than what they have to do."
            </i>
          </Paragraph>
          <Paragraph className="paragraph">
            After 70 years, this vision has become a reality, with SOS Children's Villages in 136 countries and territories, helping over 4 million children worldwide.
          </Paragraph>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Development Journey Section */}
      <div className="journey-container1">
        <Title level={3} style={{ color: '#000', fontSize: '40px', textAlign: "center" }}>
          Development Journey
        </Title>
        <Paragraph style={{ color: '#595959', fontSize: '30px', padding: '0px 400px' }}>
          Starting as an orphan with only 600 Austrian Schillings (about 40 USD), Dr. Hermann Gmeiner called on friends to donate and build the first SOS Children's Village to help orphaned children after World War II in 1949.
        </Paragraph>
        <Paragraph style={{ color: '#595959', fontSize: '30px', padding: '0px 400px' }}>
          His life was dedicated to creating a family-based child care model, which included four key elements: a mother, a home, siblings, and a village...
        </Paragraph>
      </div>

      {/* Divider */}
      <Divider />

      {/* Timeline Section */}
      <div className="timeline-container1">
        <Title level={3} style={{ fontSize: '40px', color: '#000', textAlign: 'center' }}>
          SOS Children's Villages in Vietnam Through the Years
        </Title>
        <div style={{ margin: '0 auto', maxWidth: '800px', textAlign: 'left' }}>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1968:</Text>{" "}
            SOS Children's Villages established in Go Vap and Da Lat.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1976:</Text>{" "}
            SOS Children's Villages forced to close in Vietnam.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1987:</Text>{" "}
            One year after Hermann Gmeiner's death, Helmut Kutin, from the first SOS Village in Austria, signed an agreement with the Ministry of Labor, Invalids, and Social Affairs to re-establish SOS Children's Villages in Vietnam.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1989:</Text>{" "}
            SOS Children's Village Da Lat, Lam Dong, inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1990:</Text>{" "}
            SOS Children's Village Go Vap, Ho Chi Minh City, and Hanoi inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1991:</Text>{" "}
            SOS Children's Village Vinh, Nghe An inaugurated, and the SOS Kindergarten Da Lat opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1993:</Text>{" "}
            Hermann Gmeiner Schools in Da Lat and Go Vap inaugurated, and the SOS Kindergarten in Vinh opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1994:</Text>{" "}
            SOS Children's Village Da Nang inaugurated, along with Hermann Gmeiner Schools in Hanoi and Vinh.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1995:</Text>{" "}
            SOS Kindergarten Da Nang opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1997:</Text>{" "}
            SOS Children's Village Hai Phong and SOS Kindergarten Hai Phong inaugurated, and SOS Children's Village Ca Mau and Kindergarten Ca Mau opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1998:</Text>{" "}
            Hermann Gmeiner School Da Nang inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1999:</Text>{" "}
            National Training Center in Hanoi opened, SOS Children's Village Viet Tri and Kindergarten Viet Tri inaugurated, and SOS Children's Villages in Nha Trang and Ben Tre established.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2000:</Text>{" "}
            Hermann Gmeiner Schools in Hai Phong and Viet Tri opened, and SOS Kindergartens in Nha Trang and Ben Tre inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2001:</Text>{" "}
            Hermann Gmeiner Schools in Ben Tre and Ca Mau inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2002:</Text>{" "}
            Hermann Gmeiner School in Nha Trang inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2006:</Text>{" "}
            SOS Children's Villages in Thanh Hoa and Dong Hoi, Quang Binh inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2007:</Text>{" "}
            SOS Kindergartens in Dong Hoi and Thanh Hoa opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2009:</Text>{" "}
            SOS Children's Village Dien Bien Phu inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2010:</Text>{" "}
            Hermann Gmeiner School Thanh Hoa inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2011:</Text>{" "}
            SOS Kindergarten Dien Bien opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2012:</Text>{" "}
            SOS Children's Village Quy Nhon and Kindergarten Quy Nhon inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2014:</Text>{" "}
            SOS Children's Village Pleiku and Hermann Gmeiner School Dien Bien Phu inaugurated.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2015:</Text>{" "}
            SOS Children's Village Thai Binh inaugurated and SOS Kindergarten Pleiku and Thai Binh opened.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2017:</Text>{" "}
            After 30 years, SOS Children's Villages in Vietnam became the third largest in terms of number of villages and children helped, after India and Brazil.
          </Paragraph>
        </div>
      </div>

      {/* Content container1: Images */}
      <div className="content-container1">
        <div className="image-container1">
          <Image
            src="https://sosvietnam.org/getmedia/53378eb3-e6c6-4cf1-b832-d5c0c9c934cc/Hermann-Gmeiner-2.jpg?amp;height=300&width=425"
            alt="Hermann Gmeiner"
          />
          <div>
            <Text style={{ fontSize: '1.5rem' }}>
              Founder of SOS Children's Villages International
            </Text>
            <div style={{ fontSize: '1.5rem' }}>
              Hermann Gmeiner
            </div>
          </div>
        </div>
        <div className="image-container1">
          <Image
            src="https://sosvietnam.org/getmedia/15ec17b8-37dd-44f3-9916-01667ae58784/Hoang-The-Thien-01.jpg?amp;height=285&width=425"
            alt="Helmut Kutin"
          />
          <div>
            <Text style={{ fontSize: '1.5rem' }}>
              Honorary President of SOS Children's Villages International
            </Text>
            <div style={{ fontSize: '1.5rem' }}>
              Helmut Kutin
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
