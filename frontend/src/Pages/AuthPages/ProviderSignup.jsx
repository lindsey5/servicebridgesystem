import { useState } from 'react';
import '../styles/signup.css';
import useSignupReducer from '../../hooks/useSignupReducer';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { sendProviderSignupVerificationCode, verifyCode } from '../../utils/emailUtils';
import BubbleCursor from '../Components/BubbleCursor';

const handleBlur = (e) => {
    if (e.target.value) {
        e.target.classList.add('has-value');
    } else {
        e.target.classList.remove('has-value');
    }
};

const handleFocus = (e) => {
    e.target.classList.add('has-value');
};

const signup = async ({e, state, dispatch, confirmPass, navigate}) =>{
    e.preventDefault();
    
    dispatch({type: 'CLEAR_ERROR'})

    if(state.password !== confirmPass){
        dispatch({type: 'SET_ERROR', payload: 'Password doesn\'t match'});
    }else{
        try{
            const response = await fetch('/provider-signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                    firstname: state.firstname,
                    lastname: state.lastname,
                    address: state.address,
                    location: state.location
                }),
                credentials: 'include'
            });
            const result = await response.json();
            if(result.errors){
                dispatch({type: 'SET_ERROR', payload: result.errors.username});
                dispatch({type: 'SET_ERROR', payload: result.errors.password});
            }

            if(response.ok){
                navigate('/Provider/Dashboard');
            }

        }catch(err){
            console.error(err);
        }
    }
}

const nextPage = ({e, state, dispatch, setShowFirstPage, setShowSecondPage}) =>{
    e.preventDefault();
    let errorFlag = false;
    dispatch({type: 'CLEAR_ERROR'})

    if(!state.location){
        errorFlag = true;
        dispatch({type: 'SET_ERROR', payload: 'Select Location'})
    }

    if(state.firstname.length > 50){
        errorFlag = true;
        dispatch({type: 'SET_ERROR', payload: 'First name is too long'})
    }

    if(state.lastname.length > 50){
        errorFlag = true;
        dispatch({type: 'SET_ERROR', payload: 'Last name is too long'})
    }
    
    if(state.address.length > 100){
        errorFlag = true;
        dispatch({type: 'SET_ERROR', payload: 'Address is too long'})
    }

    if(!errorFlag){
        dispatch({type: 'CLEAR_ERROR'})
        setShowFirstPage(false);
        setShowSecondPage(true);
    }
}

const FirstPage = ({state, dispatch, setShowFirstPage, setShowSecondPage}) => {
    const { data } = useFetch('/api/cities');

    return (
        <form onSubmit={(e) => nextPage({e, state, dispatch, setShowFirstPage, setShowSecondPage})}>
            <div className='first-page'>
                {state.errors && state.errors.map(error => <p className='error' key={error}>{error}</p>)}
                <div className='input-container'>
                    <input id='fn' type='text'
                        placeholder='Firstname'
                        value={state.firstname}
                        onChange={(e) => dispatch({type: 'SET_FIRSTNAME', payload: e.target.value})}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Firstname</span>
                </div>
                <div className='input-container'>
                    <input type='text'
                        placeholder='Lastname'
                        value={state.lastname}
                        onChange={(e) => dispatch({type: 'SET_LASTNAME', payload: e.target.value})}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Lastname</span>
                </div>
                <div className='input-container'>
                    <input type="text"
                        placeholder='Address'
                        value={state.address}
                        onChange={(e) => dispatch({type: 'SET_ADDRESS', payload: e.target.value})}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Address</span>
                </div>
                <div>
                   Location
                   <select style={{height: '30px', minWidth: '150px', display: 'block', outline: 'none'}} onChange={(e) => dispatch({type: 'SET_LOCATION', payload: e.target.value})}>
                    <option value=""></option>
                    {data?.cities && data.cities.map((city, i) => 
                        <option key={i} value={city}>{city}</option>
                    )}
                   </select>
                </div>
                <button>Next</button>
            </div>
        </form>
    );
};

