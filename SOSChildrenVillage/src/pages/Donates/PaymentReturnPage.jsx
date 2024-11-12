import React from 'react';
import Header from '../../components/layout/HomePage/Header';
import Nav from '../../components/layout/HomePage/Nav';
import HeroSection from '../../components/layout/HomePage/HeroSection';
import InfoSection from '../../components/layout/HomePage/InfoSection';
import Footer from '../../components/layout/HomePage/Footer';
import DonateNow from '../../components/layout/Donation/DonateNow';
import PaymentReturnPage from '../../components/layout/Donation/PaymentReturn';

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <PaymentReturnPage />
            </main>
            <Footer />
        </div>
    );
};

export default App;
