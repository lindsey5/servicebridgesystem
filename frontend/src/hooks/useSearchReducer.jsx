import { useReducer } from "react";

const initialState = {
    price: 0,
    priceLabel: 'Any Price',
    currentPage: 1,
    disabledPrevBtn: true,
    disabledNextBtn: true,
    paginationBtns: [],
    sortBy: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRICE':
            return { ...state, price: action.payload };
        case 'SET_PRICE_LABEL':
            return { ...state, priceLabel: action.payload };
        case 'SET_CURRENT_PAGE':
            return { ...state, currentPage: action.payload };
        case 'SET_DISABLED_PREV_BTN':
            return { ...state, disabledPrevBtn: action.payload };
        case 'SET_DISABLED_NEXT_BTN':
            return { ...state, disabledNextBtn: action.payload };
        case 'SET_PAGINATION_BTNS':
            return { ...state, paginationBtns: action.payload };
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload }
        default:
            return state;
    }
};

const useSearchReducer = () =>{
    const [state, dispatch] = useReducer(reducer, initialState);
    return {state, dispatch}
}

export default useSearchReducer;