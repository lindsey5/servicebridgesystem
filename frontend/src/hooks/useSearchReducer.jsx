import { useReducer } from "react";

// Initial state for the search result
const initialState = {
    price: 0, // Stores the selected price filter
    priceLabel: 'Any Price', // Label for the price filter
    currentPage: 1, // Tracks the current page in pagination
    disabledPrevBtn: true, // State to disable/enable the 'previous' button
    disabledNextBtn: true, // State to disable/enable the 'next' button
    paginationBtns: [], // Array for pagination buttons
    sortBy: null // Current sorting option selected
};

// Reducer function to handle state changes based on dispatched actions
const reducer = (state, action) => {
    switch (action.type) {
        // Sets the price value
        case 'SET_PRICE':
            return { ...state, price: action.payload };
        // Sets the label for the price filter
        case 'SET_PRICE_LABEL':
            return { ...state, priceLabel: action.payload };
        // Updates the current page for pagination
        case 'SET_CURRENT_PAGE':
            return { ...state, currentPage: action.payload };
        // Enables/disables the 'previous' pagination button
        case 'SET_DISABLED_PREV_BTN':
            return { ...state, disabledPrevBtn: action.payload };
        // Enables/disables the 'next' pagination button
        case 'SET_DISABLED_NEXT_BTN':
            return { ...state, disabledNextBtn: action.payload };
        // Sets the pagination buttons array
        case 'SET_PAGINATION_BTNS':
            return { ...state, paginationBtns: action.payload };
        // Sets the sorting option
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };
        // Default case returns the unchanged state
        default:
            return state;
    }
};

// Custom hook to use the search reducer and state
const useSearchReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return { state, dispatch }; // Return state and dispatch function
}

export default useSearchReducer;
