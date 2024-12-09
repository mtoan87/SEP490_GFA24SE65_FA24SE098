import React from 'react';
import { Layout, Typography, Divider, Image } from 'antd';
import './History.css'; // Đảm bảo đường dẫn đến tệp CSS chính xác

const { Title, Paragraph, Text } = Typography;

const HistoryPage = () => {
  return (
    <>
      {/* Content Container: Image and History */}
      <div className="content-container">
        <div className="image-container">
          <Image
            src="https://sosvietnam.org/getmedia/6d39223f-815f-4206-add5-beba9f750761/Asia_Jordan_HGA-Archives_Alexander_Gabriel_42-Jordanien-3-1984_1.jpg?width=1920"
            alt="Hermann Gmeiner with children"
          />
        </div>
        <div className="text-container">
          <Title className="title">Lịch sử</Title>
          <Paragraph className="paragraph">
            Ngài Hermann Gmeiner - người sáng lập nên Làng trẻ em SOS đã từng nói:{" "}
            <i>
              "Tất cả mọi việc lớn trên đời chỉ có thể trở thành hiện thực khi có
              ai đó làm nhiều hơn những việc mà họ phải làm."
            </i>
          </Paragraph>
          <Paragraph className="paragraph">
            Đến nay sau 70 năm, việc lớn đó đã trở thành hiện thực với Làng trẻ em
            SOS tại 136 quốc gia và vùng lãnh thổ, đã và đang giúp đỡ hơn 4 triệu
            trẻ em trên toàn thế giới.
          </Paragraph>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Development Journey Section */}
      <div className="journey-container">
        <Title level={3} style={{ color: '#000', fontSize: '40px', textAlign: "center" }}>
          Hành trình xây dựng và phát triển
        </Title>
        <Paragraph style={{ color: '#595959', fontSize: '30px', padding: '0px 400px' }}>
          Xuất thân là một trẻ mồ côi mẹ và chỉ từ 600 Schillings Áo (40 Đô la
          Mỹ), tiến sỹ Hermann Gmeiner đã kêu gọi bạn bè quyên góp và xây dựng
          Làng trẻ em SOS đầu tiên để cứu giúp những trẻ em mồ côi sau chiến tranh
          thế giới lần thứ 2 vào năm 1949.
        </Paragraph>
        <Paragraph style={{ color: '#595959', fontSize: '30px', padding: '0px 400px' }}>
          Sau đó cuộc đời của ông gắn liền với mong ước về một trung tâm gia đình chăm sóc trẻ em dựa trên 4 yếu tố: một người mẹ, một ngôi nhà, anh chị em và một ngôi làng...
        </Paragraph>
      </div>

      {/* Divider */}
      <Divider />

      {/* Timeline Section */}
      <div className="timeline-container">
        <Title level={3} style={{ fontSize: '40px', color: '#000', textAlign: 'center' }}>
          Làng trẻ em SOS Việt Nam qua các năm
        </Title>
        <div style={{ margin: '0 auto', maxWidth: '800px', textAlign: 'left' }}>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1968:</Text>{" "}
            Làng trẻ em SOS tại Gò Vấp và Đà Lạt được thành lập.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1976:</Text>{" "}
            Làng trẻ em SOS buộc phải đóng cửa tại Việt Nam.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1987:</Text>{" "}
            1 năm sau khi ông Hermann Gmeiner qua đời, Làng trẻ em SOS Quốc tế do ông Helmut Kutin - người con của Làng trẻ em SOS đầu tiên tại Áo - làm chủ tịch đã ký hiệp định với Bộ Lao động Thương binh và Xã hội để thành lập Làng trẻ em SOS Việt Nam, một trong những tổ chức nhân đạo đầu tiên quay trở lại Việt Nam.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1989:</Text>{" "}
            Khánh thành Làng trẻ em SOS Đà Lạt, Lâm Đồng.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1990:</Text>{" "}
            Khánh thành Làng trẻ em SOS Gò Vấp, Tp. Hồ Chí Minh và Làng trẻ em SOS
            Hà Nội.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1991:</Text>{" "}
            Khánh thành Làng trẻ em SOS Vinh, Nghệ An. Trường mẫu giáo SOS Đà Lạt được đưa vào sử dụng.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1993:</Text>{" "}
            Khánh thành trường Hermann Gmeiner Đà Lạt. Khánh thành trường Hermann Gmeiner Gò Vấp và trường mẫu giáo SOS Gò Vấp. Trường mẫu giáo SOS Vinh được đưa vào sử dụng
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1994:</Text>{" "}
            Khánh thành Làng trẻ em SOS Đà Nẵng, khánh thành trường Hermann Gmeiner Hà Nội và trường Hermann Gmeiner Vinh, Nghệ An.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1995:</Text>{" "}
            Trường mẫu giáo SOS Đà Nẵng được đưa vào sử dụng
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1997:</Text>{" "}
            Khánh thành Làng trẻ em SOS Hải Phòng và trường mẫu giáo SOS Hải Phòng; khánh thành Làng trẻ em SOS Cà Mau và trường mẫu giáo SOS Cà Mau.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1998:</Text>{" "}
            Khánh thành trường Hermann Gmeiner Đà Nẵng.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>1999:</Text>{" "}
            Khánh thành Trung tâm đào tạo quốc gia tại Hà Nội, khánh thành Làng trẻ em SOS Việt Trì ở Phú Thọ và trường mẫu giáo SOS Việt Trì. Khánh thành Làng trẻ em SOS Nha Trang, Khánh Hoà và Làng trẻ em SOS Bến Tre.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2000:</Text>{" "}
            Khánh thành trường Hermann Gmeiner Hải Phòng và trường Hermann Gmeiner Việt Trì, Phú Thọ. Trường mẫu giáo SOS Nha Trang và trường mẫu giáo SOS Bến Tre được đưa vào sử dụng
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2001:</Text>{" "}
            Khánh thành trường Hermann Gmeiner Bến Tre và trường Hermann Gmeiner Cà Mau
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2002:</Text>{" "}
            Khánh thành trường Hermann Gmeiner Nha Trang, Khánh Hòa
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2006:</Text>{" "}
            Khánh thành Làng trẻ em SOS Thanh Hoá và Làng trẻ em SOS Đồng Hới, Quảng Bình.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2007:</Text>{" "}
            Trường mẫu giáo SOS Đồng Hới và trường mẫu giáo SOS Thanh Hóa được đưa vào sử dụng.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2009:</Text>{" "}
            Khánh thành Làng trẻ em SOS Điện Biên Phủ, tỉnh Điện Biên.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2010:</Text>{" "}
            Khánh thành trường Hermann Gmeiner Thanh Hóa
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2011:</Text>{" "}
            Trường mẫu giáo SOS Điện Biên được đưa vào sử dụng
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2012:</Text>{" "}
            Khánh thành Làng trẻ em SOS Quy Nhơn và mẫu giáo SOS Quy Nhơn, Bình Định.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2014:</Text>{" "}
            Khánh thành Làng trẻ em SOS Pleiku, Gia Lai và khánh thành trường Hermann Gmeiner Điện Biên Phủ, Điện Biên
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2015:</Text>{" "}
            Khánh thành Làng trẻ em SOS Thái Bình. Tiếp nhận Làng trẻ em SOS Huế do Hội giúp đỡ trẻ em Việt Nam tại Pháp bàn giao . Trường mẫu giáo SOS Pleiku và mẫu giáo SOS Thái Bình được đưa vào sử dụng.
          </Paragraph>
          <Paragraph style={{ fontSize: '20px', color: '#000' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>2017:</Text>{" "}
            Sau 30 năm ngày ký Hiệp định giữa Bộ Lao động-Thương binh và Xã hội và Làng trẻ em SOS Quốc tế, Làng trẻ em SOS Việt Nam đã có bước phát triển nhanh chóng, trở thành quốc gia có số lượng Làng trẻ em SOS và số trẻ hưởng lợi đứng thứ 3 trong 135 quốc gia và vùng lãnh thổ sau Ấn Độ và Brazil.
          </Paragraph>
        </div>
      </div>
      <div className="content-container">
        <div className="image-container">
          <Image
            src="https://sosvietnam.org/getmedia/53378eb3-e6c6-4cf1-b832-d5c0c9c934cc/Hermann-Gmeiner-2.jpg?amp;height=300&width=425"
            alt="Hermann Gmeiner with children"
          />
          <div>
            <Text style={{ fontSize: '1.5rem' }}>
              Người sáng lập Làng trẻ em SOS Quốc tế
            </Text>
            <div style={{ fontSize: '1.5rem' }}>
              Ngài Hermann Gmeiner
            </div>
          </div>
        </div>
        <div className="image-container">
          <Image
            src="https://sosvietnam.org/getmedia/15ec17b8-37dd-44f3-9916-01667ae58784/Hoang-The-Thien-01.jpg?amp;height=285&width=425"
            alt="Hermann Gmeiner with children"
          />
          <div>
            <Text style={{ fontSize: '1.5rem' }}>
              Chủ tịch danh dự Làng trẻ em SOS Quốc tế Helmut Kutin
            </Text>
            <div style={{ fontSize: '1.5rem' }}>
              ký hiệp định hợp tác với bộ LÐTBXH ngày 22/12/1987
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
