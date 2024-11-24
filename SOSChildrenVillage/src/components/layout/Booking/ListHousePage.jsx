import Header from "../../../pages/Home/Header/Header";
import Nav from "../../../pages/Home/Nav/Nav";
import Footer from "../../../pages/Home/Footer/Footer";
import ListHouse from "../../../pages/BookingPage/ListHouse";

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <ListHouse />
            </main>
            <Footer />
        </div>
    );
};

export default App;
