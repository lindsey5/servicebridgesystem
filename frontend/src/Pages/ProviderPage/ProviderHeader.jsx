import '../styles/header.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../../assets/user (1).png';
import useFetch from '../../hooks/useFetch';
import createImageSrc from '../../utils/createImageSrc';
import { useContext } from 'react';
import { ProviderContext } from '../../Context/ProviderContext';
import { SocketContext } from '../../Context/SocketContext';
import NotificationsButton from '../Components/Notifications/Notifications';

const ProviderHeader = () =>{
    const { setHideSideBar } =  useContext(ProviderContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext)
    const [deliveredMessages, setDeliveredMesssage] = useState(0);

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

    useEffect(() => {
        if(socket){
            socket.emit('delivered messages');
            socket.on('delivered messages', (deliveredMessages) => {
                setDeliveredMesssage(deliveredMessages)
            })

            socket.on('private message', async () => {
                socket.emit('delivered messages')
            })

            socket.on('chat-partners', () => {
                socket.emit('delivered messages');
            })

            socket.on('seen',async () => await socket.emit('delivered messages'))
        }
    }, [socket])

    return (
    <header className='provider-header'>
        <div className="header-left-div">
            <button className="sidebar-toggle-btn" onClick={() => setHideSideBar(prev => !prev)}>
                <img src="/icons/menu.png" alt="menu" />
            </button>
            <h1 id="title" onClick={()=> navigate('/Provider/Dashboard')}>Hustle</h1>
        </div>
        <div className="user-container">
            <button onClick={()=> {
                navigate('/Provider/Messages');
                setHideSideBar(false); 
            }}>
               <img src="/icons/chat.png" />
               {deliveredMessages > 0 && <span>{deliveredMessages}</span>}
            </button>
            <NotificationsButton socket={socket} user={'Provider'}/>
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
                    setHideSideBar(false);  
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