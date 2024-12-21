import { useLocation } from "react-router-dom";
import './CompletedTransaction.css';

const CompletedTransaction = () => {
    const location = useLocation();

  // Step 1: Get the base64 encoded query parameter
  const encodedString = new URLSearchParams(location.search).get('data');

  // Step 2: Decode the base64 string
  const decodedString = atob(encodedString); // atob() decodes a base64 string

  // Step 3: Parse the decoded string back into an object
  const decodedObject = JSON.parse(decodedString);

  console.log(decodedObject)
  const formattedPrice = `₱ ${decodedObject.price.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
})}`;

    return <div className="completed-transaction">
        <div className="container">
            <img src="/icons/blue-check.png" alt="" />
            <h2>Transaction Details</h2>
            <p>ID: {decodedObject.transaction_id}</p>
            <div className="details">
                <p>Service: {decodedObject.service_name}</p>
                <p>Provider Name: {decodedObject.provider}</p>
                <p>Client Name: {decodedObject.client}</p>
                <p>Date And Time: {decodedObject.date} ({decodedObject.time})</p>
                <p>Status: <span>Completed</span></p>
            </div>
            <div className="amount">
                <h2>Amount</h2>
                <h2>{formattedPrice}</h2>
            </div>
            <button onClick={() => window.location.href = '/'}>Continue</button>
        </div>
        
    </div>

}

export default CompletedTransaction