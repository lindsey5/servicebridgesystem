import { useReducer } from "react"

const initialState = {
    showFilterContainer: false,
    selectedStatus: [],
    date: null,
    transactions: null,
}
const transcationsReducer = (state, action) => {
    switch(action.type){
        case 'SET_FILTER_CONTAINER':
            return { ...state, showFilterContainer: action.payload }
        case 'SET_SELECTED_STATUS':
            return { ...state, selectedStatus: action.payload }
        case 'SET_DATE':
            return { ...state, date: action.payload }
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload }
    }
}

const useTransactionsReducer = () => {
    const [state, dispatch] = useReducer(transcationsReducer, initialState);
    return {state, dispatch}
}

export default useTransactionsReducer;