import logo from '../../assets/Grow-your-workforce4.jpg';
import SignupModal from '../../modals/SignupModal.jsx';
import LoginModal from '../../modals/LoginModal.jsx';
import Header from './header.jsx';
import useModal from '../../hooks/useModal.jsx';
import './Home.css';
import Services from '../Components/Services/Services.jsx';

const Home = () => {
    const { isVisible: showLogin , show: showLoginModal, hide: hideLoginModal } = useModal();
    const { isVisible: showSignup, show: showSignupModal, hide: hideSignupModal} = useModal();

    return (
        <>
            <Header showLoginModal={showLoginModal} showSignupModal={showSignupModal}/>
            <LoginModal show={showLogin} hideModal={hideLoginModal}/>
            <SignupModal show={showSignup} hideModal={hideSignupModal}/>
            <section className='Home' id='home'>
                <div className='textDiv'>
                <h1>Empowering Your Hustle, Bridging Your Future!</h1>
                <p>Hustle connects skilled people with those who need their services, creating opportunities for both growth and convenience..</p>
                    <button className='signup-btn' onClick={showSignupModal}>Sign Up</button>
                    <button className='login-btn' onClick={showLoginModal}>Log In</button>
                </div>
                <img className='homeLogo' src={ logo }></img> 
            </section>
            <Services showLoginModal={showLoginModal}/>
        </>
    );
}

export default Home;