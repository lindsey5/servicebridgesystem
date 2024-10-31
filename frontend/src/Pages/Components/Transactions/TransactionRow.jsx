import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipientContext } from '../../../Context/RecipientContext';
import TransactionButton from './TransactionButton';
import TransactionStatus from './TransactionStatus';
import { updateTransaction, fail_and_refund } from '../../../services/transactionService';

const isDateExpired = (transactionDateTime) => {
    const date = new Date(transactionDateTime);
    const currentDate = new Date();
    date.setHours(date.getHours() + 1);
    return date < currentDate;
};

const TransactionRow = ({ transaction, index, modal_dispatch, user }) => {
    const navigate = useNavigate();
    const {setRecipientId} = useContext(RecipientContext);
    const transactionDateTime = `${transaction.date} ${transaction.time}`;

    if (isDateExpired(transactionDateTime) && (transaction.status === 'Requested' || transaction.status === 'Accepted')) {
        if(transaction.payment_method === 'Online Payment'){
            fail_and_refund(transaction.transaction_id);
        }else{
            updateTransaction(transaction.transaction_id, 'Failed');
        }
    }

    const formattedPrice = `₱${transaction.price.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })}`;
    
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{transaction.provider_account.firstname} {transaction.provider_account.lastname}</td>
            <td>{transaction.client_account.firstname} {transaction.client_account.lastname}</td>
            <TransactionStatus transaction={transaction}/>
            <td>{transaction.address}</td>
            <td>{transaction.service_name}</td>
            <td>{formattedPrice}</td>
            <td>{transaction.payment_method}</td>
            <td>{transaction.date}</td>
            <td>{transaction.time}</td>
            <td>{transaction.booked_on}</td>
            <td className='buttons-table-data'>
                <div>
                {user && <TransactionButton transaction={transaction} user={user} modal_dispatch={modal_dispatch}/>}
                <button onClick={() => {
                    const recipientId = user === 'Client' ? transaction.provider_id  : transaction.client_id;
                    setRecipientId(recipientId);
                    const url = user === 'Provider' ? '/Provider/Messages' : '/Client/Messages';
                    navigate(url);
                }}><img src='/icons/chat.png'/></button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionRow;
