import './AdminLogin.css';
import padlockLogo from '../../assets/padlock.png';
import userLogo from '../../assets/user.png';

const AdminLogin = () => {
    return (
        <div className="admin-login">
            <div className='container'>
                <h1>Admin Login</h1>
                <div className='input-container'>
                    <div className='input-icon'>
                        <img src={userLogo} alt="" />
                    </div>
                    <input type="text" placeholder='Username'/>
                </div>
                <div className='input-container'>
                    <div className='input-icon'>
                        <img src={padlockLogo} alt="" />
                    </div>
                    <input type="password" placeholder='Password' />
                </div>
                <button>Log In</button>
            </div>
        </div>
    )
}

export default AdminLogin