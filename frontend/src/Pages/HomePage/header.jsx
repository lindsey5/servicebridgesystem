import './header.css';
import { useState } from 'react';

const Header = ({ showLoginModal, showSignupModal }) => {
    const [showNav, setShowNav] = useState(false);
    return (
        <header className='home-header'>
            <h1><a href="#home" className='title'>Hustle</a></h1>
            <button className="nav-button" onClick={() => setShowNav(!showNav)}>
                <img className="nav-icon" src="/icons/menu.png" alt="Menu Icon" />
                <div className='nav-dropdown' style={{display: showNav ? 'flex' : 'none'}}>   
                    <a href="#home">Home</a>
                    <a href="#services">Services</a>
                    <a href="#"className="login" onClick={showLoginModal}>Login</a>
                    <a href="#" className="signup" onClick={showSignupModal}>Signup</a>
                </div>
            </button>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#" className="login" onClick={showLoginModal}>Login</a></li>
                <li><a href="#" className="login" onClick={showSignupModal}>Signup</a></li>
            </ul>
        </header>
    );
}

export default Header;
