import React from "react";
import Header from "../../components/layout/HomePage/Header";
import Nav from "../../components/layout/HomePage/Nav";
import UserDetail from "../../components/layout/User/UserDetail";
import Footer from "../../components/layout/HomePage/Footer";
import VillageHistory from "../../components/layout/User/VillageHistory";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <VillageHistory />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
