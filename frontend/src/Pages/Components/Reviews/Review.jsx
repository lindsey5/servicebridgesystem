import { useState, useEffect, useRef } from "react";
import defaultProfilePic from '../../../assets/user (1).png'
import createImageSrc from "../../../utils/createImageSrc";
import { formatDate } from "../../../utils/formatDate";

const Review = (review) => {
    const starsRef = useRef([]);
    const client_img = review.review.transaction.client_account.profile_pic.data;
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const {firstname, lastname} = review.review.transaction.client_account;
    const fullname = firstname + ' ' + lastname;
    const date_reviewed = formatDate(review.review.date_reviewed);

    useEffect(() => {
        const setImageSrc =async () => {
            if(client_img){
                setImgSrc(await createImageSrc(client_img));
            }
        }
        setImageSrc();
    }, [client_img]);

    useEffect(() => {
        for(let i = 0; i<review.review.rating; i++){
            starsRef.current[i].style.color = 'rgb(3, 117, 247)'
        }

    },[review])

    return(
        <div key={review.review.transaction_id} className='review-container'>
            <div className='client-container'>
                <img src={imgSrc} />
                <div>
                    <h3>{fullname}</h3>
                    <span className="star" ref={el => starsRef.current[0] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[1] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[2] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[3] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[4] = el}>★</span>
                </div>
            </div>
            <div className='review-details'>
                <p>{date_reviewed}</p>
                <p>Service name: <span>{review.review.transaction.service_name}</span></p>
                <p>Review:</p>
                <p>{review.review.review}</p>
            </div>
        </div>
    )
}

export default Review