import { useContext, useEffect, useRef, useState } from 'react';
import './transactionModal.css';
import { TransactionContext } from '../Context/TransactionContext';
import { rateTransaction } from '../services/transactionService';

const RateModal = ({modal_state, modal_dispatch}) =>{
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const starsRef = useRef([]);
    const { transactionId } = useContext(TransactionContext);

    useEffect(() => {
        starsRef.current.forEach(star => {
           star.style.color = 'rgb(179, 225, 255)';
        });

        for(let i=0; i < rating; i++){
            starsRef.current[i].style.color = 'rgb(3, 117, 247)';
        }
    },[rating]);

    useEffect(() => {
        setRating(0);
    },[modal_state.showRateModal]);


    return (
        <div className="transaction-modal-container" style={{display: modal_state.showRateModal ? 'flex' : 'none'}}>
            <div className="rate-modal modal">
                <h2>Rate and Review</h2>
                <span id="rating">Rating ({rating}/5)</span>
                <div className="star-container">
                    <span className="star" ref={el => starsRef.current[0] = el} onClick={() => setRating(1)}>★</span>
                    <span className="star" ref={el => starsRef.current[1] = el} onClick={() => setRating(2)}>★</span>
                    <span className="star" ref={el => starsRef.current[2] = el} onClick={() => setRating(3)}>★</span>
                    <span className="star" ref={el => starsRef.current[3] = el} onClick={() => setRating(4)}>★</span>
                    <span className="star" ref={el => starsRef.current[4] = el} onClick={() => setRating(5)}>★</span>
                </div>
                <textarea className="review" onChange={(e) => setReview(e.target.value)} maxLength="100" placeholder="Enter your review here"></textarea>
                <div className="buttons">
                    <button className="cancel-rate-btn" onClick={() => modal_dispatch({type: 'SHOW_RATE_MODAL', payload: false})}>Cancel</button>
                    <button className="submit-rate-btn" onClick={()=> rateTransaction(rating, transactionId, review)}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default RateModal;