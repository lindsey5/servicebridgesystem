import userLogo from '../../assets/user.png';
import serviceLogo from '../../assets/service.png';
import unlockLogo from '../../assets/unlock.png';
import padlockLogo from '../../assets/padlock.png';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const ClientLogin = () => {
    useEffect(() => {
        document.title = "Client Login | Hustle";
    },[]);

    const navigate = useNavigate(); // Hook for navigation
    // State to manage the visibility of password
    const [isShow, setShow] = useState(false);
    // State to hold the username and password input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // State to hold error messages for username and password validation
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    
    // Async function to handle user login
    async function login(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            // Send a POST request to the client login endpoint
            const response = await fetch('http://localhost:3000/client-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicate that the request body is JSON
                },
                body: JSON.stringify({
                    username, // Include the username from state
                    password // Include the password from state
                }),
                credentials: 'include' // Include cookies in the request for session management
            });
            
            // Parse the JSON response
            const result = await response.json();
    
            // Check for validation errors in the response
            if (result.errors) {
                setUsernameError(result.errors.username || ''); // Set username error message if present
                setPasswordError(result.errors.password || ''); // Set password error message if present
            }
            // If the response is OK, navigate to the client home page
            if (response.ok) {
                navigate('/Client/Home'); // Redirect the user to the home page
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
                        <h1>Client Login</h1>
                        <div className="input-container">
                            <span className="input-icon">
                                <img src={userLogo} alt="User Icon" /> 
                            </span>
                            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                            <p id="usernameError" className="error">{usernameError}</p>
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
                            <a href="/Client/Signup" id="signup">Create an Account</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClientLogin;
