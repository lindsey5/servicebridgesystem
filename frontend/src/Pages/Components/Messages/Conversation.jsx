import { useEffect, useState, useRef } from 'react';
import '../../styles/Conversation.css';
import useFetch from '../../../hooks/useFetch';
import defaultProfilePic from '../../../assets/user (1).png';
import createImageSrc from '../../../utils/createImageSrc';
import { formatDate } from '../../../utils/formatDate';

const Conversation = ({ recipientId, socket }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);
    const messageRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    const { data: recipientDetails } = useFetch(`/api/get/user-details/${recipientId}`);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
        }
    };
 
    useEffect(() => {
        const getImageSrc = async () => {
            if (recipientDetails?.profile_pic) {
                const src = await createImageSrc(recipientDetails.profile_pic.data);
                setImgSrc(src);
            }else{
                setImgSrc(defaultProfilePic);
            }
        };
        getImageSrc();

        // Fetch past messages when connecting
        socket.emit('fetch messages', recipientId);
        if(recipientId){
            socket.emit('join', recipientId)
        }

        // Listen for past messages
        socket.on('past messages', (pastMessages) => {
            setMessages(pastMessages.map(msg => ({
                id: msg.message_id,
                content: msg.content,
                from: msg.from_user_id,
                timestamp: msg.timestamp,
                }))
            );
        });

        // Listen for new messages
        socket.on('private message', (data) => {
            const newMessage = {
                id: data.message_id,
                content: data.content,
                from: data.from_user_id,
                timestamp: data.timestamp,
            };

            if(newMessage.from === recipientId){
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
            socket.emit('chat-partners')
        });

        return () => {
            socket.off('past messages'); // Remove past messages listener
            socket.off('private message'); // Remove private message listener
        };

    }, [recipientDetails, recipientId]);

    useEffect(() =>{
        scrollToBottom()
    },[messages]);

    const MessageBox = ({ message }) => {
        return (
            <div className={`message-box-container ${message.from === recipientId ? 'other' : 'you'}`}>
                {message.from === recipientId && imgSrc ? <img className='recipient-profile-pic' src={imgSrc}/> : ''}
                <div className='message-box'>
                <p className="message-content">{message.content}</p>
                <p className="timestamp">{formatDate(message.timestamp)}</p>
                </div>
            </div>
        );
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message) {
            const newMessage = {
                content: message,
                timestamp: new Date().toISOString(),
            };
        
            await socket.emit('private message', { to: recipientId, message });
            setMessages(prevMessages => [...prevMessages, newMessage]);
    
            messageRef.current.value = '';
            setMessage('');
            await socket.emit('chat-partners');
        }
    };
    
    return (
            <div className="conversation">
                 {recipientId &&
                    <form onSubmit={sendMessage}>
                    <div className="convo-container" ref={chatEndRef}>
                        <div className='recipient-details-container'>
                            <img src={imgSrc} />
                            <h2>{recipientDetails && recipientDetails.fullname}</h2>
                        </div>
                        {messages && messages.map(message => <MessageBox key={message.id} message={message} />)}
                    </div>
                    <div className="message-input-bar">
                        <input 
                            type='text' 
                            onFocus={async () => {
                                await socket.emit('seen', recipientId);
                                await socket.emit('chat-partners')
                            }}
                            ref={messageRef} 
                            maxLength="200" 
                            placeholder="Message" 
                            onChange={(e) => setMessage(e.target.value)} 
                        />
                        <button className="send-button">
                            <img src="/icons/send.png" alt="Send" />
                        </button>
                    </div>
                    </form>
                 }
            </div>
    );
};

export default Conversation;
