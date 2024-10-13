import Transaction from '../models/transaction.js';
import Client from '../models/client-account.js';
const create_transaction = async (client_id, data) => {
    try{
        const client_account = await Client.findOne({ 
            where: { id: client_id},
            attributes: ['address']
        });
        const address = client_account.address;
        const transaction = await Transaction.create({client: client_id, status: 'Requested', address, ...data});
        console.log(data);
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

export default {
    create_transaction,
    get_transactions,
    update_transaction,
    getTransactionCount
};