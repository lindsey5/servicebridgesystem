export const updateTransaction = (transaction_id, status) => {
    fetch(`/api//transactions/update/${transaction_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status})
    })
    window.location.reload();
}

export const setToOngoing = (transaction_id) => {
    if (confirm('Do you want to mark this transaction as ongoing?')) {
        updateTransaction(transaction_id, 'On Going');
    }
}

export const finishTransaction = (transaction_id) => {
    if (confirm('Task finished?')) {
        updateTransaction(transaction_id, 'Finished');
    }
}

export const acceptTransaction = (transaction_id) => {
    if (confirm('Do you really want to accept this transaction?')) {
        updateTransaction(transaction_id, 'Accepted');
    }
}

export const expire_transaction = async(transaction_id) =>{
    const response = await fetch(`/api/transactions/expire/${transaction_id}`,{
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

export const createTransaction = async (data) =>{
    const response = await fetch(`/api/transactions`,{
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
        credentials: 'include'
    })
    if(response.ok){
        return await response.json();
    }

    return null
}

export const completeTransaction = async (transaction_id, price) => {
    if(confirm('Confirm the completion of this transaction?')){
        const response = await fetch(`/api/transactions/complete/${transaction_id}/client`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({service_price: price})
        });

        if(response.ok){
            window.location.reload();
        }
    }
}