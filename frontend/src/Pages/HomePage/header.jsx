import './header.css';
import { useState } from 'react';

const Header = ({ showLoginModal, showSignupModal }) => {
    const [showNav, setShowNav] = useState(false);

    const scrollToHome = () => {
        document.getElementById('home').scrollIntoView({
            behavior: 'smooth', 
            block: 'start', 
        })
    }

    return (
        <header className='home-header'>
            <h1 onClick={scrollToHome}>Hustle</h1>
            <button className="nav-button" onClick={() => setShowNav(!showNav)}>
                <img className="nav-icon" src="/icons/menu.png" alt="Menu Icon" />
                <div className='nav-dropdown' style={{display: showNav ? 'flex' : 'none'}}>   
                    <a href="#home">Home</a>
                    <a href="#"className="login" onClick={showLoginModal}>Login</a>
                    <a href="#" className="signup" onClick={showSignupModal}>Signup</a>
                </div>
            </button>
            <ul>
                <li onClick={scrollToHome}>Home</li>
                <li onClick={showLoginModal}>Login</li>
                <li onClick={showSignupModal}>Sign up</li>
            </ul>
        </header>
    );
}

export default Header;
