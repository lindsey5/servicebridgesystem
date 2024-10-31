import '../styles/header.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../../assets/user (1).png';
import useFetch from '../../hooks/useFetch';
import createImageSrc from '../../utils/createImageSrc';
import { useContext } from 'react';
import { ProviderContext } from '../../Context/ProviderContext';

const ProviderHeader = () =>{
    const { setHideSideBar } =  useContext(ProviderContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setShowDropdown(!showDropdown);
    };

    const logout = async () => {
        localStorage.removeItem('activeButton');
        window.location.href = '/logout';
    };

    const { data: providerData } = useFetch('/api/provider');
    const [profilePicSrc, setProfilePicSrc] = useState(null);

    useEffect(() => {
        const getImageSrc = async () => {
            if(providerData){
                setProfilePicSrc(providerData.profile_pic?.data ? await createImageSrc(providerData.profile_pic?.data) : null);
            }
        }
        getImageSrc();
    }, [providerData]);

    return (
    <header className='provider-header'>
        <div className="header-left-div">
            <button className="sidebar-toggle-btn" onClick={() => setHideSideBar(prev => !prev)}>
                <img src="/icons/menu.png" alt="menu" />
            </button>
            <h1 id="title" onClick={()=> navigate('/Provider/Dashboard')}>Hustle</h1>
        </div>
        <div className="user-container">
            <div className='chat-icon-container' onClick={()=> navigate('/Provider/Messages')}>
               <img src="/icons/chat.png" className='chat-icon' />
            </div>
            <img className="user-pic" 
                onClick={handleClick}
                src={ profilePicSrc ? profilePicSrc : defaultProfilePic } 
            />
            <div className="drop-down-setting" style={{ display: showDropdown ? 'flex' : 'none' }}>
                <img className="profile-picture" src={ profilePicSrc ? profilePicSrc : defaultProfilePic } />
                <h1 id="user-fullname">
                    {providerData?.firstname && providerData?.lastname && `${providerData.firstname} ${providerData.lastname}`}
                </h1>
                <button id="account-settings-btn" onClick={() => {
                    navigate('/Provider/Account');
                    setShowDropdown(false);    
                }}>
                    <img src="/icons/user.png" className="icon" alt="exit icon" />
                    Account Settings
                </button>
                <button id="logout" onClick={() => logout()}>
                    <img src="/icons/exit.png" className="icon" alt="exit icon" />
                    Log out
                </button>
            </div>
        </div>
    </header>
    )
}

export default ProviderHeader;