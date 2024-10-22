import { useState } from "react";
import useFetch from "../../hooks/useFetch"
import AccountSettings from "../Components/Account/AccountSettings"

const ClientAccountSettings = () => {
    const { data } = useFetch('/api/client');
    const [error, setError] = useState();

    const handleUpdate = async (data, password) => {
        const response = await fetch(`/api/client/update`, {
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

    return(
        <AccountSettings data={data} error={error} handleUpdate={handleUpdate}/>
    )
}

export default ClientAccountSettings