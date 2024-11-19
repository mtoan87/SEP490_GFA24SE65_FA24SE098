import React from "react";
import Header from "../../components/layout/HomePage/Header";
import Nav from "../../components/layout/HomePage/Nav";
import UserDetail from "../../components/layout/User/UserDetail";
import Footer from "../../components/layout/HomePage/Footer";
import ChangePassword from "../../components/layout/User/ChangePassword";

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
