import React from "react";
import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import VillageHistory from "../../../pages/User/VillageHistory";

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
