import UserTransactions from "../Components/Transactions/UserTransactions"
import { useState, useEffect } from "react";
import { TransactionContextProvider } from "../../Context/TransactionContext";

const ClientTransactions = () =>{
    const [currentPage, setCurrentPage] = useState(1);
    const url = `/api/client/transactions?page=${currentPage}&limit=30`;
    useEffect(() => {
        document.title = "Transactions | Client";
    },[]);
    return (
        <TransactionContextProvider>
            <UserTransactions 
                url={url} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage}
            />
        </TransactionContextProvider>
    )
}

export default ClientTransactions