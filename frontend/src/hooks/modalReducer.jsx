import { useReducer } from "react";

// Initial state for the modal visibility
const modalState = {
  showClientReason: false,         // Modal for showing the client's reason
  showCancelledTransaction: false, // Modal for showing a cancelled transaction
  showRateModal: false,            // Modal for rating
  showReviewedTransaction: false,  // Modal for showing reviewed transactions
  showProviderReason: false        // Modal for showing the provider's reason
}

// Reducer function to handle state updates based on action types
const modalReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_CLIENT_REASON':
      return { ...state, showClientReason: action.payload }; // Toggle showClientReason modal
    case 'SHOW_CANCELLED_TRANSACTION':
      return { ...state, showCancelledTransaction: action.payload }; // Toggle showCancelledTransaction modal
    case 'SHOW_RATE_MODAL':
      return { ...state, showRateModal: action.payload }; // Toggle showRateModal
    case 'SHOW_REVIEWED_TRANSACTION':
      return { ...state, showReviewedTransaction: action.payload }; // Toggle showReviewedTransaction modal
    case 'SHOW_PROVIDER_REASON':
      return { ...state, showProviderReason: action.payload }; // Toggle showProviderReason modal
    default:
      // Reset all modals to false if the action type doesn't match any case
      return { 
        showClientReason: false,
        showCancelledTransaction: false,
        showRateModal: false,
        showReviewedTransaction: false,
        showProviderReason: false
      };
  }
}

// Custom hook to use the modal reducer
const useModalReducer = () => {
  const [state, dispatch] = useReducer(modalReducer, modalState); // Initialize reducer with modalState
  return {
    modal_state: state,     // Current state of the modals
    modal_dispatch: dispatch // Dispatch function to update the modal states
  };
}

export default useModalReducer;
