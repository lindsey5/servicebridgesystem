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

export const cancelTransaction = async (reason, id, user) => {
    console.log(user);
    const data = { reason, status: 'Cancelled', user }
    if(reason){
        if(confirm("Are you sure you want to cancel?")){
            const response = await fetch(`/api/transactions/cancel/${id}`, {
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
            fetch(`/api//transactions/review/${transactionId}`, {
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
    const response = await fetch(`/api/transactions/fail/${transaction_id}`,{
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