import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import ChildrenDetails from "../../../pages/ChildrenDetail/ChildrenDetails";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <ChildrenDetails />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
