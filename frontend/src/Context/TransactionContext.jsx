import { createContext, useState } from "react"

// Create a context for transaction data
export const TransactionContext = createContext();

export const TransactionContextProvider = ({children}) => {
    // State to store the transaction ID
    const [transactionId, setTransactionId] = useState(null);

    return (
        // Provide transactionId and setTransactionId to context consumers
        <TransactionContext.Provider value={{ transactionId, setTransactionId }}>
            {children}
        </TransactionContext.Provider>
    );
}
