import { useContext, useState, useEffect } from 'react';
import './transactionModal.css';
import { TransactionContext } from '../Context/TransactionContext';
import { cancelTransaction } from '../services/transactionService';
import useFetch from '../hooks/useFetch';

const ReasonModal = ({modal_state, modal_dispatch}) => {
    const [reason, setReason] = useState(''); // State to store the reason for cancellation
    const [showTextArea, setTextArea] = useState(false); // State to control the visibility of the text area
    const transactionContext = useContext(TransactionContext); // Access the transaction context for managing transaction-related state
    const { data } = useFetch('/api/user'); // Fetch user data using the custom hook 'useFetch'
    const [user, setUser] = useState(null); // State to hold the current user information
    
    useEffect(() => {
        if (data?.user) {
            setUser(data.user); // Set the current user information if available
        }
    }, [data]); // Effect runs when 'data' changes
    
    // Function to handle setting the cancellation reason based on the selected option
    const setCancellationReason = (target) => {
        if (target.value === "Other") {
            setReason(''); // Clear the reason if the selected option is 'Other'
            setTextArea(true); // Show the text area for entering a custom reason
        } else if (target.id === 'other-reason') {
            setReason(target.value); // Set the reason if the target has an id of 'other-reason'
        } else {
            setReason(target.value); // Set the reason for other options
            setTextArea(false); // Hide the text area for custom input
        }
    };

    return (
        <div className="transaction-modal-container" style={{display: modal_state.showClientReason ? 'flex' : 'none'}}>
            <div className="reason-modal modal">
                <h3>Select Reason for Cancellation</h3>
                <div className="reason">
                    <input type="radio" name="reason" value="Found a Different Provider" 
                    onClick={(e) => setCancellationReason(e.target)}/>Found a Different Provider
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Service No Longer Needed" 
                    onClick={(e) => setCancellationReason(e.target)}/>Service No Longer Needed
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Booking Error" 
                    onClick={(e) => setCancellationReason(e.target)}/>Booking Error
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Booking Duplicate" 
                    onClick={(e) => setCancellationReason(e.target)}/>Booking Duplicate
                </div>
                <div className="reason">
                    <input type="radio" name="reason" id="other" value="Other"
                    onClick={(e) => setCancellationReason(e.target)}/>Other
                </div>
                <textarea maxLength="100" id="other-reason"
                onInput={(e) => setCancellationReason(e.target)}
                 style={{display: showTextArea ? 'block' : 'none'}} />
                <div className="reason-modal-buttons-div">
                    <button className="dont-cancel-btn" onClick={() => modal_dispatch({type: 'SHOW_CLIENT_REASON', payload: false})}>Cancel</button>
                    <button className="continue-btn" onClick={() => cancelTransaction(reason, transactionContext.transactionId, user)}>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default ReasonModal;