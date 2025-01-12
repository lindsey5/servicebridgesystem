import '../styles/ChangePassword.css'
import ChangePassword from '../Components/Account/ChangePassword';

const updatePassword = async (newPassword, currPassword) => {
    try{
        const response = await fetch(`/api/client/password`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword,
                currPassword
            })
        });

        return await response.json();

    }catch(err){
        return null
    }
}


const ClientChangePassword = () => {
    
    return <ChangePassword updatePassword={updatePassword}/>
}

export default ClientChangePassword