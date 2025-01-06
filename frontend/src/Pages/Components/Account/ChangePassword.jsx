import { useState } from 'react'
import '../../styles/ChangePassword.css'
import BubbleCursor from '../BubbleCursor';
import CustomizedInput from '../Input/CustomizedInput';

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
                    <CustomizedInput onChange={setCurrPassword} placeholder="Current password" type="password"/>
                    <CustomizedInput onChange={setNewPassword} placeholder="New password" type="password"/>
                    <CustomizedInput onChange={setConfirmNewPass} placeholder="Confirm New Password" type="password"/>
                    <div className='buttons'>
                        <button className='back-btn' onClick={goBack}>Back</button>
                        <button className='submit-btn' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
                <BubbleCursor />
            </div>
}

export default ChangePassword