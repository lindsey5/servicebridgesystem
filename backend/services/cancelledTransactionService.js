import Cancelled_transaction from "../models/cancelled_transaction.js";
import Transaction from "../models/transaction.js";

const create_cancelled_transaction = async ({transaction_id,cancelled_by,cancellation_reason,canceller}) => {
    try{
        const cancelled_transaction = await Cancelled_transaction.create({
            transaction_id,
            cancelled_by,
            cancellation_reason,
            canceller
        });
        if(cancelled_transaction){
            return cancelled_transaction
        }else{
            return null;
        }
    }catch(err){
        throw new Error(err.message);
    }
}

const viewCancelledTransaction = async (id) => {
    try{
        const cancelled_transaction = await Cancelled_transaction.findOne({
            where:{
                transaction_id: id
            },
            include: [{ model: Transaction, attributes: ['service_name'] }]
        });
        if(cancelled_transaction){
            return cancelled_transaction
        }else{
            return null
        }
    }catch(err){
        console.log(err);
        throw new Error(err.message);
    }
}

export default { create_cancelled_transaction, viewCancelledTransaction }