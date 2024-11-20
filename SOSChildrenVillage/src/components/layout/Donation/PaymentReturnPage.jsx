import React from 'react';
import Header from '../../../pages/Home/Header';
import Nav from '../../../pages/Home/Nav';
import Footer from '../../../pages/Home/Footer';
import PaymentReturnPage from '../../../pages/Donates/PaymentReturn';

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
