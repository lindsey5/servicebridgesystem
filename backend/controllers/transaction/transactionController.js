import Transaction from '../../models/transaction.js';
import Client from '../../models/client-account.js';
import Available_date from '../../models/available-date.js';
import { Op } from 'sequelize';
import ProviderEarning from '../../models/provider-earning.js';
import transactionService from '../../services/transactionService.js';
import cancelledTransactionService from '../../services/cancelledTransactionService.js';
import ReviewedTransaction from '../../models/reviewed-transaction.js';
import Provider from '../../models/provider-account.js';
import Payment from '../../models/payment.js';
import paymentService from '../../services/paymentService.js';
import ProviderBalance from '../../models/provider-balance.js';
import AvailableDate from '../../models/available-date.js';

const create_transaction = async (req, res) =>{
    try {
        const client_id = req.userId;
        const data = req.body;
        const transaction = await transactionService.create_transaction(client_id, data);
        if(transaction){
            res.status(200).json({transaction});
        }else{
            res.status(400).json({error: "Creating new transaction failed"});
        }
    }catch(err){
        if(err.errors){
            const errors = handleErrors(err.errors);
            res.status(400).json({errors});
        }
        else res.status(400).json({error: err.message});
    }
}

const handleErrors = (errors) =>{
    const errorMessage = [];
    errors.forEach(error => errorMessage.push(error.message));
    return errorMessage;
}

