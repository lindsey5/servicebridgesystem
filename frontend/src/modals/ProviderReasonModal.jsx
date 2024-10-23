import { useContext, useEffect, useState } from 'react';
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
        <div className="transaction-modal-container" style={{display: modal_state.showProviderReason ? 'flex' : 'none'}}>
            <div className="reason-modal modal">
            <h3>Select Reason for Cancellation</h3>
                <div className="reason">
                    <input type="radio" name="reason" value="Schedule Conflict" 
                    onClick={(e) => setCancellationReason(e.target)}/>Schedule Conflict
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Location Issues" 
                    onClick={(e) => setCancellationReason(e.target)}/>Location Issues
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Weather Conditions" 
                    onClick={(e) => setCancellationReason(e.target)}/>Weather Conditions
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Bad Past Experience with the client" 
                    onClick={(e) => setCancellationReason(e.target)}/>Bad Past Experience with the client
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Not Feeling Well" 
                    onClick={(e) => setCancellationReason(e.target)}/>Not Feeling Well
                </div>
                <div className="reason">
                    <input type="radio" name="reason" value="Lack of Preparation Time" 
                    onClick={(e) => setCancellationReason(e.target)}/>Lack of Preparation Time
                </div>
                <div className="reason">
                    <input type="radio" name="reason" id="other" value="Other"
                    onClick={(e) => setCancellationReason(e.target)}/>Other
                </div>
                <textarea maxLength="100" id="other-reason"onInput={(e) => setCancellationReason(e.target)} style={{display: showTextArea ? 'block' : 'none'}} />
                <div className="reason-modal-buttons-div">
                    <button className="dont-cancel-btn" onClick={() => modal_dispatch({type: 'SHOW_PROVIDER_REASON', payload: false})}>Cancel</button>
                    <button className="continue-btn" onClick={() => cancelTransaction(reason, transactionContext.transactionId, user)}>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default ReasonModal;