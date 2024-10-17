import { useReducer } from "react";

const clientState = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    address: '',
    errors: []
}
  
const ClientSignupReducer = (state, action) => {
    switch (action.type){
        case 'SET_USERNAME':
            return { ...state, username: action.payload}
        case 'SET_PASSWORD':
            return { ...state, password: action.payload}
        case 'SET_FIRSTNAME':
            return { ...state, firstname: action.payload}
        case 'SET_LASTNAME':
            return { ...state, lastname: action.payload}
        case 'SET_ADDRESS':
            return { ...state, address: action.payload}
        case 'SET_ERROR':
            return { ...state, errors: [...state.errors, action.payload] }
        case 'CLEAR_ERROR':
            return { ...state, errors: []}
        default: 
            return state
    }
}

const useClientSignupReducer = () => {
    const [state, dispatch] = useReducer(ClientSignupReducer, clientState);
    return {state, dispatch}
}

export default useClientSignupReducer
