import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import VillageDetails from "../../../pages/VillageDetail/VillageDetails";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <VillageDetails />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
