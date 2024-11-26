import { Layout, BackTop } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import Header from '../../../pages/Home/Header/Header';
import Nav from '../../../pages/Home/Nav/Nav';
import AboutUs from '../../../pages/Home/AboutUs/AboutUs';
import HeroSection from '../../../pages/Home/HeroSection/HeroSection';
import InfoSection from '../../../pages/Home/InfoSection/InfoSection';
import Footer from '../../../pages/Home/Footer/Footer';

const { Content } = Layout;

const HomePage = () => {
    return (
        <Layout className="min-h-screen">
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <Header />
                <Nav />
            </div>

            <Content className="flex-1">
                <section className="min-h-[calc(100vh-80px)] flex items-center">
                    <HeroSection />
                </section>

                <section id="about" className="py-16 bg-gray-50">
                    <AboutUs />
                </section>

                <section id="info" className="py-16">
                    <InfoSection />
                </section>
            </Content>

            <Footer />

            <BackTop>
                <div className="back-to-top">
                    <UpOutlined />
                </div>
            </BackTop>

        </Layout>
    );
};

export default HomePage;
