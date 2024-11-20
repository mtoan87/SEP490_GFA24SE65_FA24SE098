import React from "react";
import Header from "../../../pages/Home/Header";
import Nav from "../../../pages/Home/Nav";
import Footer from "../../../pages/Home/Footer";
import ListHouse from "../../../pages/BookingPage/ListHouse";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <ListHouse />
            </main>
            <Footer />
        </div>
    );
};

export default App;
