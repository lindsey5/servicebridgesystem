import { useReducer } from "react";

// Initial state for client signup
const clientState = {
    username: '',     // Stores the client's username
    password: '',     // Stores the client's password
    firstname: '',    // Stores the client's first name
    lastname: '',     // Stores the client's last name
    address: '',      // Stores the client's address
    location: '',
    errors: []        // Stores any signup errors
}

// Reducer function to manage the signup form state
const ClientSignupReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERNAME':
            return { ...state, username: action.payload }; // Update username field
        case 'SET_PASSWORD':
            return { ...state, password: action.payload }; // Update password field
        case 'SET_FIRSTNAME':
            return { ...state, firstname: action.payload }; // Update first name field
        case 'SET_LASTNAME':
            return { ...state, lastname: action.payload }; // Update last name field
        case 'SET_ADDRESS':
            return { ...state, address: action.payload }; // Update address field
        case 'SET_LOCATION':
            return { ...state, location: action.payload };
        case 'SET_ERROR':
            return { ...state, errors: [...state.errors, action.payload] }; // Add a new error to the errors array
        case 'CLEAR_ERROR':
            return { ...state, errors: [] }; // Clear all errors
        default: 
            return state; // Return current state if no action matches
    }
}

// Custom hook to use the client signup reducer
const useClientSignupReducer = () => {
    const [state, dispatch] = useReducer(ClientSignupReducer, clientState); // Initialize reducer with clientState
    return { state, dispatch }; // Return current state and dispatch function
}

export default useClientSignupReducer;