const CardPaymentContainer = ({cardDispatch, book, setShowCardPayment}) =>{
    const pay = async(e) => {
        e.preventDefault();
        book();
      }
  
      const validateMonth = (input) => {
        if(input.value > 12){
          const num = Math.floor(input.value / 10);
          input.value = num;
        }else if(input.value.length > 2){
          input.value = input.value.slice(0, 2);
        }else if(input.value < 0){
          input.value = '';
        }
        cardDispatch({type: 'SET_EXP_MONTH', payload: input.value}) 
      }
  
      const validateYear = (input) => {
        if(input.value.length > 4){
          const number = Math.floor(input.value / 10);
          input.value = number;
        }
        
        if(Number(input.value) < 1){
          input.value = '';
        }
  
        cardDispatch({type: 'SET_EXP_YEAR', payload: input.value}) 
      }
  
      const handleCVC = (input) => {
        if(!(input.value >= 1 || input.value <= 999)){
            input.value = input.value.slice(0, input.value.length - 1);
        }
        
        if(input.value.length > 3){
          input.value = Math.floor(input.value / 10);
        }
  
        cardDispatch({type: 'SET_CVC', payload: input.value}) 
      }

    return (
        <div className="card-payment-container">
        <form onSubmit={pay}>
          <img src="/icons/visa-mastercard.png" alt="" />
            <h2>Payment Details</h2>
          <div className="card-number-container"> 
            <label>Card Number</label>
            <input type="text" className="card-number" 
            onInput={(e)=> cardDispatch({type: 'SET_CARD_NUMBER', payload: e.target.value}) } 
            placeholder="123XXXXXXXXXXXXX" maxLength="16" required/>
          </div>
          <div className="name-on-card-container">
            <label>Name on card</label>
            <input type="text" 
            onInput={(e)=> cardDispatch({type: 'SET_CARD_NAME', payload: e.target.value}) } 
            placeholder="John Doe" required/>
          </div>
          <div className="other-card-details">
            <div className="expiry-date">
              <label>Expiry date</label>
              <div>
                <input className="month" type="number" min="1" max="12" placeholder="MM" onInput={(e) => validateMonth(e.target)} required/>
                <label>/</label>
                <input className="year" type="number" min="1" max="2100" placeholder="YYYY" onInput={(e) => validateYear(e.target)} required/>
              </div>
            </div>
            <div className="cvc-container">
              <label>CVC</label>
              <input type="password" placeholder="---" onInput={(e) => handleCVC(e.target)} required/>
            </div>
          </div>
          <div className="buttons">
            <button className="back-btn" onClick={() => setShowCardPayment(false)}>Back</button>
            <button className="pay-btn" type="submit">Pay</button>
          </div>
        </form>
      </div>
    )
}

export default CardPaymentContainer