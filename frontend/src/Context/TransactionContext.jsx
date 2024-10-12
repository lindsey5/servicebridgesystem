import { createContext, useState } from "react"

export const TransactionContext = createContext();

export const TransactionContextProvider = ({children}) => {
    const [transactionId, setTransactionId] = useState(null);
    
    return (
        <TransactionContext.Provider value={{ transactionId, setTransactionId }}>
            {children}
        </TransactionContext.Provider>
    )
}