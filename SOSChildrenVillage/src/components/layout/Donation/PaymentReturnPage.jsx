import Header from '../../../pages/Home/Header/Header';
import Nav from '../../../pages/Home/Nav/Nav';
import Footer from '../../../pages/Home/Footer/Footer';
import PaymentReturnPage from '../../../pages/Donates/PaymentReturn';

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <PaymentReturnPage />
            </main>
            <Footer />
        </div>
    );
};

export default App;
