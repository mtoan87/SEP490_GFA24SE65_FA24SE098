import Header from '../../../pages/Home/Header';
import Nav from '../../../pages/Home/Nav';
import HeroSection from '../../../pages/Home/HeroSection';
import InfoSection from '../../../pages/Home/InfoSection';
import Footer from '../../../pages/Home/Footer';

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <HeroSection />
                <InfoSection />
            </main>
            <Footer />
        </div>
    );
};

export default App;
