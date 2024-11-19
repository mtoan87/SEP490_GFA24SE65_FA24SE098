import React from "react";
import Header from "../../components/layout/HomePage/Header";
import Nav from "../../components/layout/HomePage/Nav";
import Footer from "../../components/layout/HomePage/Footer";
import BookingHistory from "../../components/layout/Booking/BookingHistory";

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
