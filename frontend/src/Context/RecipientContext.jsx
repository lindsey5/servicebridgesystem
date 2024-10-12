import { createContext, useState } from "react"

export const RecipientContext = createContext();

export const RecipientContextProvider = ({children}) => {
    const [recipientId, setRecipientId] = useState(null);
    
    return (
        <RecipientContext.Provider value={{ recipientId, setRecipientId }}>
            {children}
        </RecipientContext.Provider>
    )
}