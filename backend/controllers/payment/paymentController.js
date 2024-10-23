import jwt from 'jsonwebtoken';
import transactionService from "../../services/transactionService.js";
import paymentService from '../../services/paymentService.js';
const url = process.env.NODE_ENV === 'production' ? 'https://servicebridgesystem.onrender.com' : 'http://localhost:5173';

const create_client_checkout_link = async (req, res) => {
    try{
        const data = req.body.data;
        const amount = data.price * 100;
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const client_id = decodedToken.id;
        const success_url = `${url}/api/payment/success/client`;

        const checkout_link = await paymentService.create_checkout_link(amount, data.service_name, success_url);
        if(checkout_link){
            const checkoutDataToken = jwt.sign({
                client_id,
                provider: data.provider,
                service_name: data.service_name,
                price: data.price,
                payment_method: data.paymentMethod,
                date_id: data.date_id,
                time: data.time,
                payment_checkout_id: checkout_link.id
            }, process.env.JWT_SECRET);
            res.cookie('checkoutData', checkoutDataToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json(checkout_link);
        }else{
            res.status(400).json({error: "Creating checkout url failed"});
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

const create_provider_checkout_link = async (req, res) => {
    try{
        const {transaction_id, price} = req.body;
        const amount = (price * 0.05) * 100;
        const success_url = `${url}/api/transaction/complete/${transaction_id}/provider?service_price=${price}`;
        const checkout_link = await paymentService.create_checkout_link(amount, 'Commission fee', success_url);
        if(checkout_link){
            res.status(200).json(checkout_link);
        }else{
            res.status(400).json({error: "Creating checkout url failed"});
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

const client_payment_success = async (req, res) => {
    try{
        const checkoutData = jwt.verify(req.cookies.checkoutData, process.env.JWT_SECRET);
        const payment_checkout_id = checkoutData.payment_checkout_id;
        const {client_id, ...data} = checkoutData;
        const newTransaction = await transactionService.create_transaction(client_id, data);
        if(newTransaction){
            const transaction_id = newTransaction.dataValues.transaction_id;
            const newPayment = await paymentService.create_payment(transaction_id, payment_checkout_id);
            if(newPayment){
                res.clearCookie('checkoutData', { httpOnly: true, secure: true });
                res.redirect(`${url}/Client/Transactions`);
            }else{
                res.status(400).json({error: 'Payment failed'});
            }
        }else{
            res.status(400).json({error: "Creating new transaction failed"});
        }
    }catch(err){
        res.status(400).json({error: 'Payment failed'});
    }
}


export default { 
    create_client_checkout_link, 
    create_provider_checkout_link, 
    client_payment_success, 
}