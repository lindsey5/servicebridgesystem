import Payment from "../models/payment.js";

const create_payment = async (transaction_id, payment_checkout_id) => {
    try{
        const newPayment = await Payment.create({transaction_id, payment_checkout_id});
        if(newPayment){
            return newPayment;
        }

        return null;
    }catch(err){
        throw new Error(err.message);
    }
}

const retrieve_payment_checkout = async (payment_checkout_id) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic c2tfdGVzdF9Razh2Q1ZkdUJaOTFZRmtRTEhyTEpXR0E6'
        }
      };
      
      const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${payment_checkout_id}`, options)
      if(response.ok){
        return await response.json();
      }
      return null
}

const refund_payment = async (payment_id, price) => {
    const amount = price * 100;
    try{
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: 'Basic c2tfdGVzdF9Razh2Q1ZkdUJaOTFZRmtRTEhyTEpXR0E6'
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  amount,
                  reason: 'others',
                  payment_id
                }
              }
            })
          };
          
          const response = await fetch('https://api.paymongo.com/refunds', options)
          if(response.ok){
            return await response.json();
          }
    
          return null
    }catch(err){
        throw new Error(err);
    }
}

export default { create_payment, retrieve_payment_checkout, refund_payment }