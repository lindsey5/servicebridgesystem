import { verifyCode } from "../../utils/emailUtils";
import ForgotPasswordPage from "../Components/Account/ForgotPassword"
import { useEffect } from "react";

const sendClientVerificationCode = async (email) => {
    try{
        const response = await fetch('/api/client/verification-code',{
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
        const response = await fetch('/api/client/reset-password',{
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

const ClientForgotPassword = () => {
     useEffect(() => {
            document.title = "Provider | Forgot Password"
        }, [])

    return <ForgotPasswordPage 
                backUrl="/Client/Login" 
                userType="Client"
                sendCode={sendClientVerificationCode}
                verifyCode={verifyCode}
                resetPassword={resetPassword}
            />
}

export default ClientForgotPassword