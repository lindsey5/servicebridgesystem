import { useEffect, useState } from 'react';
import '../../styles/ChatPartners.css';
import useFetch from '../../../hooks/useFetch';
import createImageSrc from '../../../utils/createImageSrc';
import defaultProfilePic from '../../../assets/user (1).png';

const ChatPartners = ({ socket, chatPartners, setRecipientId }) => {

    const ChatPartnerDiv = ({ chat_partner }) => {
        const { data: userDetails } = useFetch(`/api/get/user-details/${chat_partner}`);
        const { data: latestMessage} = useFetch(`/api/latest-message/?you=${socket.id}&&partner=${chat_partner}`);
        const [imgSrc, setImgSrc] = useState(defaultProfilePic);
        
        const getImageSrc = async () => {
            if (userDetails?.profile_pic) {
                const src = await createImageSrc(userDetails.profile_pic.data);
                setImgSrc(src);
            }
        };

        if(userDetails && latestMessage){
            getImageSrc();  
        }
        
        return (
            <div key={chat_partner} className="chat-partner-container" 
                onClick={() => {
                    setRecipientId(chat_partner);  
                }}>
                <img className="partner-profile-pic" src={imgSrc} alt="Profile" />
                <div className='partner-details'>
                    {userDetails && <h3>{userDetails.fullname}</h3>}
                    {latestMessage && <p>{latestMessage.content}</p>}
                </div>
            </div>
        );
    };

    return (
        <section className="chat-partners">
            {chatPartners && chatPartners.map(partner => (
                <ChatPartnerDiv key={partner} chat_partner={partner} />
            ))}
        </section>
    );
};

export default ChatPartners;
