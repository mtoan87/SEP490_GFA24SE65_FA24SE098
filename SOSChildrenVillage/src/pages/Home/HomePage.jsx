import React from 'react';
import Header from '../../components/layout/HomePage/Header';
import Nav from '../../components/layout/HomePage/Nav';
import HeroSection from '../../components/layout/HomePage/HeroSection';
import InfoSection from '../../components/layout/HomePage/InfoSection';

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <HeroSection />
                <InfoSection />
            </main>
        </div>
    );
};

export default App;
