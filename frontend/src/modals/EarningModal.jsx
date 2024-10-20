import { useEffect } from "react";
import useFetch from "../hooks/useFetch"
import './EarningModal.css'

const EarningModal = ({setShowEarningModal}) => {

    const { data, loading } = useFetch('/api/earning/provider/history');
    
    const parseNum = (num) =>{
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        })
    }

    const EarningDiv = ({earning}) =>{
        return(
            <div className="earning-div">
                <div>
                    <div className="peso-sign">₱</div>
                    <div className="details">
                        <h4>{earning.transaction.service_name}</h4>
                        <span>{parseNum(earning.transaction.price) + ' - 5%'}</span>
                    </div>
                </div>
                <h3>{'+ ' + parseNum(earning.earnings)}</h3>
            </div>
        )
    }

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