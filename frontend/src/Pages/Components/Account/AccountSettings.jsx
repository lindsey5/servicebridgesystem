import { useEffect, useState } from 'react'
import '../../styles/AccountSettings.css'
import createImageSrc from '../../../utils/createImageSrc';
import defaultProfilePic from '../../../assets/user (1).png';
import useFetch from '../../../hooks/useFetch';

const AccountSettings = ({data, handleUpdate, error}) => {
    const [details, setDetails] = useState();
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const [isUsernameDisabled, setUsernameDisabled] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingText, setSavingText] = useState('');
    const { data:cities } = useFetch('/api/cities');

    const setInfo = async() =>{
        if(data){
            if(data.profile_pic) setImgSrc(await createImageSrc(data.profile_pic.data));
            setDetails({...data, profile_pic: data.profile_pic ? data.profile_pic.data : null});
        }
    }

    useEffect(() =>{
        setInfo();
    },[data]);

    useEffect(() => {
        console.log(details)
    }, [details])

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a FileReader to read the file as an ArrayBuffer
            const reader = new FileReader();
    
            // Set the image source for preview
            const previewReader = new FileReader();
            previewReader.onload = () => {
                setImgSrc(previewReader.result); // Set the image source to the loaded file
            };
            previewReader.readAsDataURL(file); // Read the file for the preview
    
            // Read the file as an ArrayBuffer
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
    
                // Convert ArrayBuffer to a regular array
                const byteArray = new Uint8Array(arrayBuffer);
    
                // Set the profile_pic in your state as a regular array
                setDetails({ ...details, profile_pic: Array.from(byteArray) }); // Set as a regular array
            };
    
            reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
        }
    };

    const [count, setCount] = useState(0); 
    useEffect(() => {
        const intervalId = setInterval(() => {
          setCount(prev => prev + 1);
          setSavingText(prev => (count < 3 ? prev + '.' : ''));
    
          if (count >= 3) {
            setSavingText('');
            setCount(0);
          }
        }, 500);
    
        return () => clearInterval(intervalId); // Cleanup interval on unmount
      }, [count]);

    return(
        <div className='account-settings'>
            <div className='save-modal' style={{display: saving && !error ? 'flex' : 'none'}}>
            <div>
                <img src="/icons/logo4.jpg"/>
                <h2>Saving please wait{savingText}</h2>
            </div>
            </div>
            <div className='top-div' />
            <div className='container'>
                <div className='top-section'>
                    <h1>Account Settings</h1>
                    <span>ID: {details?.id}</span>
                </div>
                <div className='details-container'>
                    <div className='input-parent-container'>
                        <div className='error-div'>
                            <span>{error}</span>
                        </div>
                        <div className='input-container'>
                            <label>Firstname</label>
                            <input 
                                type="text" 
                                value={details?.firstname || ''} 
                                onInput={(e) => setDetails({...details, firstname: e.target.value })}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Lastname</label>
                            <input 
                                type="text" 
                                value={details?.lastname || ''} 
                                onInput={(e) => setDetails({...details, lastname: e.target.value })}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Username</label>
                            <input 
                                type="text" 
                                value={details?.username || ''} 
                                disabled={isUsernameDisabled}
                                onInput={(e) => setDetails({...details, username: e.target.value })}
                            />
                            <span onClick={() => setUsernameDisabled(!isUsernameDisabled) }>Change</span>
                        </div>
                        <div className='input-container'>
                        <label>Password</label>
                        <input 
                            type="password" 
                            disabled 
                            value={'********'}
                        />
                        <span>Change</span>
                        </div>
                        <div className='address-container'>
                            <label>Address</label>
                            <textarea 
                                className='address' 
                                value={details?.address || ''} 
                                onInput={(e) => setDetails({...details, address: e.target.value })}
                            />
                        </div>
                        {details?.bio && 
                        <div className='bio-container'>
                            <label>Bio</label>
                            <textarea 
                                className='bio' 
                                value={details.bio} 
                                onInput={(e) => setDetails({...details, bio: e.target.value })}
                            />
                        </div>}
                        {details?.location &&  
                        <div className='input-container'>
                            <label>Location</label>
                            <select style={{height: '30px'}} value={details?.location} onChange={(e) => setDetails({...details, location: e.target.value })}>
                                <option value=""></option>
                                {cities?.cities && cities.cities.map((city, i) => 
                                    <option key={i} value={city}>{city}</option>
                                )}
                            </select>
                        </div>}
                    </div>
                    <div className='profile-pic-parent-container'>
                        <img src={imgSrc} alt="profile_pic" />
                        <label htmlFor="fileInput">Upload a photo</label>
                        <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        id='fileInput'
                        />
                    </div>
                    <div className='buttons'>
                        <button className='reset-btn' onClick={setInfo}>Reset</button>
                        <button  className='save-btn' onClick={() => {
                            handleUpdate(details);
                            setSaving(true);
                        }}>Save</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AccountSettings