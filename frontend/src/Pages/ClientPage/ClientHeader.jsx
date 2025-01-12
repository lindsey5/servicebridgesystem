import '../styles/header.css';
import searchIcon from '../../assets/search.png';
import defaultProfilePic from '../../assets/user (1).png';
import { useState, useContext, useEffect, useMemo } from 'react';
import { ClientContext } from '../../Context/ClientContext';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../Context/SocketContext';
import NotificationsButton from '../Components/Notifications/Notifications';

const ClientHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAutoComplete, setAutoComplete] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const context = useContext(ClientContext);
    const navigate = useNavigate();
    const results = useFetch('/api/services');
    const { socket } = useContext(SocketContext);
    const [deliveredMessages, setDeliveredMesssage] = useState(0);

    const handleClick = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setAutoComplete(false);
        }, 200);
    };

    const handleFocus = () =>{
        setAutoComplete(true);
    }

    const handleSearch = (value) => {
        if(value) {
            setSearchTerm('');
            navigate(`/Client/Search/Result?searchTerm=${value}`);
        }
    };

    const logout = async () => {
        window.location.href = '/logout';
    };

    const services = useMemo(() => {
        if(results.data){
            return results.data.services.filter(service =>
                service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }
        return []

    }, [searchTerm, results.data])


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
        <header className='client-header'>
            <h1 id="title" onClick={() => navigate('/Client/Home')}>Hustle</h1>
            <div className="middle-section">
                <input 
                    type="text" 
                    className="search-bar" 
                    placeholder="Search" 
                    onFocus={handleFocus}
                    onBlur={handleBlur} 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button className="search-button" onClick={() => handleSearch(searchTerm)}>
                    <img className="search-icon" src={searchIcon} alt="Search Icon" />
                </button>
                <div className="auto-complete" style={{ display: showAutoComplete ? 'block' : 'none' }}>
                    {services.length > 0 ? (
                        services.map((service, index) => (
                            <div 
                                key={index} 
                                className="service" 
                                onClick={() => handleSearch(service.service_name)}
                            >
                                {service.service_name}
                            </div>
                        ))
                    ) : (
                        <div>No Results</div>
                    )}
                </div>
            </div>
            <div className="user-container">
                <button onClick={() => navigate('/Client/Messages')}>
                    <img src="/icons/chat.png" alt="Chat Icon" />
                    {deliveredMessages > 0 && <span>{deliveredMessages}</span>}
                </button>
                <NotificationsButton socket={socket} user={'Client'}/>
                <img 
                    className="user-pic" 
                    src={context.profile_pic ? context.profile_pic : defaultProfilePic} 
                    onClick={handleClick} 
                    alt="User Profile" 
                />
                <div className="drop-down-setting" style={{ display: showDropdown ? 'flex' : 'none' }}>
                    <img 
                        className="profile-picture" 
                        src={context.profile_pic ? context.profile_pic : defaultProfilePic} 
                        alt="User Profile" 
                    />
                    <h1 id="user-fullname">{context.fullname}</h1>
                    <button id="account-settings-btn" 
                        onClick={() => {
                            navigate('/Client/Account');
                            setShowDropdown(false);
                    }}>
                        <img src="/icons/user.png" className="icon" alt="Menu Icon" />
                        Account Settings
                    </button>
                    <button id="transactions-btn" 
                    onClick={() => {
                        navigate('/Client/Transactions');
                        setShowDropdown(false);
                    }}>
                        <img src="/icons/menu.png" className="icon" alt="Menu Icon" />Transactions
                    </button>
                    <button id="logout" onClick={logout}>
                        <img src="/icons/exit.png" className="icon" alt="Exit Icon" />Log out
                    </button>    
                </div>
            </div>
        </header>
    );
};

export default ClientHeader;
