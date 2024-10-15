import { TransactionContext } from '../../../Context/TransactionContext';
import { create_provider_payment_link } from '../../../services/paymentService';
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

const goToProviderPaymentLink = async(transaction_id, price) =>{
    const payment_link = await create_provider_payment_link(transaction_id, price);
    
    if(payment_link){
        window.location.href = payment_link.checkout_url;
    }else{
        alert("Creating payment link error")
    }
}

const TransactionButton = ({transaction, user, modal_dispatch}) => {
    const {setTransactionId} = useContext(TransactionContext);
    const handleActionButton = (onClick, icon) => (
            <button onClick={onClick}>
                {icon && <img src={`/icons/${icon}.png`} />}
            </button>
    );
    if (transaction.status === 'Requested' && user === 'Provider') {
        return (
            <>
            {handleActionButton(() => acceptTransaction(transaction.id), 'accept')}
            {handleActionButton(() => {modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: true}); setTransactionId(transaction.id);} , 'cancel')}
            </>
        );
    }else if(transaction.status === 'Accepted' && user === 'Provider'){
        return (
            <>
            {handleActionButton(() => setToOngoing(transaction.id), 'accept')}
            {handleActionButton(() => {modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: true}); setTransactionId(transaction.id);} , 'cancel')}
            </>
        );
        
    }else if ((transaction.status === 'Requested' || transaction.status === 'Accepted') && user === 'Client') {
        return handleActionButton(() =>{ setTransactionId(transaction.id); modal_dispatch({type: 'SHOW_CLIENT_REASON', payload: true}); }, 'cancel');

    } else if (transaction.status === 'In Progress' && user === 'Provider') {
        return handleActionButton(() => finishTransaction(transaction.id), 'accept');

    } else if (transaction.status === 'Finished' && transaction.payment_method === 'Online Payment' && user === 'Client') {
        return handleActionButton(() => completeTransaction(transaction.id, transaction.price), 'accept');
            
    } else if(transaction.status === 'Finished' && transaction.payment_method === 'Cash on Pay' && user === 'Provider') {
        return handleActionButton(() => goToProviderPaymentLink(transaction.id, transaction.price), 'accept');

    }else if (transaction.status === 'Completed' && user === 'Client') {
        return handleActionButton(() => { modal_dispatch({type: 'SHOW_RATE_MODAL', payload: true}); setTransactionId(transaction.id); }, 'like');

    } else if (transaction.status === 'Cancelled' || transaction.status === 'Declined') {
        return handleActionButton(() => { setTransactionId(transaction.id); modal_dispatch({type: 'SHOW_CANCELLED_TRANSACTION', payload: true}); }, 'eye');

    } else if (transaction.status === 'Reviewed') {
        return handleActionButton(() => {modal_dispatch({type: 'SHOW_REVIEWED_TRANSACTION', payload: true}); setTransactionId(transaction.id)}, 'eye');
    }else{
        return null
    }   

}

export default TransactionButton