const get_client_transactions = async (req, res) => {
    const { page, limit} = req.query;
    const offset = (page - 1 ) * limit;
    const parseLimit = parseInt(limit);

    try{
        const id = req.userId;
        const query = {
            where: { 
                client: id,
            },
            order: [
                ['booked_on', 'DESC']
            ],
            include: [
                {
                    model: Client,
                    attributes: ['firstname', 'lastname']
                },
                {
                    model: Provider,
                    attributes: ['firstname', 'lastname']
                },
                {
                    model: AvailableDate,
                    attributes: ['date'],
                    
                }
            ]
        }

        if(req.body.date){
            query.include[2].where = {date: req.body.date}
        }

        if(req.body.statuses.length > 0){
            query.where.status = {[Op.in] : req.body.statuses}
        }

        const transactions = await transactionService.get_transactions(query, offset, parseLimit);
        if(transactions){
            res.status(200).json(transactions);
        }
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}

const get_provider_transactions = async (req, res) => {
    const { page, limit} = req.query;
    const offset = (page - 1 ) * limit;
    const parseLimit = parseInt(limit);
    try{
        const id = req.userId;
        const query = {
            where: { provider: id},
            order: [
                ['booked_on', 'DESC']
            ],
            include: [
                {
                    model: Client,
                    attributes: ['firstname', 'lastname']
                },
                {
                    model: Provider,
                    attributes: ['firstname', 'lastname']
                },
                {
                    model: AvailableDate,
                    attributes: ['date']
                }
            ]
        }

        if(req.body.date){
            query.include[2].where = {date: req.body.date}
        }

        if(req.body.statuses.length > 0){
            query.where.status = {[Op.in] : req.body.statuses}
        }

        const transactions = await transactionService.get_transactions(query, offset, parseLimit);
        if(transactions){
            res.status(200).json(transactions);
        }else{
            res.status(400).json({error: 'No transactions found'})
        }
    }catch(err){
        res.status(404).json({error: err.message});
    }
}

const cancel_transaction = async (req, res) => {
    const { status, reason: cancellation_reason , user } = req.body.data;
    const transaction_id = req.params.id;
    const cancelled_by = req.userId;
    try{
        const payment = await Payment.findOne({
            where:{
                transaction_id
            },
            include: [
                {
                    model: Transaction,
                }
            ]
        });
        if(payment){
            const payment_checkout_id = payment.dataValues.payment_checkout_id;
            const price = payment.dataValues.transaction.dataValues.price;
            const payment_checkout = await paymentService.retrieve_payment_checkout(payment_checkout_id);
            if(payment_checkout){
                const payment_id = payment_checkout.data.attributes.payments[0].id;
                const refunded_payment = await paymentService.refund_payment(payment_id, price);
                if(!refunded_payment){
                    throw new Error('Refund Failed');
                }
            }
        }
        const cancelled_transaction = await cancelledTransactionService.create_cancelled_transaction({transaction_id, cancelled_by, cancellation_reason, canceller: user })
        if(cancelled_transaction){
            const updated_transaction = await transactionService.update_transaction(transaction_id, status);
            if(updated_transaction){
                res.status(200).json({updated_transaction});
            }else{
                res.status(400).json({message: "Cancellation Failed"});
            }
        }
    }catch(err){
        console.log(err);
        res.status(400).json({message: "Refund Failed"})
    }
}

const update_transaction = async (req, res) => {
    const {status} = req.body;
    const transaction_id = req.params.id;
    try{
        const transaction = transactionService.update_transaction(transaction_id, status);
        if(transaction){
            res.status(200).json(transaction);
        }else{
            res.status(400).json({error: 'Failed to update transaction'})
        }
    }catch(err){
        res.status(400).json({ error: err.message});
    }
}

const client_complete_transaction = async (req, res) => {
    const transaction_id = req.params.id;
    const { service_price } = req.body;
    try{
        const completed_transaction = await transactionService.complete_transaction(transaction_id, service_price);
        const provider = completed_transaction.completed_transaction.dataValues.provider;
        const earnings = completed_transaction.earnings.providerEarning.dataValues.earnings;
        await ProviderBalance.increment('balance', { by: earnings, where: { id: provider } })
        res.status(200).json(completed_transaction);
    }catch(err){
        console.log(err);
        return res.status(400).json({error: err.message});
    }
}

const provider_complete_transaction = async (req, res) => {
    const transaction_id = req.params.id;
    const { service_price } = req.query;
    try{
        const completed_transaction = await transactionService.complete_transaction(transaction_id, service_price);
        if(completed_transaction){
            res.redirect(`https://servicebridgesystem.onrender.com/Provider/Transactions`);
        }else{
            res.status(400).json({error: "Completion of transaction failed"});
        }
    }catch(err){
        console.log(err);
        return res.status(400).json({error: err.message});
    }
}

const get_cancelled_transaction = async (req, res) => {
    const id = req.params.id;
    try{
        const cancelled_transaction = await cancelledTransactionService.viewCancelledTransaction(id)
        if(cancelled_transaction){
            res.status(200).json({cancelled_transaction});
        }else{
            res.status(400).json({error: 'Transaction not found'});
        }

    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const fail_transaction = async (req, res) =>{
    const status = 'Failed';
    const transaction_id = req.params.id;
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
                    res.status(400).json({message: "Failed to update"});
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


const get_total_completed_transactions = async (req, res) =>{
    const provider_id = req.userId;
    try{
        const completed_transactions_total = await transactionService.getTransactionCount({
            where: { 
                provider: provider_id, 
                status: {
                    [Op.or]: ['Completed', 'Reviewed']
                }
            }
        })
        if(completed_transactions_total){
            res.status(200).json({completed_transactions_total});
        }
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const get_total_completed_transaction_today = async (req, res) =>{
    const provider_id = req.userId;
    try{
        const total_completed_transactions_today = await transactionService.getTransactionCount({
            where: { 
                provider: provider_id, 
                status: {
                    [Op.or]: ['Completed', 'Reviewed']
                }
            },
            include: [ 
                { 
                model: ProviderEarning,
                where: {payment_date: { [Op.eq]: new Date() }}
                },
                {
                    attributes: [],
                    model: AvailableDate,
                    where: {date: { [Op.eq]: new Date() }}
                }
            ]
        })

         res.status(200).json({total_completed_transactions_today});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const get_completed_transaction_today = async (req, res) => {
    const provider_id = req.userId;
    try{
        const completed_transactions_today = await Transaction.findAll({
            where: {
                provider: provider_id,
                status: {
                    [Op.or]: ['Completed', 'Reviewed']
                }
            },
            include: [ 
                { 
                    model: ProviderEarning,
                    attributes: ['earnings']
                },
                { 
                    model: Available_date,
                    attributes: ['date']
                }, 
                { 
                    model: Client,
                    attributes: ['firstname', 'lastname']
                },
                {
                    attributes: [],
                    model: AvailableDate,
                    where: {date: { [Op.eq]: new Date() }}
                }
            ]
        });
        if(completed_transactions_today.length > 0){
            res.status(200).json({completed_transactions_today});
        }else{
            res.status(400).json('No completed task');
        }
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}

const get_transactions_by_date = async (req, res) => {
    const date = req.params.date;
    try{
        const provider_id = req.userId
        const transactionsByDate = await Transaction.findAll({
            where:{
                provider: provider_id
            },
            include: {
                model: Available_date,
                where: { date },
            }
        });
        const transactions = transactionsByDate
        .map(transaction => transaction.toJSON())
        .sort((a, b) => {
            const timeA = new Date(`${a.available_date.date} ${a.time}`);
            const timeB = new Date(`${a.available_date.date} ${b.time}`);
            return timeB - timeA; 
        });
        res.status(200).json({transactions});
    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

const review_transaction = async (req, res) => {
    const transaction_id = req.params.id;
    const {rating, review} = req.body;
    try{
        const updated_transaction = await transactionService.update_transaction(transaction_id, 'Reviewed');
        if(updated_transaction){
            const reviewed_transaction = await ReviewedTransaction.create({
                transaction_id,
                rating,
                review
            });
            if(reviewed_transaction){
                const provider_id = updated_transaction.dataValues.provider;
                const reviewed_transactions_rating = await ReviewedTransaction.findAll({
                    include: {
                        model: Transaction,
                        where: { provider: provider_id },
                    },
                });
                let sum = 0;
                reviewed_transactions_rating.forEach(reviewed_transaction => {
                    sum += reviewed_transaction.dataValues.rating 
                })
                const newRating = Math.round((sum / reviewed_transactions_rating.length) * 10) / 10;
                const provider = await Provider.findByPk(provider_id);
                const updatedProvider = await provider.update({rating: newRating});
                if(updatedProvider){
                    res.status(200).json({message: 'Transaction successfully rated'});
                }else{
                    res.status(400).json({ error: 'Failed to update provider rating' });
                }
            }else{
                res.status(400).json({ error: 'Failed to create review' });
            }
        }else{
            res.status(400).json({error: 'Transaction not found'});
        }
    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

const get_reviewed_transaction = async (req, res) => {
    const transaction_id = req.params.id;
    try{
        const reviewed_transaction = await ReviewedTransaction.findByPk(transaction_id);
        if(reviewed_transaction){

            const query = {
                where: { transaction_id },
                include: { model: Client }
            }
            const transaction = await Transaction.findOne(query);
            if(transaction){
                const jsonTransaction = transaction.toJSON();
                const fullname = `${jsonTransaction.client_account.firstname} ${jsonTransaction.client_account.lastname}`;
                res.status(200).json({...reviewed_transaction.dataValues, service_name: jsonTransaction.service_name, fullname, profile_pic: jsonTransaction.client_account.profile_pic});
            }
        }
    }catch(err){
        res.status(400).json({error: err.message});
    }

}

const get_reviewed_transactions = async (req,res) => {
    const provider = req.params.provider;
    const query = {
        order: [
            ['date_reviewed', 'DESC']
        ],
        include: 
            { 
              model: Transaction,  
              where: { provider } ,
              include: {
                model: Client,
                attributes: ['firstname', 'lastname', 'profile_pic', 'id']
               },
            },
    }

    if(req.query.rating){
        query.where.rating = req.query.rating;
    }

    
    if(req.query.filter){
        query.include.where.service_name =  req.query.filter;
    }

    try{
        const reviewed_transactions = await transactionService.get_all_reviewed_transactions(query);
        res.status(200).json(reviewed_transactions);

    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

const get_requested_transactions = async (req, res) => {
    try{
        const id = req.userId;
        const request_transactions = await Transaction.findAll({
            where: {
                status: 'Requested',
                provider: id
            }
        })
        res.status(200).json(request_transactions);
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

export default { 
    create_transaction, 
    get_client_transactions,
    get_provider_transactions,
    cancel_transaction, 
    update_transaction,
    client_complete_transaction,
    provider_complete_transaction,
    fail_transaction,
    get_cancelled_transaction,
    get_total_completed_transactions, 
    get_total_completed_transaction_today, 
    get_completed_transaction_today,
    get_transactions_by_date,
    review_transaction,
    get_reviewed_transaction,
    get_reviewed_transactions,
    get_requested_transactions
 };