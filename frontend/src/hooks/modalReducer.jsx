import { useReducer } from "react";

const modalState = {
    showClientReason: false,
    showCancelledTransaction: false,
    showRateModal: false,
    showReviewedTransaction: false,
    showProviderReason: false
  }
  
  const modalReducer = (state, action) => {
    switch (action.type){
      case 'SHOW_CLIENT_REASON':
        return { ...state, showClientReason: action.payload}
      case 'SHOW_CANCELLED_TRANSACTION':
        return { ...state, showCancelledTransaction: action.payload}
      case 'SHOW_RATE_MODAL':
        return { ...state, showRateModal: action.payload}
      case 'SHOW_REVIEWED_TRANSACTION':
        return { ...state, showReviewedTransaction: action.payload}
      case 'SHOW_PROVIDER_REASON':
        return { ...state, showProviderReason: action.payload}
      default:
        return { 
            showClientReason: false,
            showCancelledTransaction: false,
            showRateModal: false,
            showReviewedTransaction: false,
            showProviderReason: false
          }
    }
  }

  const useModalReducer = () => {
    const [state, dispatch] = useReducer(modalReducer, modalState);
    return {modal_state: state,modal_dispatch: dispatch}
}

export default useModalReducer;