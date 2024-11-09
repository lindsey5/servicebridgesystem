export const create_available_date_service = async (date, service_id, setError) => {
    try{
        const response = await fetch('/api/available-date-services',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date,
                service_id
             }), 
        })
        const result = await response.json();
        if(response.ok){
            window.location.reload();
        }
        if(result.error){
            setError(result.error);
        }

    }catch(err){

    }
}

export const delete_available_date_service = async (id) => {
    if(confirm('Are you sure you want to remove?')){
        try{
            const response = await fetch(`/api/available-date-service/${id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const result = await response.json();
            if(response.ok){
                window.location.reload();
            }
            if(result.error){
                setError(result.error);
            }

        }catch(err){

        }
    }
}