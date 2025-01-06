import { useEffect, useState } from 'react'
import '../../styles/ForgotPassword.css'
import BubbleCursor from '../BubbleCursor'
import CustomizedInput from '../Input/CustomizedInput'

const ForgotPasswordPage = ({backUrl, userType, sendCode, verifyCode, resetPassword}) => {
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [showLastForm, setShowLastForm] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState()
    const [confirmNewPass, setConfirmNewPass] = useState();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        if(!showSecondForm && !showLastForm){
            const response = await sendCode(email);
            response.error ? setError(response.error) : setShowSecondForm(true)
        }else if(showSecondForm){
            verifyCode(code)
            setShowLastForm(true)
            setShowSecondForm(false)
        }else{
            if(password !== confirmNewPass) {
                setError("Password doesn't match")
            }else{
                const response = resetPassword(email, password);
                response.error ? setError(response.error) : window.location.href = backUrl
            }
        }
    }

    useEffect(() => {
        console.log(email)
    }, [email])

    return(
        <div className='forgot-password-page'>
            <div>
                <h1>{userType}</h1>
            <img src="/icons/3293465.jpg" alt="" />
            </div>
            <form onSubmit={handleSubmit}>
                <h1>Forgot your password?</h1>
                {error && <p style={{width: '100%', color: 'red', marginBottom: '30px'}}>{error}</p>}
                {!showSecondForm && !showLastForm && <CustomizedInput placeholder="Enter your email" type="email" onChange={setEmail}/> }
                {showSecondForm && <>
                    <p style={{width: '100%', color: 'grey'}}>Please enter the code we sent to:</p>
                    <h3 style={{width: '100%' }}>{email}</h3>
                    <CustomizedInput placeholder="Enter code" type="number" onChange={setCode}/>
                </>}
                {showLastForm && <>
                    <CustomizedInput placeholder="New password" type="password" onChange={setPassword}/>
                    <CustomizedInput placeholder="Confirm new password" type="password" onChange={setConfirmNewPass}/>
                </>}
                <button>Submit</button>
                <a href={backUrl}>Back to login</a>
            </form>
            <BubbleCursor />
        </div>
    )
}

export default ForgotPasswordPage