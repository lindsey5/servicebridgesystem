import './EditPriceModal.css'

const EditPriceModal = ({serviceDetails, setServiceDetails, setEditModal, showEditModal}) => {

    async function updatePrice({service_id, price}) {
        if (!Number.isInteger(Number(price))) {
            alert("The price should not have decimals");
        }else if(price < 500 ){
            alert("The minimum price is 500")
        }else{
            if(confirm('Click OK to continue')){
                try {
                    const response = await fetch(`http://localhost:3000/api/services-offered/${service_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({price}),
                        credentials: 'include'
                    });
                    const result = await response.json();
                    if(result){
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error updating price:', error);
                }
            }
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