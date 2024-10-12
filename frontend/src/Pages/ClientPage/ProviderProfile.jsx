import createImageSrc from '../../utils/createImageSrc';
import defaultProfilePic from '../../assets/user (1).png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProviderProfile = ({provider}) => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const generateResults = async () => {
            const imgSrc = provider.profile_pic ? await createImageSrc(provider.profile_pic.data) : defaultProfilePic;
            const rating = provider.rating === 0 ? 'No Reviews Yet' : 'Rating: ' + provider.rating + ' / 5 ';
            const providerPrice = JSON.stringify(provider.price);
            const parsePrice = parseFloat(providerPrice);
            const formattedPrice = parsePrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            const book = () => {
                const params = {
                    id: provider.id,
                    price: provider.price,
                    service_name: provider.service_name
                }
                const encoded = encodeURIComponent(btoa(JSON.stringify(params)));
                navigate(`/Client/booking?data=${encoded}`);
             }
            setProfile (
                <div className='provider-container'>
                    <h2 className='price'>₱ {formattedPrice}</h2>
                    <div className='left-div'>
                        <div className='img-container'>
                            <img src={imgSrc} alt='Provider' />
                        </div>
                        <a href=''>View Reviews</a>
                        <button className='book-btn'
                            onClick={book}
                        >
                            Book Service
                        </button>
                    </div>
                    <div className='details-div'>
                        <h1>{provider.firstname + ' ' + provider.lastname.charAt(0) + '.'}</h1>
                        <div className='rating-div'>
                            <span className='star'>★</span>
                            <p>{rating}</p>
                        </div>
                        <p className='address'>Location: {provider.city}</p>
                        <div className='bio-div'>
                            <p>About Me:</p>
                            <p>{provider.bio}</p>
                        </div>
                    </div>
                </div>
            );
        }
        generateResults();
    }, [provider]);

    return profile;
}

export default ProviderProfile;