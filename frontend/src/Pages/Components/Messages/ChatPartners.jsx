import { useEffect, useState } from 'react';
import '../../styles/ChatPartners.css';
import createImageSrc from '../../../utils/createImageSrc';
import defaultProfilePic from '../../../assets/user (1).png';

const ChatPartners = ({socket, setRecipientId }) => {
    const [chatContacts, setChatContacts] = useState();
    const [showSide, setShowSide] = useState(true);
    const [chatPartners, setChatPartners] = useState();

    useEffect(()=>{
        if(socket) fetchChatPartners(socket);
    },[socket]);

    useEffect(() => {
        if(socket){
            socket.on('chat-partners', (chatPartners) => {
                setChatPartners(chatPartners);
            });
        }
        return () => {
            socket.off('chat-partners')
        }
    }, [])

    function fetchChatPartners(){
        socket.emit('chat-partners');
        socket.on('chat-partners', (chatPartners) => {
            setChatPartners(chatPartners);
        });
    }

    const setContacts = async () => {
        setChatContacts(
            await Promise.all(
                chatPartners.map(async (contact) => {
                    const userDetailsRes = await fetch(`/api/get/user-details/${contact.partner}`);
                    const userDetails = await userDetailsRes.json();
                    return { id: contact.partner, userDetails, latestMessage: contact.latestMessage };
                })
            )
        );
        
    }

    useEffect(() => {
        if(chatPartners){
            setContacts();
        }
    }, [chatPartners]);

    
    const handleSearch = (value) => {
        if(!value){
            setContacts();
        }else{
            console.log()
            setChatContacts(
                chatContacts.filter(contact => 
                    contact.userDetails?.fullname.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    }

    const handleBlur = () => {
        setContacts();
    }

    const handleShow = () => {
        setShowSide(!showSide);
    }

    const ChatPartnerDiv = ({contact }) => {
        const [imgSrc, setImgSrc] = useState(defaultProfilePic);
        const getImageSrc = async () => {
            if (contact.userDetails.profile_pic) {
                const src = await createImageSrc(contact.userDetails.profile_pic.data);
                setImgSrc(src);
            }
        };

        if(contact.userDetails){
            getImageSrc();  
        }
        
        return (
            <div key={contact} className="chat-partner-container" 
                onClick={() => {
                    setRecipientId(contact.id);  
                    setShowSide(false);
                }}>
                <img className="partner-profile-pic" src={imgSrc} alt="Profile" />
                <div className='partner-details'>
                    <h3>{contact.userDetails.fullname}</h3>
                   <p>{contact.latestMessage.content}</p>
                </div>
            </div>
        );
    };

    return (
        <section className={`chat-partners ${!showSide ? 'hide' : 'show'}`}>
            <button onClick={handleShow}>{!showSide ? '→' : '←'}</button>
            <div className='search-container'>
            <input type='text' className='search-input' placeholder='Search' onBlur={handleBlur} onChange={(e) => handleSearch(e.target.value)}/>
            </div>
            {chatContacts?.length < 1 && <h4>No contacts</h4>}
            <div className='contacts-container'>
                {chatContacts?.length > 0 && chatContacts.map(contact => (
                    <ChatPartnerDiv key={contact.id} contact={contact} />
                ))}
            </div>
        </section>
    );
};

export default ChatPartners;
