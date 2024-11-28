
export const createService = async (service_name, category_name) => {
    if(confirm('Click Ok to continue')){
        try{
            const response = await fetch('/api/services',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({service_name, category_name}),
            });
            const result = await response.json();
    
            if(result.error){
                alert(result.error)
            }
    
            if(response.ok){
                window.location.reload();
            }
    
        }catch(err){
            console.error(err);
        }
    }
}

export const updateService = async (service_name, category_name, updatedServiceName) => {
    if(confirm('Click Ok to continue')){
        try{
            const response = await fetch('/api/services',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({service_name, category_name, updatedServiceName}),
            });
            const result = await response.json();
    
            if(result.error){
                alert(result.error)
            }
    
            if(response.ok){
                window.location.reload();
            }
    
        }catch(err){
            console.error(err);
        }
    }
}

export const deleteService = async (service_name) => {
    if(confirm('Are you sure do you wan\'t to delete this service?')){
        try{
            const response = await fetch(`/api/services/${service_name}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
    
            if(result.error){
                alert(result.error)
            }
    
            if(response.ok){
                window.location.reload();
            }
    
        }catch(err){
            console.error(err);
        }
    }
}