import io from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import '../../styles/Messages.css'
import ChatPartners from './ChatPartners';
import Conversation from './Conversation';
import { RecipientContext } from '../../../Context/RecipientContext';

const Messages = () => {
    const [socket, setSocket] = useState(null);
    const { data } = useFetch('/api/getToken');
    const [chatPartners, setChatPartners] = useState([]);
    const {recipientId, setRecipientId} = useContext(RecipientContext);

    useEffect(() => {
        const token = data?.token;
        document.title = "Messages | Client";
        if (token) {
            const socketConnection = io('http://localhost:4000', {
                query: { token }, 
            });
            setSocket(socketConnection);
            return () => {
                socketConnection.disconnect();
            };
        }
    }, [data]);

    useEffect(()=>{
        if(socket) fetchChatPartners(socket);
    },[socket]);

    function fetchChatPartners(socket){
        socket.emit('chat-partners');
        socket.on('chat-partners', (chatPartners) => {
            setChatPartners(chatPartners);
        });
    }

    return (
        <div className="messages">
            {socket && chatPartners && <ChatPartners socket={socket} chatPartners={chatPartners} setRecipientId={setRecipientId}/>}
            {socket && recipientId && <Conversation recipientId={recipientId} socket={socket} fetchChatPartners={fetchChatPartners}/>}
        </div>
    );
};

export default Messages;
