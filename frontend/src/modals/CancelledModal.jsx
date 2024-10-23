import './transactionModal.css';
import { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../Context/TransactionContext';
import { formatDate } from '../utils/formatDate';

const CancelledModal = ({modal_state, modal_dispatch}) =>{
    // Get the transactionId from the transaction context
    const { transactionId } = useContext(TransactionContext);
    // State to hold the data of the selected cancelled transaction
    const [cancelledTransaction, setCancelledTransaction] = useState();

    // Effect to fetch and set the data of the selected cancelled transaction
    useEffect(() => {
        if (transactionId) {
            // Function to get the cancelled transaction data
            const getCancelledTransaction = async () => {
                // Fetch the selected cancelled transaction using the transactionId
                const response = await fetch(`/api/transaction/cancelled/${transactionId}`);
                if (response.ok) {
                    const result = await response.json();
                    // Destructure the cancelled_date from the result and keep the rest in cancelledTransaction
                    const { cancelled_date, ...cancelledTransaction } = result.cancelled_transaction; 
                    // Set the cancelled transaction data and format the cancelled date
                    setCancelledTransaction({ ...cancelledTransaction, cancelled_date: formatDate(cancelled_date) });
                }
            };
            getCancelledTransaction(); // Call the function to fetch the data
        }
    }, [modal_state.showCancelledTransaction]); // Re-run the effect if showCancelledTransaction in modal state changes

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