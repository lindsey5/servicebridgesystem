import { useContext, useState, useEffect } from 'react';
import './transactionModal.css';
import { TransactionContext } from '../Context/TransactionContext';
import { cancelTransaction } from '../services/transactionService';
import useFetch from '../hooks/useFetch';

const ReasonModal = ({modal_state, modal_dispatch}) => {
    const [reason, setReason] = useState('');
    const [showTextArea, setTextArea] = useState(false);
    const transactionContext = useContext(TransactionContext);
    const {data} = useFetch('/api/user');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if(data?.user){
            setUser(data.user);
        }
    }, [data]);

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
                    <button className="continue-btn" onClick={() => cancelTransaction({reason, id: transactionContext.transactionId, user})}>Continue</button>
                </div>
            </div>
        </div>
    )
}

export default ReasonModal;