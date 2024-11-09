import { createContext, useEffect, useState } from "react"

// Create a context for message recipient data
export const RecipientContext = createContext();

export const RecipientContextProvider = ({children}) => {
    // State to store the message recipient ID
    const [recipientId, setRecipientId] = useState(null);

    useEffect(() => {
        console.log(recipientId)
    }, [recipientId])

    return (
        // Provide message recipientId and message setRecipientId to context consumers
        <RecipientContext.Provider value={{ recipientId, setRecipientId }}>
            {children}
        </RecipientContext.Provider>
    );
}
