import { formatDate } from "../utils/formatDate";

export const createTransaction = async (data) =>{
    const response = await fetch(`/api/transaction`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            provider: data.provider, 
            service_name: data.service_name, 
            price: data.price, 
            payment_method: data.paymentMethod,
            date_id: data.date_id, 
            time: data.time
         }),
    })
    if(response.ok){
        return await response.json();
    }

    return null
}

export const completeTransaction = async (transaction_id, price) => {
    if(confirm('Confirm the completion of this transaction?')){
        const response = await fetch(`/api/transaction/complete/${transaction_id}/client`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({service_price: price})
        });

        if(response.ok){
            const result = await response.json();
            const data = {
                transaction_id: result.completed_transaction.transaction_id,
                provider: result.completed_transaction.provider_account.firstname + ' ' + result.completed_transaction.provider_account.lastname,
                client: result.completed_transaction.client_account.firstname + ' ' + result.completed_transaction.provider_account.lastname,
                address: result.completed_transaction.address,
                booked_on: result.completed_transaction.booked_on,
                date: result.completed_transaction.available_date.date,
                time: result.completed_transaction.time,
                service_name: result.completed_transaction.service_name,
                price: result.completed_transaction.price,
                payment_method: result.completed_transaction.payment_method
            }
            // Step 1: Convert the object into a JSON string
            const jsonString = JSON.stringify(data);
            // Step 2: Base64 encode the JSON string
            const encodedString = btoa(jsonString); // btoa() encodes a string in base64
            window.location.href = `/transaction/completed?data=${encodedString}`
        }
    }
}

export const updateTransaction = (transaction_id, status) => {
    fetch(`/api//transaction/update/${transaction_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status})
    })
    window.location.reload();
}

export const cancelTransaction = async (reason, id, user) => {
    const data = { reason, status: 'Cancelled', user }
    if(reason){
        if(confirm("Are you sure you want to cancel?")){
            const response = await fetch(`/api/transaction/cancel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            })
            if(response.ok){
                window.location.reload();
            }else{
                const result = await response.json();
                console.log(result);
                alert(result.message);
            }
        }
    }else{
        alert('Select a reason');
    }
}

export const rateTransaction = (rating, transactionId, review) => {
    if(!rating){
        alert('Select rate');
    }else{
        if(confirm("Click OK to continue")){
            fetch(`/api//transaction/${transactionId}/review`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating,
                    review
                })
            })
            window.location.reload();
        }
    }
}

export const fail_and_refund = async(transaction_id) =>{
    const response = await fetch(`/api/transaction/fail/${transaction_id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.ok){
        window.location.reload();
    }

    return null
}