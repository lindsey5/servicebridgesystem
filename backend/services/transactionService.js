import Transaction from '../models/transaction.js';
import Client from '../models/client-account.js';
import earningService from './earningService.js';
import ReviewedTransaction from '../models/reviewed-transaction.js';
import provider_account from '../models/provider-account.js';
import client_account from '../models/client-account.js';
import AvailableDate from '../models/available-date.js';

const create_transaction = async (client_id, data) => {
    try{
        const client_account = await Client.findOne({ 
            where: { id: client_id},
            attributes: ['address']
        });
        const address = client_account.address;
        const transaction = await Transaction.create({client: client_id, status: 'Requested', address, ...data});
        if(transaction){
            return transaction
        }
        return null
    }catch(err){
        throw new Error(err);
    }
}

// Fetch paginated transactions
const get_transactions = async (query, offset, limit) => {
    try {
        const totalRows = await Transaction.count(query);
        query.offset = offset;
        query.limit = limit;
        const totalPages = Math.ceil(totalRows / limit);
        
        const transactions = await Transaction.findAll(query);
        if (transactions) {
            return { transactions, totalPages };
        } else {
            return null
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

// Update a transaction status
const update_transaction = async (transaction_id, status) => {
    try {
        const transaction = await Transaction.findByPk(transaction_id);
        if (transaction) {
            const updated_transaction = await transaction.update({ status });
            return updated_transaction;
        } else {
            return null
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

const getTransactionCount = async (query) => {
    try{
        const count = await Transaction.count(query);
        return count
    }catch(err){
        throw new Error(err.message);
    }

}

const complete_transaction = async (transaction_id, service_price) => {
    try{
        const earnings = await earningService.post_earnings(service_price, transaction_id);
        if(earnings){
            const transaction = await Transaction.findOne({
                where: {
                    transaction_id: transaction_id
                },
                include: [{model: provider_account}, {model: client_account}, {model: AvailableDate}]
            })
            if(transaction){
                await transaction.update({status: 'Completed'});
                return {completed_transaction: transaction, earnings};
            }else{
                throw new Error('Completion error');
            }
        }else{
            throw new Error('Completion error');
        }
    }catch(err){

        throw new Error('Completion error');
    }
}

const get_all_reviewed_transactions = async (query) => {
    try{
        const reviewed_transactions = await ReviewedTransaction.findAll(query)

        if(reviewed_transactions){
            return reviewed_transactions
        }else{
            throw new Error("Error fetching reviewed transactions")
        }
    }catch(err){
        throw new Error("Error fetching reviewed transactions")
    }

}

export default {
    create_transaction,
    get_transactions,
    update_transaction,
    getTransactionCount,
    complete_transaction,
    get_all_reviewed_transactions,
};