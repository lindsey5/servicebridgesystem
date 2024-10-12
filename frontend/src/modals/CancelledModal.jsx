import './transactionModal.css';
import { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../Context/TransactionContext';

const CancelledModal = ({showCancelledTran, setShowCancelledTran}) =>{
    const { transactionId } = useContext(TransactionContext);
    const [cancelledTransaction, setCancelledTransaction] = useState();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        // Convert to 12-hour format and determine AM/PM
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convert 0 hour to 12 for 12-hour format
      
        return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
      };

    useEffect(() =>{
        if(transactionId){
            const getCancelledTransaction = async () => {
                const response = await fetch(`/api/transactions/cancelled/${transactionId}`);
                if(response.ok){
                    const result = await response.json();
                    const {cancelled_date, ...cancelledTransaction } = result.cancelled_transaction;
                    const formattedDate = formatDate(cancelled_date);
                    setCancelledTransaction({...cancelledTransaction, cancelled_date: formattedDate});
                }
            }
            getCancelledTransaction();
        }
    },[showCancelledTran]);

    return (
        <div className="transaction-modal-container" style={{display: showCancelledTran ? 'flex' : 'none'}}>
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
                        <td>{cancelledTransaction?.cancelled_date}</td>
                    </tr>
                    <tr>
                        <td>Cancellation Reason:</td>
                        <td>{cancelledTransaction?.cancellation_reason}</td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button onClick={() => setShowCancelledTran(false)}>Ok</button>
            </div>
        </div>
    </div>)
}

export default CancelledModal