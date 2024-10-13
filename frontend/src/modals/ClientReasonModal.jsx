import { useContext, useState } from 'react';
import './transactionModal.css';
import { TransactionContext } from '../Context/TransactionContext';

const cancelTransaction = async ({reason, id, user}) => {
    const data = { reason, status: 'Cancelled', user: user.user }
    if(reason){
        if(confirm("Click OK to continue")){
            const response = await fetch(`/api//transactions/cancel/${id}`, {
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

const ReasonModal = ({setClientReasonModal, showClientReasonModal}) => {
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
        <div className="transaction-modal-container" style={{display: showClientReasonModal ? 'flex' : 'none'}}>
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
                    <button className="dont-cancel-btn" onClick={() => setClientReasonModal(false)}>Cancel</button>
                    <button className="continue-btn" onClick={() => cancelTransaction({reason, id: transactionContext.transactionId, user})}>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default ReasonModal;