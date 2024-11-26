import { useEffect, useState, useRef } from 'react';
import './ChatBot.css'

const ChatBot = () => {
    const [messages, setMessages] = useState([{
        from: 'Bot', message: 'Hello! How can I assist you?'}
    ]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showBot, setShowBot] = useState('');
    const chatEndRef = useRef(null);

    const getBotResponse = async (message) => {
        const response = await fetch('/api/chat',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: message}),
        })
        
        const result = await response.json();
        const botMessage = result.message;
        setMessages(prev => [...prev, {from: 'Bot', message: botMessage}]);
    }

    const sendMessage = async (message, e) => {
        e.preventDefault();
        if(message){
            setLoading(true);
            setMessage('')
            setMessages(prev => [...prev, {from: 'You', message}])
            await getBotResponse(message)
            setLoading(false);
        }
    }

    useEffect(() => {
        if(chatEndRef.current){
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
        }
    }, [messages])

    return (
        <div className='chat-bot-container'>
             <div className="chat-bot-button" onClick={() => setShowBot(prev => !prev)}>
                <img src="/icons/chatbot.png" alt="" />
            </div>
            {showBot && <div className='container'>
                    <div className='header'>
                        <h2>Chat with HustleMate</h2>
                    </div>
                    <div className='messages-container' ref={chatEndRef}>
                    {messages && messages.map(message => 
                    <div className={`message-box ${message.from}`}>
                    {message.from === 'Bot' && <img src='/icons/chatbot.png' />}
                    <li>{message.message}</li>
                    </div>
                    )}
                    </div>
                    {!loading && <form className='input-container' onSubmit={(e) => sendMessage(message, e)}>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
                        <button type='submit'>Send</button>
                    </form>}
                </div>}
        </div>
    )

}

export default ChatBot;