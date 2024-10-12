import React, { useContext } from 'react';
import { TransactionContext } from '../../../Context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import { RecipientContext } from '../../../Context/RecipientContext';
import { updateTransaction, setToOngoing, finishTransaction, acceptTransaction } from '../../../utils/transactionUtils';

const complete = async (transaction_id, price, payment_method) => {
    if(confirm('Confirm the completion of this transaction?')){
        
    }
}

const isDateExpired = (transactionDateTime) => {
    const date = new Date(transactionDateTime);
    const currentDate = new Date();
    return date < currentDate;
};

const TransactionRow = ({ transaction, index, setClientReasonModal, setShowCancelledTran, setShowRateModal, setReviewedModal}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const {setRecipientId} = useContext(RecipientContext);
    const {setTransactionId} = useContext(TransactionContext);

    const transactionDateTime = `${transaction.date} ${transaction.time}`;
    if (isDateExpired(transactionDateTime) && (transaction.status === 'Requested' || transaction.status === 'Accepted')) {
        updateTransaction(transaction.id, 'Expired');
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
        
        const { status, payment_method } = transaction;
    
        const handleActionButton = (onClick, icon) => (
            <button onClick={onClick}>
                {icon && <img src={`/icons/${icon}.png`} />}
            </button>
        );
    
        if (status === 'Requested' && user.user === 'Provider') {
            return (
                <>
                    {handleActionButton(() => acceptTransaction(transaction.id, 'Accepted', transactionDateTime), 'accept')}
                    {handleActionButton(() => {}, 'cancel')}
                </>
            );
        } else if (status === 'Accepted' && user.user === 'Provider') {
            return (
                <>
                    {handleActionButton(() => setToOngoing(transaction.id, 'On Going', transactionDateTime), 'accept')}
                    {handleActionButton(() => {}, 'cancel')}
                </>
            );
        } else if ((status === 'Requested' || status === 'Accepted') && user.user === 'Client') {
            return handleActionButton(() =>{ setTransactionId(transaction.id); setClientReasonModal(true); }, 'cancel');

        } else if (status === 'On Going' && user.user === 'Provider') {
            return handleActionButton(() => finishTransaction(transaction.id, 'Finished', transactionDateTime), 'accept');

        } else if (status === 'Finished' && user.user === 'Client' && payment_method === 'Online Payment') {
            return handleActionButton(() => complete(transaction.id, transaction.price, payment_method), 'accept');

        } else if (status === 'Completed' && user.user === 'Client') {
            return handleActionButton(() => { setShowRateModal(true); setTransactionId(transaction.id); }, 'like');

        } else if (status === 'Cancelled' || status === 'Declined') {
            return handleActionButton(() => { setTransactionId(transaction.id); setShowCancelledTran(true); }, 'eye');

        } else if (status === 'Reviewed') {
            return handleActionButton(() => {setReviewedModal(true); setTransactionId(transaction.id)}, 'eye');
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
