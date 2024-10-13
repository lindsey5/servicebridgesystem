import Payment from "../models/payment.js";
import fetch from "node-fetch";

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
          authorization: `Basic ${process.env.PAYMONGO_API_KEY}`
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
              authorization: `Basic ${process.env.PAYMONGO_API_KEY}`
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

const create_checkout_link = async (amount, item, success_url) => {
    try{
        const options = {
            method: 'POST',
            headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `Basic ${process.env.PAYMONGO_API_KEY}` 
            },
            body: JSON.stringify({
            data: {
                attributes: {
                send_email_receipt: false,
                show_description: false,
                show_line_items: true,
                cancel_url: 'http://localhost:5173/',
                success_url,
                line_items: [{currency: 'PHP', amount, quantity: 1, name: `${item}`}],
                payment_method_types: [
                    'gcash',
                    'paymaya',
                    'brankas_landbank',
                    'card',
                    'dob',
                    'dob_ubp',
                    'brankas_metrobank'
                ],
                }
            }
            })
        };
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
        if(response.ok){
            const result = await response.json();
            return {id: result.data.id, checkout_url: result.data.attributes.checkout_url}
        }
        const result = await response.json();
        console.log(result);
        return null
    } catch(err){
        throw new Error("Failed to create checkout url");
    }
}

export default { create_payment, retrieve_payment_checkout, refund_payment, create_checkout_link }