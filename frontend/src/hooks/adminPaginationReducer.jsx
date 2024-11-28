import { useReducer } from "react"

const paginationState = {
    currentPage: 1,
    totalPages: 1,
    disabledNextbtn: false,
    disabledPrevBtn: false
}

const paginationReducer = (state, action) => {
    switch(action.type){
        case 'SET_CURRENT_PAGE':
            return { ...state, currentPage: action.payload}
        case 'SET_TOTAL_PAGES':
            return { ...state, totalPages: action.payload }
        case 'SET_DISABLED_NEXT_BTN':
            return { ...state, disabledNextbtn: action.payload }
        case 'SET_DISABLED_PREV_BTN':
            return { ... state, disabledPrevBtn: action.payload }
        default: 
            return state
    }
}


const useAdminPaginationReducer = () => {
    const [state, dispatch] = useReducer(paginationReducer, paginationState);

    return { state, dispatch}
}

export default useAdminPaginationReducer