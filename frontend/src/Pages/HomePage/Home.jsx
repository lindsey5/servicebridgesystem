import logo from '../../assets/Grow-your-workforce4.jpg';
import SignupModal from '../../modals/SignupModal.jsx';
import LoginModal from '../../modals/LoginModal.jsx';
import Header from './header.jsx';
import useModal from '../../hooks/useModal.jsx';
import './Home.css';
import Services from '../Components/Services/Services.jsx';
import { useState, useEffect, useRef } from 'react';

const Home = () => {
    const { isVisible: showLogin , show: showLoginModal, hide: hideLoginModal } = useModal();
    const { isVisible: showSignup, show: showSignupModal, hide: hideSignupModal} = useModal();
    const elementsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
          },
          { threshold: 0.3 }
        );
    
        elementsRef.current.forEach((el) => {
            if (el) {
              observer.observe(el);
            }
          });
        return () => observer.disconnect();
      }, []);


    return (
        <main>
            <Header showLoginModal={showLoginModal} showSignupModal={showSignupModal}/>
            <LoginModal show={showLogin} hideModal={hideLoginModal}/>
            <SignupModal show={showSignup} hideModal={hideSignupModal}/>
            <section className='Home' ref={el => elementsRef.current[0] = el}>
                <div className='textDiv'>
                <h1>Empowering Your Hustle, Bridging Your Future!</h1>
                <p>Hustle serves as a vital bridge, connecting skilled individuals with those in need of their unique services</p>
                    <button className='signup-btn' onClick={showSignupModal}>Sign Up</button>
                    <button className='login-btn' onClick={showLoginModal}>Log In</button>
                </div>
                <img className='homeLogo' src={ logo }></img> 
            </section>
            <section className='how-it-work-section' ref={el => elementsRef.current[1] = el}>
                <img src='/icons/logo.jpg'/> 
                <div className="how-it-work-container">
                        <h1>How it works</h1>
                        <div>
                            <div className="number">1</div>
                            <p>Explore Available Services</p>
                        </div>
                        <div>
                            <div className="number">2</div>
                            <p>Find Service Provider</p>
                        </div>
                        <div>
                            <div className="number">3</div>
                            <p>Book Your Appointment</p>
                        </div>
                        <div>
                            <div className="number">4</div>
                            <p>Track Appointment Status</p>
                        </div>
                        <div>
                            <div className="number">5</div>
                            <p>Receive the service as scheduled</p>
                        </div>
                        <div>
                            <div className="number">6</div>
                            <p>Give Feedback</p>
                        </div>
                </div>
            </section>
            <Services showLoginModal={showLoginModal}/>
            <footer className='home-footer'>
                <div>
                    <div className='footer-logo'>
                        <img src="/icons/logo4.jpg"/>
                    </div>
                    <div className='about-div'>
                        <h3>About</h3>
                        <li>About us</li>
                        <li>News</li>
                        <li>Terms of service</li>
                        <li>Services</li>
                    </div>
                    <div className='social-div'>
                        <h3>Social Media</h3>
                        <li>Facebook</li>
                        <li>Instagram</li>
                        <li>LinkedIn</li>
                        <li>Github</li>
                    </div>
                    <div className='support-div'>
                        <h3>Support</h3>
                        <li>Help</li>
                        <li>Privacy Policy</li>
                        <li>FAQs</li>
                    </div>
                    <div className='contact-div'>
                        <h3>Contact</h3>
                        <li>Taguig City, Philippines</li>
                        <li>hussle@example.com</li>
                        <li>+63-9505505306</li>
                    </div>
                </div>
                <h2>© 2024 Hustle Inc. All rights reserved.</h2>
            </footer>
        </main>
    );
}

export default Home;