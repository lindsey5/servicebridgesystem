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

    const navigate = useNavigate();
    const [isShow, setShow] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    
    async function login(e) {
        e.preventDefault();
        try {
            const response = await fetch('/provider-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
                credentials: 'include'
            });
            const result = await response.json();

            if(result.errors){
                setUsernameError(result.errors.username || '');
                setPasswordError(result.errors.password || '');
            }
            if(response.ok){
                navigate('/Provider/Dashboard');
            }
            }catch (error) {
                alert(error);
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
                            <a href="" id="signup">Create an Account</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProviderLogin;
