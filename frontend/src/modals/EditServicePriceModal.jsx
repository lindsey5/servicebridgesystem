import { useEffect } from 'react';
import { editServiceOfferedPrice } from '../services/servicesOfferedService';
import './EditServicePriceModal.css'

const EditPriceModal = ({serviceDetails, setServiceDetails, setEditModal, showEditModal}) => {
    // Function to updates the price of provider service offered
    async function updatePrice({service_id, price, description}) {
        console.log(description)
        // Validate the price
        if (!Number.isInteger(Number(price))) {
            alert("The price should not have decimals");
        }else{
            editServiceOfferedPrice(service_id, price, description);
        }
    }

    return(
        <div className="edit-price-modal" style={{display: showEditModal ? "flex" : "none" }}>
            <h1>Edit Service</h1>
            <p>Price</p>
            <input className="price" type="number" value={serviceDetails?.price} 
            onChange={(e) => setServiceDetails(detail => ({...detail, price: e.target.value}))}/>
            <p>Description about the service</p>
            <textarea value={serviceDetails?.description} onChange={(e) => setServiceDetails(detail => ({...detail, description: e.target.value}))}>

            </textarea>
            <div className='edit-buttons'>
                <button className='submit' onClick={() => updatePrice({...serviceDetails}) }>Submit</button>
                <button className='cancel' onClick={() => setEditModal(false)}>Cancel</button>
            </div>
        </div>
    )
}

export default EditPriceModal;