import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import UserDetail from "../../../pages/User/UserDetail";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <UserDetail />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
