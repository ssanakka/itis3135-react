import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Contract from './pages/Contract';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/introduction" element={<Introduction />} />
                        <Route path="/contract" element={<Contract />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;