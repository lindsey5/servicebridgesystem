export const createClientPaymentLink = async(data) =>{
    try{
        const response = await fetch(`/api/payment/link/client`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data}),
        })
        if(response.ok){
            const result = await response.json();  
            return result;
        }
    
        return null
    }catch(err){
        console.error(err);
        return null;
    }
}
