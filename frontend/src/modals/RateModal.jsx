import { useContext, useEffect, useRef, useState } from 'react';
import './transactionModal.css';
import { TransactionContext } from '../Context/TransactionContext';
import { rateTransaction } from '../services/transactionService';

const RateModal = ({modal_state, modal_dispatch}) =>{
    const [rating, setRating] = useState(0); // State to store the current rating value
    const [review, setReview] = useState(''); // State to store the user's review text
    const starsRef = useRef([]); // Ref to store references to star elements
    const { transactionId } = useContext(TransactionContext); // Get the transactionId from the TransactionContext
    
    // Effect to update the star colors based on the current rating
    useEffect(() => {
        // Reset all stars to default color
        starsRef.current.forEach(star => {
           star.style.color = 'rgb(179, 225, 255)'; // Set default star color
        });
    
        // Change the color of the filled stars based on the rating
        for(let i = 0; i < rating; i++){
            starsRef.current[i].style.color = 'rgb(3, 117, 247)'; // Set filled star color
        }
    }, [rating]); // Re-run effect when rating changes
    
    // Effect to reset the rating when the rating modal is shown
    useEffect(() => {
        setRating(0); // Reset rating to 0
    }, [modal_state.showRateModal]); // Re-run effect when the showRateModal state changes
    


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