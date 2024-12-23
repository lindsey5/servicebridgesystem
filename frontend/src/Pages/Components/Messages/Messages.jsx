import { useContext, useEffect } from 'react';
import '../../styles/Messages.css'
import ChatPartners from './ChatPartners';
import Conversation from './Conversation';
import { RecipientContext } from '../../../Context/RecipientContext';
import { SocketContext } from '../../../Context/SocketContext';

const Messages = () => {
    const { socket } = useContext(SocketContext);
    const {recipientId, setRecipientId} = useContext(RecipientContext);

    useEffect(() => {
        document.title = "Messages | Client";
    }, []);

    return (
        <div className="messages">
            {<ChatPartners socket={socket} setRecipientId={setRecipientId}/>}
            {socket && <Conversation recipientId={recipientId} socket={socket}/>}
        </div>
    );
};

export default Messages;