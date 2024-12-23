import { createContext, useState } from "react"

// Create a context for message recipient data
export const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState();

    return (
        // Provide message recipientId and message setRecipientId to context consumers
        <SocketContext.Provider value={{socket, setSocket}}>
            {children}
        </SocketContext.Provider>
    );
}
