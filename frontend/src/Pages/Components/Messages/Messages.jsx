import io from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import '../../styles/Messages.css'
import ChatPartners from './ChatPartners';
import Conversation from './Conversation';
import { RecipientContext } from '../../../Context/RecipientContext';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

const Messages = () => {
    const [socket, setSocket] = useState(null);
    const {recipientId, setRecipientId} = useContext(RecipientContext);

    useEffect(() => {
        document.title = "Messages | Client";
        const socketConnection = io(URL, {
            withCredentials: true,
        });
        setSocket(socketConnection);
    }, []);

    return (
        <div className="messages">
            {<ChatPartners socket={socket} setRecipientId={setRecipientId}/>}
            {socket && <Conversation recipientId={recipientId} socket={socket}/>}
        </div>
    );
};

export default Messages;