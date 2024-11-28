import { useEffect, useState } from 'react';
import './TablePage.css';
import AdminPagination from './AdminPagination';
import useAdminPaginationReducer from '../../hooks/adminPaginationReducer';

const AdminServices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {state, dispatch} = useAdminPaginationReducer();
    const [services, setServices] = useState();

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
            <h1>Services</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <AdminPagination state={state} dispatch={dispatch} />
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                {
                    services && services.map(service => 
                        <tr key={service.service_name}>
                            <td>{service.service_name}</td>
                            <td>{service.category_name}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            </div>
            <button className='add-btn'>Add Service</button>
        </main>
    )

}

export default AdminServices