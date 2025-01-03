import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../../../Context/TransactionContext';
import { updateTransaction, completeTransaction } from '../../../services/transactionService';
import React, { useContext } from 'react';

const setToOngoing = (transaction_id) => {
    if (confirm('Do you want to mark this transaction as in progress?')) {
        updateTransaction(transaction_id, 'In Progress');
    }
}

const finishTransaction = (transaction_id) => {
    if (confirm('Task Finished?')) {
        updateTransaction(transaction_id, 'Finished');
    }
}

const acceptTransaction = (transaction_id) => {
    if (confirm('Do you really want to accept this transaction?')) {
        updateTransaction(transaction_id, 'Accepted');
    }
}


function isTwoHoursBefore(d1, d2) {
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        throw new Error("Invalid date provided");
    }

    // Calculate the difference in milliseconds
    const diffInMilliseconds = d2 - d1;

    // Convert the difference to hours
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    // Check if date1 is at least 2 hours before date2
    return diffInHours <= 2;
}


const TransactionButton = ({transaction, user, modal_dispatch}) => {
    const navigate = useNavigate();
    const {setTransactionId} = useContext(TransactionContext);

    const isTwoHrs = !(isTwoHoursBefore(new Date(), new Date(`${transaction.available_date.date} ${transaction.time}`)))

    const book = async (provider) => {        
        const params = {
            id: provider.id,
            price: provider.price,
            service_name: provider.service_name,
            firstname: provider.firstname,
            lastname: provider.lastname
        }
        const encoded = encodeURIComponent(btoa(JSON.stringify(params)));
        navigate(`/Client/booking?data=${encoded}`);
     }

    const handleActionButton = (onClick, icon) => (
            <button onClick={onClick}>
                {icon && <img src={`/icons/${icon}.png`} />}
            </button>
    );
    if (transaction.status === 'Requested' && user === 'Provider') {
        return (
            <>
            {handleActionButton(() => acceptTransaction(transaction.transaction_id), 'accept')}
            {isTwoHrs && handleActionButton(() => {modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: true}); setTransactionId(transaction.transaction_id);} , 'cancel')}
            </>
        );
    }else if(transaction.status === 'Accepted' && user === 'Provider'){
        return (
            <>
            {handleActionButton(() => setToOngoing(transaction.transaction_id), 'accept')}
            {isTwoHrs && handleActionButton(() => {modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: true}); setTransactionId(transaction.transaction_id);} , 'cancel')}
            </>
        );
        
    }else if ((transaction.status === 'Requested' || transaction.status === 'Accepted') && user === 'Client') {
        return isTwoHrs
        ? handleActionButton(() => {
            setTransactionId(transaction.transaction_id); 
            modal_dispatch({ type: 'SHOW_CLIENT_REASON', payload: true });
          }, 'cancel') 
        : null;

    } else if (transaction.status === 'In Progress' && user === 'Provider') {
        return handleActionButton(() => finishTransaction(transaction.transaction_id), 'accept');

    } else if (transaction.status === 'Finished' && user === 'Client') {
        return handleActionButton(() => completeTransaction(transaction.transaction_id, transaction.price), 'accept');
            
    }else if (transaction.status === 'Completed' && user === 'Client') {
        return <>
        {handleActionButton(() => { modal_dispatch({type: 'SHOW_RATE_MODAL', payload: true}); setTransactionId(transaction.transaction_id); }, 'like')}
        {handleActionButton(() => book({...transaction.provider_account, price: transaction.price, service_name: transaction.service_name}), 'rebook')}
        </>

    } else if (transaction.status === 'Cancelled' || transaction.status === 'Declined') {
        return  handleActionButton(() => { setTransactionId(transaction.transaction_id); modal_dispatch({type: 'SHOW_CANCELLED_TRANSACTION', payload: true}); }, 'eye')

    } else if (transaction.status === 'Reviewed') {
        return <>
        {handleActionButton(() => {modal_dispatch({type: 'SHOW_REVIEWED_TRANSACTION', payload: true}); setTransactionId(transaction.transaction_id)}, 'eye')}
        {user === 'Client' && handleActionButton(() => book({...transaction.provider_account, price: transaction.price, service_name: transaction.service_name}), 'rebook')}
        </>
    }else{
        return null
    }   

}

export default TransactionButton