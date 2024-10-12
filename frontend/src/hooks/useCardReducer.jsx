import { useReducer } from "react";

const cardInfoState = {
    cardNumber: '',
    cardName: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  }
  
  const cardInfoReducer = (state, action) => {
    switch (action.type){
      case 'SET_CARD_NUMBER':
        return { ...state, cardNumber: action.payload}
      case 'SET_CARD_NAME':
        return { ...state, cardName: action.payload}
      case 'SET_EXP_MONTH':
        return { ...state, expMonth: action.payload}
      case 'SET_EXP_YEAR':
        return { ...state, expYear: action.payload}
      case 'SET_CVC':
        return { ...state, cvc: action.payload}
      default:
        return {
          cardNumber: '',
          cardName: '',
          expMonth: '',
          expYear: '',
          cvc: ''
        }
    }
  }

  const useCardReducer = () => {
    const [state, dispatch] = useReducer(cardInfoReducer, cardInfoState);
    return {cardState: state, cardDispatch: dispatch}
}

export default useCardReducer;