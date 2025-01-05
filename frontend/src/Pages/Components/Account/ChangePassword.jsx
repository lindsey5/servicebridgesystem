import { useState } from 'react'
import '../../styles/ChangePassword.css'
import BubbleCursor from '../BubbleCursor';

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
            <input type={show ? 'text' : 'password'} placeholder={placeholder} onChange={(e) => handleChange(e.target.value)} onFocus={handleFocus} onBlur={handleBlur}/>
            <span>{placeholder}</span>
            <img src={`/icons/${show ? 'hide' : 'show'}.png`} alt="" onClick={() => setShow(!show)}/>
            </div>
}

const ChangePassword = ({updatePassword}) => {
    const [currPassword, setCurrPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [error, setError] = useState('');

    const goBack = () => {
        window.history.back();
    }

    const handleSubmit = async () => {
        setError('')

        if(newPassword !== confirmNewPass){
            setError('Password doesn\'t matched')
        }else{
            const response = await updatePassword(newPassword, currPassword);
            if(response.error){
                setError(response.error)
            }else{
                window.location.href = '/Client/Home'
            }
        }

    }

    return <div className="change-password-page">
                <img src="/icons/6538623.jpg" alt="" />
                <div className='container'>
                    <h1>Change Password</h1>
                    <p>{error}</p>
                    <CustomizedInput placeholder='Current Password' handleChange={setCurrPassword}/>
                    <CustomizedInput placeholder='New Password' handleChange={setNewPassword}/>
                    <CustomizedInput placeholder='Confirm New Password' handleChange={setConfirmNewPass}/>
                    <div className='buttons'>
                        <button className='back-btn' onClick={goBack}>Back</button>
                        <button className='submit-btn' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
                <BubbleCursor />
            </div>
}

export default ChangePassword