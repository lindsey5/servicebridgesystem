export const addServiceOffered = async (serviceName, setSuccessModal) => {
    if(confirm('Do you want to add this service?')){
     try{
         const response = await fetch('/api/services-offered',{
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 service_name: serviceName
             }),
         });
         if(response.ok){
             const result = await response.json();
             if(result.error){
                 alert(result.error);
             }else{
                 setSuccessModal(true);
             }
         }
     }catch(error){
         console.log(error);
     }
    }
 }

 export const  deleteServiceOffered = async(service_id) => {
    if(confirm('Are you sure you want to delete?')){
        try {
            const response = await fetch(`/api/services-offered/${service_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(result){
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating price:', error);
        }
    }
 }

 export const editServiceOfferedPrice = async(service_id, price) => {
    if(confirm('Click OK to continue')){
        try {
            const response = await fetch(`/api/services-offered/${service_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({price}),
            });
            const result = await response.json();
            if(result){
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating price:', error);
        }
    }   
}
