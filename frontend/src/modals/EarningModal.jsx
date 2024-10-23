import { useEffect } from "react";
import useFetch from "../hooks/useFetch"
import './EarningModal.css'

const EarningModal = ({setShowEarningModal}) => {
    // Use custom hook useFetch to get the data from the API for provider earning history
    const { data, loading } = useFetch('/api/earning/provider/history'); 

    // Function to format numbers to a string with localized formatting
    const parseNum = (num) => {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 1, // Ensures at least one decimal place is shown
            maximumFractionDigits: 1 // Ensures at most one decimal place is shown
        });
    };

    // Component to display earning details for a single transaction
    const EarningDiv = ({ earning }) => {
        return (
            <div className="earning-div">
                <div>
                    <div className="peso-sign">₱</div> {/* Display the peso currency symbol */}
                    <div className="details">
                        <h4>{earning.transaction.service_name}</h4> {/* Display the name of the service */}
                        <span>{parseNum(earning.transaction.price) + ' - 5%'}</span> {/* Display the price with formatting and commission fee */}
                    </div>
                </div>
                <span>{earning.payment_date}</span> {/* Display the payment date */}
                <h3>{'+ ' + parseNum(earning.earnings)}</h3> {/* Display the earnings with a '+' sign and formatting */}
            </div>
        );
    };


    return (
        <div className="earning-modal">
            <h2>Earnings</h2>
            <div className="earnings-container">
            {loading && 
                <div className='loader-container'>
                    <div className="loader"></div>
            </div>}
            {data && data.map(earning => <EarningDiv key={earning.transaction_id} earning={earning}/>)}
            </div>
            <button className="close-btn" onClick={() => setShowEarningModal(false)}>Close</button>
        </div>
    )

}

export default EarningModal