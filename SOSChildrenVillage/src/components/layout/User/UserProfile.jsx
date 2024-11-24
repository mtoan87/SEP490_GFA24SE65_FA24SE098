import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import UserDetail from "../../../pages/User/UserDetail";
import Footer from "../../../pages/Home/Footer/Footer";

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
