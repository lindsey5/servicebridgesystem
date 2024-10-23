import { useReducer } from "react";

// Initial state for transaction management
const initialState = {
    showFilterContainer: false, // Controls visibility of the filter container
    selectedStatus: [], // Stores the currently selected transaction statuses
    date: null, // Holds the selected date for filtering transactions
    transactions: null, // Stores the fetched transaction data
};

// Reducer function to manage state changes based on dispatched actions
const transactionsReducer = (state, action) => {
    switch(action.type) {
        // Toggles the visibility of the filter container
        case 'SET_FILTER_CONTAINER':
            return { ...state, showFilterContainer: action.payload };
        // Updates the selected transaction statuses
        case 'SET_SELECTED_STATUS':
            return { ...state, selectedStatus: action.payload };
        // Updates the date for filtering transactions
        case 'SET_DATE':
            return { ...state, date: action.payload };
        // Updates the transactions data
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload };
        // Default case returns the unchanged state (optional for error handling)
        default:
            return state;
    }
};

// Custom hook to encapsulate the transactions reducer logic
const useTransactionsReducer = () => {
    const [state, dispatch] = useReducer(transactionsReducer, initialState);
    return { state, dispatch }; // Return state and dispatch function
}

export default useTransactionsReducer;
