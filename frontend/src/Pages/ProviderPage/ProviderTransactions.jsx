import UserTransactions from "../Components/Transactions/UserTransactions"
import { useState, useEffect } from "react";
import { TransactionContextProvider } from "../../Context/TransactionContext";

const ProviderTransactions = () =>{
    const [currentPage, setCurrentPage] = useState(1);
    const url = `/api/provider/transactions?page=${currentPage}&limit=10`;
    useEffect(() => {
        document.title = "Transactions | Provider";
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

export default ProviderTransactions