import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
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
