import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import BookingHistory from "../../../pages/BookingPage/BookingHistory";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <BookingHistory />
            </main>
            <Footer />
        </div>
    );
};

export default App;
