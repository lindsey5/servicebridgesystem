import '../styles/ChangePassword.css'
import ChangePassword from '../Components/Account/ChangePassword';

const updatePassword = async (newPassword, currPassword) => {
    try{
        const response = await fetch(`/api/provider/password`,{
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


const ProviderChangePassword = () => {
    
    return <ChangePassword updatePassword={updatePassword}/>
}

export default ProviderChangePassword