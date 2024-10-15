import jwt from 'jsonwebtoken';
import transactionService from "../../services/transactionService.js";
import paymentService from '../../services/paymentService.js';

const create_client_checkout_link = async (req, res) => {
    try{
        const data = req.body.data;
        const amount = data.price * 100;
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const client_id = decodedToken.id;
        const success_url = 'http://localhost:3000/api/payment/success/client';
        req.session.checkoutData = {
            client_id,
            provider: data.provider,
            service_name: data.service_name,
            price: data.price,
            payment_method: data.paymentMethod,
            date_id: data.date_id,
            time: data.time,
        };
        const checkout_link = await paymentService.create_checkout_link(amount, data.service_name, success_url);
        if(checkout_link){
            req.session.payment_checkout_id	 = checkout_link.id;
            res.status(200).json(checkout_link);
        }else{
            res.status(400).json({error: "Creating checkout url failed"});
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
}

const create_provider_checkout_link = async (req, res) => {
    try{
        const {transaction_id, price} = req.body;
        const amount = (price * 0.05) * 100;
        const success_url = `http://localhost:3000/api/transactions/complete/${transaction_id}/provider?service_price=${price}`;
        const checkout_link = await paymentService.create_checkout_link(amount, 'Commission fee', success_url);
        if(checkout_link){
            res.status(200).json(checkout_link);
        }else{
            res.status(400).json({error: "Creating checkout url failed"});
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
}

const client_payment_success = async (req, res) => {
    try{
        const checkoutData = req.session.checkoutData;
        const payment_checkout_id = req.session.payment_checkout_id;
        const {client_id, ...data} = checkoutData;
        const newTransaction = await transactionService.create_transaction(client_id, data);
        if(newTransaction){
            const transaction_id = newTransaction.dataValues.transaction_id;
            const newPayment = await paymentService.create_payment(transaction_id, payment_checkout_id);
            if(newPayment){
                delete req.session.checkoutData;
                delete req.session.payment_checkout_id;
                res.redirect('http://localhost:5173/Client/Transactions');
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

const refund_payment = async (req, res) =>{
    const status = 'Failed';
    const transaction_id = req.params.transaction_id;
    try{
        const payment = await Payment.findOne({
            where:{
                transaction_id
            },
            include: [{model: Transaction}]
        });
        const payment_checkout_id = payment.dataValues.payment_checkout_id;
        const price = payment.dataValues.transaction.dataValues.price;
        const payment_checkout = await paymentService.retrieve_payment_checkout(payment_checkout_id);
        if(payment_checkout){
            const payment_id = payment_checkout.data.attributes.payments[0].id;
            const refunded_payment = await paymentService.refund_payment(payment_id, price);
            if(refunded_payment){
                const updated_transaction = await transactionService.update_transaction(transaction_id, status);
                if(updated_transaction){
                    res.status(200).json({updated_transaction});
                }else{
                    res.status(400).json({message: "Failed to expire"});
                }
            }else{
                res.status(400).json({message: "Refund Failed"})
            }
        }else{
            res.status(400).json({message: "Payment not found"})
        }
    }catch(err){
        res.status(400).json({message: "Refund Failed"})
    }
}


export default { 
    create_client_checkout_link, 
    create_provider_checkout_link, 
    client_payment_success, 
    refund_payment 
}