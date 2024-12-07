import createImageSrc from '../../utils/createImageSrc';
import defaultProfilePic from '../../assets/user (1).png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const ProviderProfile = ({provider}) => {
    const navigate = useNavigate();
    const [rating, setRating] = useState('No Reviews Yet');
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const [price, setPrice] = useState();
    const textareaRef = useRef(null);

    const book = () => {        
        const params = {
            id: provider.id,
            price: provider.price,
            service_name: provider.service_name,
            firstname: provider.firstname,
            lastname: provider.lastname
        }
        const encoded = encodeURIComponent(btoa(JSON.stringify(params)));
        navigate(`/Client/booking?data=${encoded}`);
     }

     useEffect(() =>{
        const setDetails = async() => {
            if(provider.profile_pic) setImgSrc(await createImageSrc(provider.profile_pic.data));
            setRating('Rating: ' + provider.rating + ' / 5 '); 

            const parsePrice = parseFloat(provider.price);
            const formattedPrice = parsePrice.toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });
            setPrice(formattedPrice);
        }

        setDetails();
     },[provider])

     useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = 'auto'; 
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }, [provider]);

    return (
            <div className='provider-container'>
                <h2 className='price'>₱ {price}</h2>
                <div className='left-div'>
                    <div className='img-container'>
                        <img src={imgSrc} alt='Provider' />
                    </div>
                    <a href={`/View/Reviews?id=${provider.id}&&service_name=${provider.service_name}`}>View Reviews</a>
                    <button className='book-btn' onClick={book}>Book Service</button>
                </div>
                <div className='details-div'>
                    <h1>{provider.firstname + ' ' + provider.lastname.charAt(0) + '.'}</h1>
                    <p>Location: {provider.location}</p>
                    <div className='rating-div'>
                        <span className='star'>★</span>
                        <p>{rating}</p>
                    </div>
                    <div className='bio-div'>
                        <h3>About the service:</h3>
                        <textarea
                            ref={textareaRef}
                            disabled
                            value={provider?.description}
                            placeholder="No description about the service"
                            />
                    </div>
                    <div className='bio-div' style={{marginTop: '20px'}}>
                        <h3>About Me:</h3>
                        <p>{provider.bio}</p>
                    </div>
                </div>
            </div>
    );
}

export default ProviderProfile;