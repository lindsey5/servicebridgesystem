import fetch from "node-fetch";
import jwt from 'jsonwebtoken';
import transactionService from "../../services/transactionService.js";
import paymentService from '../../services/paymentService.js';

const create_checkout_link = async (req, res) => {
    try{
        const data = req.body.data;
        const amount = data.price * 100;
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const client_id = decodedToken.id;

        req.session.checkoutData = {
            client_id,
            provider: data.provider,
            service_name: data.service_name,
            price: data.price,
            payment_method: data.paymentMethod,
            date_id: data.date_id,
            time: data.time,
        };
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
                success_url: `http://localhost:3000/api/payment/success`,
                line_items: [{currency: 'PHP', amount, quantity: 1, name: `${data.service_name}`}],
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
            req.session.payment_checkout_id	 = result.data.id;
            res.status(200).json({id: result.data.id, checkout_url: result.data.attributes.checkout_url});
        }else{
            throw new Error("Failed to create checkout url");
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
}

const payment_success = async (req, res) => {
    try{
        const checkoutData = req.session.checkoutData;
        const payment_checkout_id = req.session.payment_checkout_id;
        const {client_id, ...data} = checkoutData;
        const newTransaction = await transactionService.create_transaction(client_id, data);
        if(newTransaction){
            const transaction_id = newTransaction.dataValues.transaction_id;
            const newPayment = await paymentService.create_payment(transaction_id, payment_checkout_id);
            if(newPayment){
                res.redirect('http://localhost:5173/Client/Transactions');
            }
        }else{
            res.status(400).json({error: "Creating new transaction failed"});
        }
    }catch(err){
        console.log(err);
        res.status(400).json({error: 'Payment failed'});
    }
}

export default { create_checkout_link, payment_success }