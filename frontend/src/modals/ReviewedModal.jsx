import { TransactionContext } from '../Context/TransactionContext';
import './transactionModal.css';
import { useContext, useEffect, useRef, useState } from 'react';
import defaultProfilePic from '../assets/user (1).png';
import createImageSrc from '../utils/createImageSrc';

const ReviewedModal = ({modal_state, modal_dispatch}) =>{
    const {transactionId} = useContext(TransactionContext);
    const [reviewedTransaction, setReviewedTransaction] = useState();
    const [dateReviewed, setDateReviewed] = useState();
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const starRef = useRef([]);

    useEffect(() =>{
        const getReviewedTransaction = async() =>{
            if(transactionId){
                try{
                    const response = await fetch(`/api/transactions/reviewed/${transactionId}`);
                    if(response.ok){
                        const result = await response.json();
                        setReviewedTransaction(result);
                        const date = new Date(result.date_reviewed);
                        const formattedDate = date.toISOString().split('T')[0];
                        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        setDateReviewed(`${formattedDate} (${time})`);

                        const src = await createImageSrc(result.profile_pic.data);
                        setImgSrc(src);
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
        getReviewedTransaction();
    }, [modal_state.showReviewedTransaction]);

    useEffect(() =>{
        if(reviewedTransaction?.rating){
            for(let i = 0; i < starRef.current.length; i++){
                starRef.current[i].style.color = 'rgb(184, 217, 255)';
            }
            for(let i = 0; i < reviewedTransaction.rating; i++){
                starRef.current[i].style.color = 'rgb(3, 117, 247)';
            }
        }
    },[reviewedTransaction])

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