import createImageSrc from '../../utils/createImageSrc';
import defaultProfilePic from '../../assets/user (1).png';
import { useNavigate, useLocation} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useFetch from '../../hooks/useFetch';

const ProviderProfile = ({provider}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const service_name = queryParams.get('searchTerm');
    const [rating, setRating] = useState('No Reviews Yet');
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const [price, setPrice] = useState();
    const [showDescription, setShowDescription] = useState();
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
      }, [showDescription]);

      const handleViewPortfolio = async () => {
        try{
            const response = await fetch(`/api/transactions/completed/total/${provider.id}`)
            if(response.ok){
                const result = await response.json()
                const data = {
                    id: provider.id,
                    fullname: `${provider.firstname} ${provider.lastname}`,
                    location: provider.location,
                    image: provider.profile_pic,
                    bio: provider.bio,
                    total_task: result.completed_transactions_total
                }
                localStorage.setItem('provider-data', JSON.stringify(data));
                navigate('/Client/View/Portfolio')
            }
        }catch(err){
            console.log(err)
        }
        
      }

    return (
            <div className='provider-container'>
                {showDescription && <div className='description'>
                <h2>{service_name}</h2>
                <p>Provider: {provider.firstname} {provider.lastname}</p>
                <textarea 
                    ref={textareaRef}
                    disabled
                    value={provider?.description}
                    placeholder="No description about the service"
                    style={{lineHeight: '2'}}
                ></textarea>
                <button onClick={() => setShowDescription(false)}>Close</button>
                </div>}
                <h2 className='price'>₱ {price}</h2>
                <div className='left-div'>
                    <div className='img-container'>
                        <img src={imgSrc} alt='Provider' />
                    </div>
                    <a href={`/Client/View/Reviews?id=${provider.id}&&service_name=${provider.service_name}`}>View Reviews</a>
                    <button className='book-btn' onClick={book}>Book Service</button>
                </div>
                <div className='details-div'>
                    <h1>{provider.firstname + ' ' + provider.lastname.charAt(0) + '.'}</h1>
                    <p>Location: {provider.location}</p>
                    <div className='rating-div'>
                        <span className='star'>★</span>
                        <p>{rating}</p>
                    </div>
                    <button onClick={() => setShowDescription(true)}>Description about the service</button>
                    <div className='bio-div' style={{marginTop: '20px'}}>
                        <h3>About Me:</h3>
                        <p>{provider.bio}</p>
                        <button onClick={handleViewPortfolio}>View Portfolio</button>
                    </div>
                </div>
            </div>
    );
}

export default ProviderProfile;