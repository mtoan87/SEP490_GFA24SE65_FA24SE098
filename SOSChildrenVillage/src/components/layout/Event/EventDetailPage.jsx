import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import EventDetail from "../../../pages/EventPage/EventDetail";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <EventDetail />
            </main>
            <Footer />
        </div>
    );
};

export default App; // Export App instead of UserDetail
