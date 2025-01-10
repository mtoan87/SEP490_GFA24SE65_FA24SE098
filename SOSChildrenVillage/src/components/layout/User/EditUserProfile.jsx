import React from "react";
import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import EditUserDetail from "../../../pages/User/EditUserDetail";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <EditUserDetail />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
