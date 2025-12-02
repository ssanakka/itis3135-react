import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <div id="mainTop">
                <h1>ITIS-3135 | Sumanth Sanakkayala's | Simple Seal</h1>
            </div>
            <nav>
                <ul className="nav-items">
                    <li className="nav-item"><Link to="/">Home</Link></li>
                    <li className="nav-item">|</li>
                    <li className="nav-item"><Link to="/introduction">Introduction</Link></li>
                    <li className="nav-item">|</li>
                    <li className="nav-item"><Link to="/contract">Contract</Link></li>
                    <li className="nav-item">|</li>
                    <li className="nav-item"><Link to="/student-introductions">Student Introductions</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;