import { useEffect } from "react";
import { verifyCode } from "../../utils/emailUtils";
import ForgotPasswordPage from "../Components/Account/ForgotPassword"

const sendVerificationCode = async (email) => {
    try{
        const response = await fetch('/api/provider/verification-code',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email}), 
        })

        return await response.json();

    }catch(err){
        console.error(err)
    }
}

const resetPassword = async (email, newPassword) => {
    try{
        const response = await fetch('/api/provider/reset-password',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, newPassword}), 
        })

        return await response.json();

    }catch(err){
        console.error(err)
    }
}

const ProviderForgotPassword = () => {

    useEffect(() => {
        document.title = "Provider | Forgot Password"
    }, [])


    return <ForgotPasswordPage 
                backUrl="/Provider/Login" 
                userType="Provider"
                sendCode={sendVerificationCode}
                verifyCode={verifyCode}
                resetPassword={resetPassword}
            />
}

export default ProviderForgotPassword