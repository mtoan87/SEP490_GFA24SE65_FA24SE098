import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import Transparency from "../../../pages/TransparencyPage/Transparency";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <Transparency />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
