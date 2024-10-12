import '../styles/header.css';
import searchIcon from '../../assets/search.png';
import defaultProfilePic from '../../assets/user (1).png';
import { useState, useContext, useEffect } from 'react';
import { ClientContext } from '../../Context/ClientContext';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const ClientHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAutoComplete, setAutoComplete] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState([]);
    const context = useContext(ClientContext);
    const navigate = useNavigate();
    const results = useFetch('/api/services');

    const handleClick = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setAutoComplete(false);
        }, 200);
    };

    const handleFocus = () =>{
        if(searchTerm){
            setAutoComplete(true);
        }
    }

    const handleSearch = (value) => {
        setSearchTerm('');
        navigate(`/Client/Search/Result?searchTerm=${value}`);
    };

    const logout = async () => {
        localStorage.removeItem('user');
        window.location.href = '/logout';
    };

    // Debounce search input
    useEffect(() => {
        if(searchTerm !== ''){
            setAutoComplete(true);
        }else{
            setAutoComplete(false);
        }
        const handler = setTimeout(() => {
            if (results.data) {
                const filteredServices = results.data.services.filter(service =>
                    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setServices(filteredServices);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, results.data]);

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
                    aria-label="Search for services"
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
                <div className='chat-icon-container' onClick={() => navigate('/Client/Messages')}>
                    <img src="/icons/chat.png" className='chat-icon' alt="Chat Icon" />
                </div>
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
                    <button id="account-setting">Account Setting</button>
                    <button id="transactions-btn" onClick={() => navigate('/Client/Transactions')}>
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
