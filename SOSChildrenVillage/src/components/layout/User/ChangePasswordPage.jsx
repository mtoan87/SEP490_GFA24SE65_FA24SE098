import React from "react";
import Header from "../../../pages/Home/Header";
import Nav from "../../../pages/Home/Nav";
import UserDetail from "../../../pages/User/UserDetail";
import Footer from "../../../pages/Home/Footer";
import ChangePassword from "../../../pages/User/ChangePassword";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <ChangePassword />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
