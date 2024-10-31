import { useLocation, useNavigate, } from 'react-router-dom';
import './TransactionSummary.css';
import useFetch from '../../hooks/useFetch';
import { useEffect } from 'react';
import { createTransaction } from '../../services/transactionService';
import { createClientPaymentLink } from '../../services/paymentService';

const TransactionSummary = () => {
    useEffect(() => {
        document.title = "Transaction Summary";
    },[]);

    const location = useLocation();
    const navigate = useNavigate();
    const { provider, service_name, price, paymentMethod, date, time, provider_fullname } = location.state;
    const parsePrice = parseFloat(price);
    const formattedPrice = parsePrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const book = async () => {
        const date_id = await getDateId(date, provider);
        const data = {
            provider, 
            service_name,
            price,
            paymentMethod,
            date_id,
            time
        }

        if(paymentMethod === 'Cash on Pay'){
            const newTransaction = await createTransaction(data);
            if(newTransaction){
                navigate('/Client/Transactions');
            }else{
                alert('Book failed');
            }
        }else{
            const result = await createClientPaymentLink(data);
            if(result){
                window.location.href = result.checkout_url;
            }else{
                alert("Creating link error, please try again");
            }
        }
    }

    const getDateId = (date, provider) =>{
        return fetch(`/api/available-date/id?date=${date}&&provider_id=${provider}`)
        .then(response => response.json())
        .then(result => parseInt(result.date_id));
    }

    return (
        <div className="transaction-summary-container">
            <div className="transaction-summary">
                <h2>Transaction Summary</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Provider:</td>
                            <td>{provider_fullname}</td>
                        </tr>
                        <tr>
                            <td>Service Name</td>
                            <td>{service_name}</td>
                        </tr>
                        <tr>
                            <td>Price:</td>
                            <td>₱ {formattedPrice}</td>
                        </tr>
                        <tr>
                            <td>Payment Method:</td>
                            <td>{paymentMethod}</td>
                        </tr>
                        <tr>
                            <td>Date:</td>
                            <td>{date}</td>
                        </tr>
                        <tr>
                            <td>Time:</td>
                            <td>{time}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="buttons-container">
                    <button className="back-btn" onClick={()=> navigate(-1)}>Back</button>
                    <button className="book-btn" onClick={()=> book()}>Book</button>
                </div>
            </div>
        </div>
    )
}

export default TransactionSummary;