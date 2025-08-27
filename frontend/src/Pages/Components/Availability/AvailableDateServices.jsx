import { useEffect, useState } from 'react'
import useFetch from '../../../hooks/useFetch'
import './AvailableDateServices.css'
import { create_available_date_service, delete_available_date_service } from '../../../services/availableDateService';

const AvailableDateServices = ({selectedDate, availableDateServices, setShowTime}) =>{
    const [showAddService, setShowAddService] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [error, setError] = useState('');
    const { data } = useFetch('/api/services-offered');
    const [timeSlot, setTimeSlot] = useState('');

    useEffect(() =>{
        if(data?.services){
            setSelectedService(data.services[0]?.service_id);
        }
    },[data])

    useEffect(() => {
        const getAvailableTime = async() => {
            console.log(new Date())
            try{
                setTimeSlot('');
                const response = await fetch(`/api/available-time?date=${selectedDate}`);
                if(response.ok){
                    const result = await response.json();
                    setTimeSlot(result.time_slot);
                }
            }catch(err){
                console.log(err)
            }

        }
        getAvailableTime();
    }, [selectedDate])
    
    return (
        <div className='available-date-services'>
            <div className='add-service-modal' style={{display: showAddService ? 'flex' : 'none'}}>
                <div className='container'>
                    <h2>Select Service</h2>
                    <p style={{color: 'red'}}>{error}</p>
                    {data?.services ?
                        <select onChange={(e) => setSelectedService(e.target.value) }>
                            {data.services.map(service => 
                                <option key={service?.service_id} value={service?.service_id}>{service.service_name}</option>)
                            }
                        </select> :
                        <span>You don't have any services yet</span>
                    }
                    <div>
                    <button className="close-btn" onClick={() => setShowAddService(false)}>Close</button>
                    <button className='add-btn' onClick={() => create_available_date_service(selectedDate, selectedService, setError)}>Add</button>
                    </div>
                </div>
            </div>
                <div className='header'>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <h2>{selectedDate}</h2>
                        <h4>{timeSlot && `(${timeSlot})`}</h4>
                    </div>
                    <button 
                        onClick={setShowTime} 
                        disabled={selectedDate < new Date().toISOString().split('T')[0] ? true : false}
                    >Set Time</button>
                </div>
                <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableDateServices.length > 0 && 
                        availableDateServices.map(service => 
                            <tr key={service.id}>
                                <td>{service.service_name}</td>
                                <td>₱ {service.price.toLocaleString('en-US', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
                                    })}
                                </td>
                                <td>
                                    <button
                                        onClick={() => delete_available_date_service(service.id)}
                                        disabled={
                                            selectedDate < new Date().toISOString().split('T')[0] ? true : false
                                        }
                                    >Remove</button>
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
                </div>
                <button className='add-service' onClick={()=> setShowAddService(true)} 
                    disabled={ selectedDate < new Date().toISOString().split('T')[0] ? true : false}
                >Add Service</button>
            </div>
    )
}

export default AvailableDateServices