import { editServiceOfferedPrice } from '../services/servicesOfferedService';
import './EditServicePriceModal.css'

const EditPriceModal = ({serviceDetails, setServiceDetails, setEditModal, showEditModal}) => {

    // Function to updates the price of provider service offered
    async function updatePrice({service_id, price}) {
        // Validate the price
        if (!Number.isInteger(Number(price))) {
            alert("The price should not have decimals");
        }else{
            editServiceOfferedPrice(service_id, price);
        }
    }

    return(
        <div className="edit-price-modal" style={{display: showEditModal ? "flex" : "none" }}>
            <h1>Edit Price</h1>
            <input className="price" type="number" value={serviceDetails?.price} 
            onChange={(e) => setServiceDetails({service_id: serviceDetails.service_id, price: e.target.value})}/>
            <div className='edit-buttons'>
                <button className='submit' onClick={() => updatePrice({...serviceDetails}) }>Submit</button>
                <button className='cancel' onClick={() => setEditModal(false)}>Cancel</button>
            </div>
        </div>
    )
}

export default EditPriceModal;