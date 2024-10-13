import React, { useContext } from 'react';
import { TransactionContext } from '../../../Context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import { RecipientContext } from '../../../Context/RecipientContext';
import { completeTransaction, setToOngoing, finishTransaction, acceptTransaction, expire_transaction } from '../../../utils/transactionUtils';

const isDateExpired = (transactionDateTime) => {
    const date = new Date(transactionDateTime);
    const currentDate = new Date();
    return date < currentDate;
};

const create_provider_payment_link = async (transaction_id, price) =>{
    const response = await fetch(`/api/payment/link/provider`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({transaction_id, price}),
        credentials: 'include'
    })
    if(response.ok){
        const result = await response.json();  
        console.log(result);
        window.location.href = result.checkout_url;
    }else{
        alert("Creating link error, please try again");
    }
}

const TransactionRow = ({ transaction, index, modal_dispatch }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const {setRecipientId} = useContext(RecipientContext);
    const {setTransactionId} = useContext(TransactionContext);

    const transactionDateTime = `${transaction.date} ${transaction.time}`;
    if (isDateExpired(transactionDateTime) && (transaction.status === 'Requested' || transaction.status === 'Accepted') && transaction.payment_method === 'Online Payment') {
        expire_transaction(transaction.id);
    }

    let status;
    if (transaction.status === 'Cancelled' || transaction.status === 'Declined' || transaction.status === 'Expired') {
        status = <td className='red-td'><p>{transaction.status}</p></td>;
    } else if (transaction.status === 'Requested' || transaction.status === 'On Going' || transaction.status === 'Accepted') {
        status = <td className='blue-td'><p>{transaction.status}</p></td>;
    } else {
        status = <td className='green-td'><p>{transaction.status}</p></td>;
    }

    const formattedPrice = `₱${transaction.price.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })}`;

    const generateButton = () => {
        
        const { status } = transaction;
    
        const handleActionButton = (onClick, icon) => (
            <button onClick={onClick}>
                {icon && <img src={`/icons/${icon}.png`} />}
            </button>
        );
    
        if (transaction.status === 'Requested' && user.user === 'Provider') {
            return (
                <>
                {handleActionButton(() => acceptTransaction(transaction.id), 'accept')}
                {handleActionButton(() => {modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: true}); setTransactionId(transaction.id);} , 'cancel')}
                </>
            );
        }else if(transaction.status === 'Accepted' && user.user === 'Provider'){
            return (
                <>
                {handleActionButton(() => setToOngoing(transaction.id), 'accept')}
                {handleActionButton(() => {modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: true}); setTransactionId(transaction.id);} , 'cancel')}
                </>
            );
        
        }else if ((status === 'Requested' || status === 'Accepted') && user.user === 'Client') {
            return handleActionButton(() =>{ setTransactionId(transaction.id); modal_dispatch({type: 'SHOW_CLIENT_REASON', payload: true}); }, 'cancel');

        } else if (status === 'On Going' && user.user === 'Provider') {
            return handleActionButton(() => finishTransaction(transaction.id), 'accept');

        } else if (status === 'Finished' && transaction.payment_method === 'Online Payment') {
            return handleActionButton(() => completeTransaction(transaction.id, transaction.price), 'accept');
            
        } else if(status === 'Finished' && transaction.payment_method === 'Cash on Pay') {
            return handleActionButton(() => create_provider_payment_link(transaction.id, transaction.price), 'accept');

        }else if (status === 'Completed' && user.user === 'Client') {
            return handleActionButton(() => { modal_dispatch({type: 'SHOW_RATE_MODAL', payload: true}); setTransactionId(transaction.id); }, 'like');

        } else if (status === 'Cancelled' || status === 'Declined') {
            return handleActionButton(() => { setTransactionId(transaction.id); modal_dispatch({type: 'SHOW_CANCELLED_TRANSACTION', payload: true}); }, 'eye');

        } else if (status === 'Reviewed') {
            return handleActionButton(() => {modal_dispatch({type: 'SHOW_REVIEWED_TRANSACTION', payload: true}); setTransactionId(transaction.id)}, 'eye');
        }   
    
        return null;
    };
    
    return (
        <tr>
            <td>{index + 1}</td>
            <td id='provider'>{transaction.provider}</td>
            <td>{transaction.client}</td>
            {status}
            <td>{transaction.address}</td>
            <td>{transaction.service_name}</td>
            <td>{formattedPrice}</td>
            <td>{transaction.payment_method}</td>
            <td>{transaction.date}</td>
            <td>{transaction.time}</td>
            <td>{transaction.booked_on}</td>
            <td className='buttons-table-data'>
                <div>
                {generateButton()}
                <button onClick={() => {
                    const recipientId = user.user === 'Client' ? transaction.provider_id  : transaction.client_id;
                    setRecipientId(recipientId);
                    const url = user.user === 'Provider' ? '/Provider/Messages' : '/Client/Messages';
                    navigate(url);
                }}><img src='/icons/chat.png'/></button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionRow;
