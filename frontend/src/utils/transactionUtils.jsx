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

export const setToOngoing = (transaction_id, status) => {
    if (confirm('Do you want to mark this transaction as ongoing?')) {
        updateTransaction(transaction_id, status);
    }
}

export const finishTransaction = (transaction_id, status) => {
    if (confirm('Task finished?')) {
        updateTransaction(transaction_id, status);
    }
}

export const acceptTransaction = (transaction_id, status) => {
    if (confirm('Do you really want to accept this transaction?')) {
        updateTransaction(transaction_id, status);
    }
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