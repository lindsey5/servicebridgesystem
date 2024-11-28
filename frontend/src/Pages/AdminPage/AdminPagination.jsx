import { useEffect } from 'react'
import './AdminPagination.css'

const AdminPagination = ({state, dispatch}) =>{

    useEffect(() => {
        console.log(state)
    }, [state])

    const handlePageClick = (i) => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: i})
    }
        
    const nextPage = () => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1})
    }
        
    const prevPage = () => {
        dispatch({type: 'SET_CURRENT_PAGE', payload: state.currentPage - 1})
    }

    const generatePaginationButtons = () => {
        let startPage = Math.floor((state.currentPage - 1) / 4) * 4 + 1;
        let endPage = Math.min(startPage + 3, state.totalPages);
        let paginationBtns = [];

        for (let i = startPage; i <= endPage; i++) {
            paginationBtns.push(
                <button key={i} className='pagination-btn'
                    onClick={() => handlePageClick(i)}
                    style={{
                        backgroundColor: state.currentPage === i ? '#0375f7' : '',
                        color: state.currentPage === i ? 'white' : ''
                    }}
                >{i}</button>
            );
        }
        return paginationBtns;
    };

    return (
            <div className="admin-pagination-controls">
                <button id="prevPage" disabled={state.disabledPrevBtn} className="pagination-button" onClick={prevPage}>{"<"}</button>
                    <div className="pagination">
                        {generatePaginationButtons()}
                    </div>
                <button id="nextPage" disabled={state.disabledNextbtn} className="pagination-button" onClick={nextPage}>{">"}</button>
            </div>
    );
}

export default AdminPagination