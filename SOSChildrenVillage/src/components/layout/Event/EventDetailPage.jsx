import React from "react";
import Header from "../../../pages/Home/Header";
import Nav from "../../../pages/Home/Nav";
import Footer from "../../../pages/Home/Footer";
import EventDetail from "../../../pages/EventPage/EventDetail";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <EventDetail />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
