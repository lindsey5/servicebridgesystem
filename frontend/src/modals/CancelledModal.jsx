import './transactionModal.css';
import { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../Context/TransactionContext';
import { formatDate } from '../utils/formatDate';

const CancelledModal = ({modal_state, modal_dispatch}) =>{
    const { transactionId } = useContext(TransactionContext);
    const [cancelledTransaction, setCancelledTransaction] = useState();

    useEffect(() =>{
        if(transactionId){
            const getCancelledTransaction = async () => {
                const response = await fetch(`/api/transactions/cancelled/${transactionId}`);
                if(response.ok){
                    const result = await response.json();
                    const {cancelled_date, ...cancelledTransaction } = result.cancelled_transaction;
                    setCancelledTransaction({...cancelledTransaction, cancelled_date: formatDate(cancelled_date)});
                }
            }
            getCancelledTransaction();
        }
    },[modal_state.showCancelledTransaction]);

    return (
        <div className="transaction-modal-container" style={{display: modal_state.showCancelledTransaction ? 'flex' : 'none'}}>
        <div className="view-cancelled-modal modal">
            <h2>Cancelled Transaction</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Transaction Id:</td>
                        <td>{cancelledTransaction?.transaction_id}</td>
                    </tr>
                    <tr>
                        <td>Service Name:</td>
                        <td>{cancelledTransaction?.transaction.service_name}</td>
                    </tr>
                    <tr>
                        <td>Cancelled By:</td>
                        <td>{cancelledTransaction?.cancelled_by}</td>
                    </tr>
                    <tr>
                        <td>Cancelled Date:</td>
                        <td>{cancelledTransaction?.cancelled_date }</td>
                    </tr>
                    <tr>
                        <td>Cancellation Reason:</td>
                        <td>{cancelledTransaction?.cancellation_reason}</td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button onClick={() => modal_dispatch({type: 'SHOW_CANCELLED_TRANSACTION', payload: false})}>Ok</button>
            </div>
        </div>
    </div>)
}

export default CancelledModal