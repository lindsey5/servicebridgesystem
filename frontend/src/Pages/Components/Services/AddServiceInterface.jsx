import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import './ServiceModalStyle.css'
import { createService } from '../../../services/servicesService';

const AddServiceInterface = ({close}) => {
    const { data: categories} = useFetch('/api/category')
    const [service_name, setServiceName] = useState('');
    const [category_name, setCategoryName] = useState('');

    return(
        <div className="service-modal">
            <div className='container'>
                <h1>Add Service</h1>
                <p>Service Name</p>
                <input type="text" value={service_name} onChange={(e) => setServiceName(e.target.value)}/>
                <p>Category</p>
                <select onChange={(e) => setCategoryName(e.target.value)}>
                    <option value=""></option>
                    {categories && categories.map(category => 
                        <option key={category.category_name} value={category.category_name}>{category.category_name}</option>
                    )}
                </select>
                <button 
                    className='add-service-btn' 
                    onClick={() => createService(service_name, category_name)} 
                    disabled={!(category_name && service_name)}
                >Add Service</button>
                <button onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default AddServiceInterface;