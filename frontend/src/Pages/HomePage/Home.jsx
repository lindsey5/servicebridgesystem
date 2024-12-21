import logo from '../../assets/Grow-your-workforce4.jpg';
import SignupModal from '../../modals/SignupModal.jsx';
import LoginModal from '../../modals/LoginModal.jsx';
import Header from './header.jsx';
import useModal from '../../hooks/useModal.jsx';
import './Home.css';
import Services from '../Components/Services/Services.jsx';
import { useEffect, useRef } from 'react';

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
          { threshold: 0.1 }
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
            <section id='home' className='Home' ref={el => elementsRef.current[0] = el}>
                <div className='textDiv'>
                    <h1 className='tagline' ref={el => elementsRef.current[2] = el}>Empowering Your Hustle, Bridging Your Future!</h1>
                    <p className='platform' ref={el => elementsRef.current[3] = el}>Hustle serves as a vital bridge, connecting skilled individuals with those in need of their unique services</p>
                <button className='signup-btn' ref={el => elementsRef.current[4] = el} onClick={showSignupModal}>Sign Up</button>
                <button className='login-btn' ref={el => elementsRef.current[5] = el}onClick={showLoginModal}>Log In</button>
                </div>
                <img className='homeLogo' src={ logo }></img> 
            </section>
            <section className='how-it-work-section' ref={el => elementsRef.current[6] = el}>
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
            <section className='about' ref={el => elementsRef.current[7] = el}>
                <div>
                    <h1>About Hustle</h1>
                    <p>Hustle is a fast and reliable platform that connects individuals and businesses with skilled professionals across a wide range of services, including automotive services, cleaning, tutoring, and more. We make it simple to find the right expert for the job, whenever you need them.</p>
                    <p>Our mission is to connect those in need of services with skilled individuals offering affordable, high-quality solutions, while providing flexible job opportunities for students, freelancers, and unemployed individuals to showcase their skills.</p>
                </div>
                <img src="/icons/plumbing.webp" alt="" />
            </section>
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