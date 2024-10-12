import './header.css';

const Header = ({ showLoginModal, showSignupModal }) => {
    return (
        <header className='home-header'>
            <h1><a href="#home" className='title'>Hustle</a></h1>
            <button className="nav-button">
                <img className="nav-icon" src="/icons/hamburger-menu.svg" alt="Menu Icon" />
            </button>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#" className="login" onClick={showLoginModal}>Login</a></li>
                <li><a href="#" className="signup" onClick={showSignupModal}>Signup</a></li>
            </ul>
        </header>
    );
}

export default Header;
