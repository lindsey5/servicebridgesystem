import { useState, useEffect, useRef, useContext } from "react";
import defaultProfilePic from '../../../assets/user (1).png'
import createImageSrc from "../../../utils/createImageSrc";
import { formatDate } from "../../../utils/formatDate";
import { RecipientContext } from "../../../Context/RecipientContext";
import { useNavigate } from "react-router-dom";

const Review = ({review, isProvider}) => {
    const starsRef = useRef([]);
    const client_img = review.transaction.client_account.profile_pic.data;
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const {firstname, lastname, id} = review.transaction.client_account;
    const fullname = firstname + ' ' + lastname;
    const date_reviewed = formatDate(review.date_reviewed);
    const {setRecipientId} = useContext(RecipientContext);
    const navigate = useNavigate();

    useEffect(() => {
        const setImageSrc =async () => {
            if(client_img){
                setImgSrc(await createImageSrc(client_img));
            }
        }
        setImageSrc();
    }, [client_img]);

    useEffect(() => {
        for(let i = 0; i<review.rating; i++){
            starsRef.current[i].style.color = 'rgb(3, 117, 247)'
        }

    },[review])
    return(
        <div className='review-container'>
            {isProvider && 
            <button className='message-btn' onClick={() => {
                    setRecipientId(id);
                    navigate('/Provider/Messages');
            }}><img src='/icons/chat.png'/></button>}
            <div className='client-container'>
                <img src={imgSrc} />
                <div>
                    <h3>{fullname.charAt(0)}......{fullname.charAt(fullname.length -1)}</h3>
                    <span className="star" ref={el => starsRef.current[0] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[1] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[2] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[3] = el}>★</span>
                    <span className="star" ref={el => starsRef.current[4] = el}>★</span>
                </div>
            </div>
            <div className='review-details'>
                <p>{date_reviewed}</p>
                <p>Service name: <span>{review.transaction.service_name}</span></p>
                <p>Review:</p>
                <p>{review.review.review}</p>
            </div>
        </div>
    )
}

export default Review