const SecondPage = ({state, dispatch}) => {
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false);

    return (
        <form onSubmit={(e) => signup({e, confirmPass, state, dispatch, navigate})}>
            <div className='second-page'>
            {state.errors && state.errors.map(error => <p className='error' key={error}>{error}</p>)}
                <div className='input-container'>
                    <input type='password'
                        placeholder='Password*'
                        value={state.password}
                        onChange={(e) => dispatch({type: 'SET_PASSWORD', payload: e.target.value})}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Password*</span>
                </div>
                <div className='input-container'>
                    <input type="password"
                        placeholder='Confirm Password*'
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Confirm Password*</span>
                </div>
                <div className='check-box-container'>
                    <input type="checkbox" onClick={() => setIsAgreed(!isAgreed)}/>
                    I agree to
                    <a href="/terms" target='_blank'>Terms</a> 
                    and 
                    <a href="/privacy-policy" target='_blank'>Privacy Policy</a>
                </div>
                <button disabled={!isAgreed}>Sign up</button>
            </div>
        </form>
    );
};

const EmailPage = ({state, dispatch, setShowFirstPage, setShowEmailPage}) => {
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [code, setCode] = useState('');

    const sendCode = async (e) => {
        e.preventDefault();
        dispatch({type: 'CLEAR_ERROR'})
        if(state.email){
            const response = await sendProviderSignupVerificationCode(state.email);
            if(response.error){
                dispatch({type: 'SET_ERROR', payload: response.error})
            }else{
                setShowVerifyEmail(true)
            }
        }else{
            dispatch({type: 'SET_ERROR', payload: 'Enter an email'})
        }
    }

    const verify = async(e) => {
        e.preventDefault();
        const response = await verifyCode(code);
        dispatch({type: 'CLEAR_ERROR'})
        if(response.error){
            dispatch({type: 'SET_ERROR', payload: response.error})
        }else{
            setShowFirstPage(true)
            setShowEmailPage(false)
        }
    }

    return(

                <form className='email-page' onSubmit={!showVerifyEmail ? sendCode : verify}>
                    {!showVerifyEmail && 
                        <>
                            {state.errors && state.errors.map(error => <p className='error' key={error}>{error}</p>)}
                            <div className='input-container'>
                                <input type='email'
                                    placeholder='Enter Email'
                                    value={state.email}
                                    onChange={(e) => dispatch({type: 'SET_EMAIL', payload: e.target.value})}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    required
                                />
                                <span>Enter Email</span>
                            </div>
                            <button>Submit</button>
                        </>
                    }
                    {showVerifyEmail && 
                        <>
                            <h3>Verify Your Email Address</h3>
                            <p style={{color: 'grey', fontSize: '15px'}}>In order to verify your email, please enter the code we sent to:</p>
                            <h4 style={{marginTop: '10px'}}>{state.email}</h4>
                            {state.errors && state.errors.map(error => <p className='error' key={error}>{error}</p>)}
                            <div className='input-container'>
                                <input type='text'
                                    placeholder='Enter code'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    required
                                />
                                <span>Enter code</span>
                            </div>
                            <span className='resend' onClick={sendCode}>Resend</span>
                            <button>Verify Email</button>
                        </>
                    }

                </form>
    )
}

const ProviderSignup = () => {
    const { state, dispatch } = useSignupReducer();
    const [showEmailPage, setShowEmailPage] = useState(true);
    const [showFirstPage, setShowFirstPage] = useState(false);
    const [showSecondPage, setShowSecondPage] = useState(false);

    return (
        <div className="signup-page">
            <BubbleCursor />
            <img src="/icons/rb_4582.png" alt="" />
            <div className="container">
                <h1>Provider Signup</h1>
                {showEmailPage && 
                    <EmailPage 
                        state={state} 
                        dispatch={dispatch}
                        setShowFirstPage={setShowFirstPage}
                        setShowEmailPage={setShowEmailPage}
                    />
                }
                {showFirstPage && (
                    <FirstPage 
                        state={state}
                        dispatch={dispatch}
                        setShowFirstPage={setShowFirstPage}
                        setShowSecondPage={setShowSecondPage}
                    />
                )}
                {showSecondPage && (
                    <SecondPage 
                        state={state}
                        dispatch={dispatch}
                    />
                )}
                <p>Already have an account <a href="/Provider/Login">Login</a></p>
            </div>
        </div>
    );
};

export default ProviderSignup;
