import userLogo from '../../assets/user.png';
import serviceLogo from '../../assets/service.png';
import unlockLogo from '../../assets/unlock.png';
import padlockLogo from '../../assets/padlock.png';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const ProviderLogin = () => {
    useEffect(() => {
        document.title = "Provider Login | Hustle";
    },[]);

    const navigate = useNavigate(); // Hook for navigation
    // State to manage the visibility of password
    const [isShow, setShow] = useState(false);
    // State to hold the email and password input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State to hold error messages for email and password validation
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    
    // Async function to handle user login
    async function login(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            // Send a POST request to the provider login endpoint
            const response = await fetch('/provider-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicate that the request body is JSON
                },
                body: JSON.stringify({
                    email, // Include the email from state
                    password // Include the password from state
                }),
                credentials: 'include' // Include cookies in the request for session management
            });
            
            // Parse the JSON response
            const result = await response.json();
            // Check for validation errors in the response
            if (result.errors) {
                setEmailError(result.errors.email || ''); // Set email error message if present
                setPasswordError(result.errors.password || ''); // Set password error message if present
            }
            // If the response is OK, navigate to the client home page
            if (response.ok) {
                navigate('/Provider/Dashboard'); // Redirect the provider dashboard
            }
        } catch (error) {
            // Handle any errors that occur during the fetch
            alert(error); // Display the error message
        }
    }

    return (
        <div className='login-parent-container'>
            <div className="container">
                <div className="icon-container">
                    <img src={serviceLogo} alt="Service Logo" />
                </div>
                <form onSubmit={login}>
                    <div className="right-div">
                        <h1>Provider Login</h1>
                        <div className="input-container">
                            <span className="input-icon">
                                <img src={userLogo} alt="User Icon" /> 
                            </span>
                            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <p className="error">{emailError}</p>
                        </div>

                        <div className="input-container">
                            <div className="check-box-container">
                                <span className="check-box-icon"  onClick={() => setShow(!isShow)}>
                                    <img src={isShow ? unlockLogo : padlockLogo} alt="Lock Icon" />
                                </span> 
                            </div>
                            <input type={isShow ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                            <p id="passwordError" className="error">{passwordError}</p>
                        </div>

                        <input type="submit" id="login-btn" value="Log In"/>

                        <div className='links'>
                            <a href="" id="forgot-pass">Forgot Password?</a>
                            <a href="/Provider/Signup" id="signup">Create an Account</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProviderLogin;
