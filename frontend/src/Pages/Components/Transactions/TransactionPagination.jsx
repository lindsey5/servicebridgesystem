import React from 'react';

const TransactionPagination = ({ totalPages, currentPage, setCurrentPage, disabledNextBtn, disabledPrevBtn }) => {

    const handlePageClick = (i) => {
        setCurrentPage(i);
    }
        
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    }
        
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const generatePaginationButtons = () => {
        let startPage = Math.floor((currentPage - 1) / 6) * 6 + 1;
        let endPage = Math.min(startPage + 5, totalPages);
        let paginationBtns = [];

        for (let i = startPage; i <= endPage; i++) {
            paginationBtns.push(
                <button key={i} className='pagination-btn'
                    onClick={() => handlePageClick(i)}
                    style={{
                        backgroundColor: currentPage === i ? 'rgb(3, 117, 247)' : '',
                        color: currentPage === i ? 'white' : ''
                    }}
                >{i}</button>
            );
        }
        return paginationBtns;
    };

    return (
            <div className="pagination-controls">
                <button id="prevPage" disabled={disabledPrevBtn} className="pagination-button" onClick={prevPage}>{"<"}</button>
                    <div className="pagination">
                        {generatePaginationButtons()}
                    </div>
                <button id="nextPage" disabled={disabledNextBtn}className="pagination-button" onClick={nextPage}>{">"}</button>
            </div>
    );
};

export default TransactionPagination;
