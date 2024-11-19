import React from "react";
import Header from "../../components/layout/HomePage/Header";
import Nav from "../../components/layout/HomePage/Nav";
import UserDetail from "../../components/layout/User/UserDetail";
import Footer from "../../components/layout/HomePage/Footer";
import ListHouse from "../../components/layout/Booking/ListHouse";

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
