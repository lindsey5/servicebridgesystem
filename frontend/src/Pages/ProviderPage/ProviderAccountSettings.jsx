import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch"
import AccountSettings from "../Components/Account/AccountSettings"
import { useNavigate } from "react-router-dom";

const ProviderAccountSettings = () => {
    const { data, loading } = useFetch('/api/provider');
    const [error, setError] = useState();
    const navigate = useNavigate();

    const handleUpdate = async (data, password) => {
        const response = await fetch(`/api/provider/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data})
        })

        const result = await response.json();
        if(response.ok){
            window.location.reload();
        }

        if(result.error){
            setError(result.error);
        }
       
    }

        useEffect(() => {
         document.title = "Account | Provider";
        },[])
    
    return (
        <>
        {!loading && <AccountSettings data={data} error={error} handleUpdate={handleUpdate} handleChangePassword={() => navigate('/provider/password')}/>}
        </>
    )
}

export default ProviderAccountSettings 