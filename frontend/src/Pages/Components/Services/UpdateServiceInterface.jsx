import { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import './ServiceModalStyle.css'
import { updateService } from '../../../services/servicesService';

const UpdateServiceInterface = ({data, close}) => {
    const { data: categories} = useFetch('/api/category')
    const [service_name, setServiceName] = useState('');
    const [category_name, setCategoryName] = useState('');

    useEffect(() => {
        if(data){
            setServiceName(data.service_name);
            setCategoryName(data.category_name)
        }
    }, [data])

    return(
        <div className="service-modal">
            <div className='container'>
                <h1>Update Service</h1>
                <p>Service Name</p>
                <input type="text" value={service_name} onChange={(e) => setServiceName(e.target.value)}/>
                <p>Category</p>
                <select onChange={(e) => setCategoryName(e.target.value)} value={category_name}>
                    <option value=""></option>
                    {categories && categories.map(category => 
                        <option key={category.category_name} value={category.category_name}>{category.category_name}</option>
                    )}
                </select>
                <button 
                    className='update-service-btn' 
                    onClick={() => updateService(data.service_name, category_name, service_name)}
                    disabled={!(category_name && service_name)}
                >Update</button>
                <button onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default UpdateServiceInterface;