import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import HouseDetails from "../../../pages/HouseDetail/HouseDetails";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <HouseDetails />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
