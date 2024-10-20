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
        credentials: 'include'
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
            window.location.reload();
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

export const createTransactionObject = async (transactionData) => {
    const bookedDate = new Date(transactionData.booked_on);

    const fetchName = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data.fullname;
    };

    const fetchDate = async (url) => {
        const response = await fetch(url);
        return await response.json();
    };

    // Fetching client, provider, and date details concurrently
    const [client, provider, date] = await Promise.all([
        fetchName(`/api/client/name/${transactionData.client}`),
        fetchName(`/api/provider/name/${transactionData.provider}`),
        fetchDate(`/api/available-date/${transactionData.date_id}`)
    ]);

    return {
        id: transactionData.transaction_id,
        provider_id: transactionData.provider,
        client_id: transactionData.client,
        service_name: transactionData.service_name,
        address: transactionData.address,
        price: parseFloat(transactionData.price),
        payment_method: transactionData.payment_method,
        status: transactionData.status,
        booked_on: formatDate(bookedDate),
        time: transactionData.time,
        client: client,
        provider: provider,
        date: date
    };
};