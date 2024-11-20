import React from "react";
import Header from "../../../pages/Home/Header";
import Nav from "../../../pages/Home/Nav";
import Footer from "../../../pages/Home/Footer";
import BookingHistory from "../../../pages/BookingPage/BookingHistory";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <BookingHistory />
            </main>
            <Footer />
        </div>
    );
};

export default App;
