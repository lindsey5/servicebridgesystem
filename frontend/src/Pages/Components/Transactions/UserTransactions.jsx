import { useEffect, useRef, useState } from 'react'
import '../../styles/transactions.css'
import TransactionRow from './TransactionRow';
import TransactionPagination from './TransactionPagination';
import ClientReasonModal from '../../../modals/ClientReasonModal';
import useTransactionsReducer from '../../../hooks/useTransactionsReducer';
import '../../styles/Loader.css';
import CancelledModal from '../../../modals/CancelledModal.jsx';
import RateModal from '../../../modals/RateModal.jsx';
import ReviewedModal from '../../../modals/ReviewedModal.jsx';
import ProviderReasonModal from '../../../modals/ProviderReasonModal.jsx';
import useModalReducer from '../../../hooks/modalReducer.jsx';
import { createTransactionObject } from '../../../services/transactionService.jsx';

const UserTransactions = ({url, currentPage, setCurrentPage}) =>{
    const {state, dispatch}  = useTransactionsReducer();
    const [filters, setFilters] = useState({statusArray: [], selectedDate: null});
    const [disabledNextBtn, setNextBtn] = useState(false);
    const [disabledPrevBtn, setPrevBtn] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const checkboxesRef = useRef([]);
    const dateInputRef = useRef(null);
    const {modal_state, modal_dispatch} = useModalReducer();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserType = async () =>{
            const response = await fetch('/api/user');
            if(response.ok){
                const {user} = await response.json();
                setUser(user);
            }
        }
        fetchUserType();
    },[url]);

    useEffect(()=>{
        async function fetchTransactions () {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({selectedStatus: state.selectedStatus, date: state.date})
            });
            const result = await response.json();
            const transactionInstances = await Promise.all(result.transactions.map((transactionData) => createTransactionObject(transactionData)));
           
            dispatch({ type: 'SET_TRANSACTIONS',payload: transactionInstances });
            setTotalPages(result.totalPages);
            currentPage === result.totalPages ? setNextBtn(true) : setNextBtn(false);
            currentPage === 1 ? setPrevBtn(true) : setPrevBtn(false);
            setLoading(false);
        }
        fetchTransactions();
    }, [state.selectedStatus, state.date, currentPage]);

    const handleClick = (target) =>{
        if (!target.checked) {
            setFilters({
                selectedDate: filters.selectedDate,
                statusArray: filters.statusArray.filter(status => status !== target.value)
            })
        } else {
            setFilters({
                selectedDate: filters.selectedDate,
                statusArray: [...filters.statusArray, target.value]
            })
        }
    }

    const setSelectedDate = (date) => {
        setFilters({
            selectedDate: date,
            statusArray: filters.statusArray
        })
    }

    const filterTable = () => {
        dispatch({ type: 'SET_SELECTED_STATUS', payload: filters.statusArray });
        dispatch({ type: 'SET_DATE', payload: filters.selectedDate });
    }

    const clearFilter = () => {
        dispatch({ type: 'SET_SELECTED_STATUS', payload: [] });
        dispatch({ type: 'SET_DATE', payload: null });
        setFilters({
            selectedDate: null,
            statusArray: []
        })
        checkboxesRef.current.forEach(checkbox => {
            checkbox.checked = false;
        });
        dateInputRef.current.value = '';
    }

    return(
        <div className="transactions">
            <ClientReasonModal modal_state={modal_state} modal_dispatch={modal_dispatch}/>
            <CancelledModal modal_state={modal_state} modal_dispatch={modal_dispatch}/>
            <RateModal modal_state={modal_state} modal_dispatch={modal_dispatch}/>
            <ReviewedModal modal_state={modal_state} modal_dispatch={modal_dispatch}/>
            <ProviderReasonModal modal_state={modal_state} modal_dispatch={modal_dispatch}/>
            {loading && 
                <div className='loader-container'>
                    <div className="loader"></div>
                </div>}
            {!loading && <div className="container">
                <div className="top-div">
                    <h2>Transactions</h2>
                    <div>
                        <div className="filter-div">
                            <button className="filter-button" onClick={()=> dispatch({type: 'SET_FILTER_CONTAINER', payload: !state.showFilterContainer})}>Filter<img src="/icons/filter.png" alt="Filter" /></button>
                            <div className="filter-container" style={{display: state.showFilterContainer ? 'block' : 'none'}}>
                                <div className="status-container">
                                    <p>Status</p>
                                    <div>
                                        <div><input type="checkbox" value="Requested" ref={el => checkboxesRef.current[0] = el} onClick={(e) => handleClick(e.target)} />Requested</div>
                                        <div><input type="checkbox" value="Accepted" ref={el => checkboxesRef.current[1] = el} onClick={(e) => handleClick(e.target)} />Accepted</div>
                                        <div><input type="checkbox" value="On Going" ref={el => checkboxesRef.current[2] = el} onClick={(e) => handleClick(e.target)} />On Going</div>
                                        <div><input type="checkbox" value="Finished" ref={el => checkboxesRef.current[3] = el} onClick={(e) => handleClick(e.target)} />Finished</div>
                                        <div><input type="checkbox" value="Completed" ref={el => checkboxesRef.current[4] = el} onClick={(e) => handleClick(e.target)} />Completed</div>
                                        <div><input type="checkbox" value="Cancelled" ref={el => checkboxesRef.current[5] = el} onClick={(e) => handleClick(e.target)} />Cancelled</div>
                                        <div><input type="checkbox" value="Reviewed" ref={el => checkboxesRef.current[6] = el} onClick={(e) => handleClick(e.target)} />Reviewed</div>
                                    </div>
                                </div>
                                <div className="date-container">
                                    <p>Date</p>
                                    <input type="date" ref={dateInputRef} onChange={(e) => setSelectedDate(e.target.value)}/>
                                </div>
                                <div className="buttons-div">
                                    <button className="clear-btn" onClick={clearFilter}>Clear All Filters</button>
                                    <button className="apply-btn" onClick={filterTable}>Apply</button>
                                </div>
                            </div>
                        </div>
                        {!loading && <TransactionPagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            disabledNextBtn={disabledNextBtn}
                            disabledPrevBtn={disabledPrevBtn}
                            setCurrentPage={setCurrentPage}
                        />}
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Provider</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>Service Name</th>
                                <th>Price</th>
                                <th>Payment Method</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Booked on</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {state.transactions && state.transactions.map((transaction, index) => (
                                    <TransactionRow 
                                        key={index} transaction={transaction} 
                                        index={index} 
                                        modal_state={modal_state}
                                        modal_dispatch={modal_dispatch}
                                        user={user}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    )
}

export default UserTransactions