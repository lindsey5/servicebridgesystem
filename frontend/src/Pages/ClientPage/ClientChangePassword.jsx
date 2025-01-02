import { useState } from 'react'
import '../styles/ChangePassword.css'

const CustomizedInput = ({placeholder, handleChange}) => {
    const [show, setShow] = useState(false);

    const handleFocus = (e) => {
        if(!e.target.classList.contains('has-value')){
            e.target.classList.add('has-value')
        }
    }

    const handleBlur = (e) => {
        if(!e.target.value) e.target.classList.remove('has-value')
    }

    return <div className='password-container'>
            <input type={show ? 'text' : 'password'} placeholder={placeholder} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/>
            <span>{placeholder}</span>
            <img src={`/icons/${show ? 'hide' : 'show'}.png`} alt="" onClick={() => setShow(!show)}/>
            </div>
}


const ClientChangePassword = () => {
    const goBack = () => {
        window.history.back();
    }

    return <div className="change-password-page">
        <img src="/icons/6538623.jpg" alt="" />
        <div className='container'>
            <h1>Change Password</h1>
            <CustomizedInput placeholder='Current Password'/>
            <CustomizedInput placeholder='New Password'/>
            <CustomizedInput placeholder='Confirm New Password'/>
            <div className='buttons'>
                <button className='back-btn' onClick={goBack}>Back</button>
                <button className='submit-btn'>Submit</button>
            </div>
        </div>

    </div>
}

export default ClientChangePassword