import Header from '../../../pages/Home/Header/Header';
import Nav from '../../../pages/Home/Nav/Nav';
import Footer from '../../../pages/Home/Footer/Footer';
import DonateNow from '../../../pages/Donates/DonateNow';

const App = () => {
    return (
        <div>
            <Header />
            <Nav />
            <main>
                <DonateNow />
            </main>
            <Footer />
        </div>
    );
};

export default App;
