import React from 'react';
import Header from '../../../pages/Home/Header';
import Nav from '../../../pages/Home/Nav';
import Footer from '../../../pages/Home/Footer';
import DonateNow from '../../../pages/Donates/DonateNow';

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <DonateNow />
            </main>
            <Footer />
        </div>
    );
};

export default App;
