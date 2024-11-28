import { useEffect, useState } from 'react';
import './TablePage.css';
import AdminPagination from './AdminPagination';
import useAdminPaginationReducer from '../../hooks/adminPaginationReducer';
import AddServiceInterface from './AddServiceInterface';
import UpdateServiceInterface from './UpdateServiceInterface';
import { deleteService } from '../../services/servicesService';

const AdminServices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [services, setServices] = useState();
    const [showAddService, setShowAddService] = useState(false)
    const [showUpdateService, setShowUpdateService] = useState(false);
    const [selectedService, setSelectedService] = useState();

    useEffect(() => {
        const fetchAirplanes = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            try{
                const response = await fetch(`/api/services/pagination?page=${state.currentPage}&&limit=50&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    state.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    state.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setServices(result.services)
                }
            }catch(err){

            }
        }

        fetchAirplanes();

    },[state.currentPage, searchTerm])

    useEffect(() => {
        document.title = "Services | Admin";
    }, []);

    return (
        <main className="table-page">
            {showAddService && <AddServiceInterface close={() => setShowAddService(false)}/>}
            {showUpdateService && <UpdateServiceInterface data={selectedService} close={() => setShowUpdateService(false)}/>}
            <h1>Services</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        services && services.map(service => 
                            <tr key={service.service_name}>
                                <td>{service.service_name}</td>
                                <td>{service.category_name}</td>
                                <td>
                                    <button onClick={() => {
                                        setSelectedService({
                                            service_name: service.service_name,
                                            category_name: service.category_name
                                        })
                                        setShowUpdateService(true);
                                    }}><img src="/icons/editing (1).png" alt="" /></button>
                                    <button onClick={() => deleteService(service.service_name)}><img src="/icons/trash-bin.png" alt="" /></button>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddService(true)}>Add Service</button>
        </main>
    )

}

export default AdminServices