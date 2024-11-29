import { useLocation, } from 'react-router-dom';
import './ClientSearchResult.css';
import { useEffect, useRef, useState } from 'react';
import useSearchReducer from '../../hooks/useSearchReducer';
import ProviderProfile from './ProviderProfile';
import '../styles/Loader.css';
import { fetchSearchResults } from '../../services/searchResultService';
import useFetch from '../../hooks/useFetch';

const ClientSearchResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const service_name = queryParams.get('searchTerm');
    const {state, dispatch} = useSearchReducer();
    const filterCheckBoxesRef = useRef([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data } = useFetch('/api/cities');

    useEffect(() => {
        document.title = "Search Result | Client";
    },[]);

    useEffect(() => {
        const fetchData = async () => {
            const searchResults = await fetchSearchResults(service_name, state)
            if(searchResults){
                setResults(searchResults);
                dispatch({ type: 'SET_DISABLED_NEXT_BTN', payload: state.currentPage === searchResults.totalPages });
                dispatch({ type: 'SET_DISABLED_PREV_BTN', payload: state.currentPage === 1 });
                generatePaginationButtons(searchResults.totalPages);
            }else{
                setResults(null);
            }
            setLoading(false);
        };
        setLoading(true);
        fetchData();
    }, [state.currentPage, state.price, state.sortBy, service_name, state.location]);

    const handleClick = (page) => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
    }

    const generatePaginationButtons = (totalPages) => {
        let startPage = Math.max(state.currentPage - 2, 1);
        let endPage = Math.min(state.currentPage + 2, totalPages);
        let paginationBtns = [];
        for (let i = startPage; i <= endPage; i++) {
            paginationBtns.push(
                <button key={i} className='pagination-btn'
                onClick={()=> handleClick(i)}
                style={ {backgroundColor: state.currentPage === i ? 'rgb(3, 117, 247)' : '' , color: state.currentPage === i ? 'white' : ''}
                }>{i}</button>
            );
        }
        dispatch({type: 'SET_PAGINATION_BTNS', payload: paginationBtns});
    }

    const handlePrice = (value) => {
        const prices = [1000, 1500, 2000, 2500, 5000, 10000, 0];
        const priceValue = prices[value - 1];
        dispatch({ type: 'SET_PRICE', payload: priceValue });
        dispatch({ type: 'SET_PRICE_LABEL', payload: value === '7' ? 'Any Price' : `Below ₱${priceValue}` });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    };

    const nextPage = () => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1 });
    }

    const prevPage = () => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage - 1 });
    }

    const filterSearch = (sortBy, target) => {
        if (target.checked) {
            filterCheckBoxesRef.current.forEach(checkbox => {
                if (checkbox && checkbox !== target) checkbox.checked = false;
            });
    
            switch (sortBy) {
                case 'priceHigh':
                    dispatch({ type: 'SET_SORT_BY', payload: ['price', 'DESC'] });
                    break;
                case 'priceLow':
                    dispatch({ type: 'SET_SORT_BY', payload: ['price', 'ASC'] });
                    break;
                case 'ratingHigh':
                    dispatch({ type: 'SET_SORT_BY', payload: ['rating', 'DESC'] });
                    break;
                default:
                    dispatch({ type: 'SET_SORT_BY', payload: '' });
                    break;
            }
        } else {
            dispatch({ type: 'SET_SORT_BY', payload: null });
        }
    };
    
    return (
        <div className='search-result' style={{alignItems: 'start'}}>
            <div className="container">
            <div className="filter-container">
                <div className="price-div">
                    <h2>Price</h2>
                    <input type="range" min="1" max="7" step="1" id="priceSlider" onChange={(e) => handlePrice(e.target.value)} disabled={loading ? true : false}/>
                    <p id="selectedPrice">{state.priceLabel}</p>
                </div>
                <div>
                    <p>Location</p>
                    <select style={{ height: '30px', width: '100%'}} onChange={(e) => dispatch({type: 'SET_LOCATION', payload: e.target.value})}>
                        <option value=""></option>
                        {data?.cities && data.cities.map((city, i) => 
                            <option key={i} value={city}>{city}</option>
                        )}
                    </select>
                </div>
                <div className="sort-div">
                    <h3>Sort By</h3>
                    <div>
                        <input type="checkbox" id="price-desc" className="filter-checkbox" onClick={(e) => filterSearch('priceHigh',e.target)}  ref={el => filterCheckBoxesRef.current[0] = el} />
                        <label htmlFor="price-desc">Price (Highest)</label>
                    </div>
                    <div>
                        <input type="checkbox" id="price-asc" className="filter-checkbox" onClick={(e) => filterSearch('priceLow', e.target)}  ref={el => filterCheckBoxesRef.current[1] = el}/>
                        <label htmlFor="price-asc">Price (Lowest)</label>
                    </div>
                    <div>
                        <input type="checkbox" id="rating-desc" onClick={(e) => filterSearch('ratingHigh', e.target)} className="filter-checkbox" ref={el => filterCheckBoxesRef.current[2] = el} />
                        <label htmlFor="rating-desc">Rating (Highest)</label>
                    </div>
                </div>
            </div>
            {loading && 
                <div className='loader-container' style={{width: '600px', display: 'flex', justifyContent: 'center'}}>
                    <div className="loader"></div>
                </div>}

            {!loading && 
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="search-results-container">
                    <h2>{!results ? 'No ' : ''}Results for "{service_name}"</h2>
                    {results ? results.providers.map(provider => <ProviderProfile key={provider.id} provider={provider}/>) : null}
                </div>
                <div className="pagination-controls">
                <button id="prevPage" disabled={state.disabledPrevBtn} style={{display: !results ? 'none' : ''}} onClick={prevPage}>&lt; Prev</button>
                <div className="pagination">
                    {results ? state.paginationBtns : null}
                </div>
                <button id="nextPage" disabled={state.disabledNextBtn} style={{display: !results ? 'none' : ''}} onClick={nextPage}>Next &gt;</button>
                </div>
            </div>}
            </div>
        </div>
    )
}

export default ClientSearchResult;