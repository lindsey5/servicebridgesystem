import { TransactionContext } from '../Context/TransactionContext';
import './transactionModal.css';
import { useContext, useEffect, useRef, useState } from 'react';
import defaultProfilePic from '../assets/user (1).png';
import createImageSrc from '../utils/createImageSrc';
import useFetch from '../hooks/useFetch';
import { formatDate } from '../utils/formatDate';

const ReviewedModal = ({modal_state, modal_dispatch}) =>{
    const { transactionId } = useContext(TransactionContext); // Get the transactionId from TransactionContext
    const [dateReviewed, setDateReviewed] = useState(); // State to store the date the transaction was reviewed
    const [imgSrc, setImgSrc] = useState(defaultProfilePic); // State to store the profile picture source
    const starRef = useRef([]); // Ref to store references to star elements
    const { data: reviewedTransaction } = useFetch(`/api/transaction/${transactionId}/reviewed`); // Fetch reviewed transaction data
    
    // Effect to set review details when reviewedTransaction data is available
    useEffect(() => {
        const setDetails = async () => {
            if (reviewedTransaction) {
                // Format and set the reviewed date
                setDateReviewed(formatDate(reviewedTransaction.date_reviewed));
                // Create an image source from the profile picture data
                const src = await createImageSrc(reviewedTransaction.profile_pic.data);
                setImgSrc(src); // Set the profile picture source
            }
        };
        setDetails(); // Call the function to set details
    }, [modal_state.showReviewedTransaction, reviewedTransaction]); // Re-run effect when the modal state or reviewedTransaction changes
    
    // Effect to update star colors based on the rating in the reviewedTransaction
    useEffect(() => {
        if (reviewedTransaction?.rating) {
            // Reset all stars to default color
            for (let i = 0; i < starRef.current.length; i++) {
                starRef.current[i].style.color = 'rgb(184, 217, 255)'; // Default star color
            }
            // Change the color of the filled stars based on the rating
            for (let i = 0; i < reviewedTransaction.rating; i++) {
                starRef.current[i].style.color = 'rgb(3, 117, 247)'; // Filled star color
            }
        }
    }, [reviewedTransaction]); // Re-run effect when reviewedTransaction changes
    

    return (
        <div className="transaction-modal-container modal-container" style={{display: modal_state.showReviewedTransaction ? 'flex' : 'none'}}>
            <div className="reviewed-modal modal">
                <div className="client">
                    <div className="client-profile-pic">
                        <img src={imgSrc}/>
                    </div>
                    <h3 id='client-name'>{reviewedTransaction && reviewedTransaction.fullname}</h3>
                </div>
                <h4 id='service-name'>{reviewedTransaction && reviewedTransaction.service_name}</h4>
                <h4>{reviewedTransaction && dateReviewed}</h4>
                <div className="rating">
                    <h4 id="rating">{reviewedTransaction && reviewedTransaction.rating} / 5</h4>
                    <span ref={el => starRef.current[0] = el } className="star">★</span>
                    <span ref={el => starRef.current[1] = el } className="star">★</span>
                    <span ref={el => starRef.current[2] = el } className="star">★</span>
                    <span ref={el => starRef.current[3] = el } className="star">★</span>
                    <span ref={el => starRef.current[4] = el }className="star">★</span>
                </div>
                <h4>Review:</h4>
                <div id='review'>{reviewedTransaction && reviewedTransaction.review}</div>
                <button className="close-btn" 
                onClick={() => modal_dispatch({type: 'SHOW_REVIEWED_TRANSACTION', payload: false})}>Close</button>
            </div>
        </div>
    )
}

export default ReviewedModal