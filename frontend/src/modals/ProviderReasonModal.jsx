import { useContext, useState } from 'react';
import './transactionModal.css';
import { TransactionContext } from '../Context/TransactionContext';

const cancelTransaction = async ({reason, id, user}) => {
    const data = { reason, status: 'Cancelled', user: user.user }
    if(reason){
        if(confirm("Are you sure you want to cancel?")){
            const response = await fetch(`/api/transactions/cancel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            })
            if(response.ok){
                window.location.reload();
            }else{
                const result = await response.json();
                console.log(result);
                alert(result.message);
            }
        }
    }else{
        alert('Select a reason');
    }
}

const ReasonModal = ({modal_state, modal_dispatch}) => {
    const [reason, setReason] = useState('');
    const [showTextArea, setTextArea] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const transactionContext = useContext(TransactionContext);

    const setCancellationReason = (target) => {
        if(target.value === "Other"){
            setReason('');
            setTextArea(true);
        }else if(target.id === 'other-reason'){
            setReason(target.value);
        }else{
            setReason(target.value);
            setTextArea(false);
        }
    }

    return (
        <div className="transaction-modal-container" style={{display: showProviderReasonModal ? 'flex' : 'none'}}>
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
                    <button className="continue-btn" onClick={() => cancelTransaction({reason, id: transactionContext.transactionId, user})}>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default ReasonModal;