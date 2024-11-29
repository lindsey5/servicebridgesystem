import { useState } from 'react';
import '../styles/signup.css';
import useSignupReducer from '../../hooks/useSignupReducer';
import { useNavigate } from 'react-router-dom';

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
            const response = await fetch('/client-signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                    firstname: state.firstname,
                    lastname: state.lastname,
                    address: state.address
                }),
                credentials: 'include'
            });
            const result = await response.json();
            if(result.errors){
                dispatch({type: 'SET_ERROR', payload: result.errors.email});
                dispatch({type: 'SET_ERROR', payload: result.errors.password});
            }

            if(response.ok){
                navigate('/Client/Home');
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
        setShowSecondPage(true)
    }
}

const FirstPage = ({state, dispatch, setShowFirstPage}) => {
    return (
        <form onSubmit={(e) => nextPage({e, state, dispatch, setShowFirstPage})}>
            <div className='first-page'>
                {state.errors && state.errors.map(error => <p key={error}>{error}</p>)}
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
                <button>Next</button>
            </div>
        </form>
    );
};

const SecondPage = ({state, dispatch}) => {
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();
    return (
        <form onSubmit={(e) => signup({e, confirmPass, state, dispatch, navigate})}>
            <div className='second-page'>
            {state.errors && state.errors.map(error => <p key={error}>{error}</p>)}
                <div className='input-container'>
                    <input id='fn' type='text'
                        placeholder='Email'
                        value={state.email}
                        onChange={(e) => dispatch({type: 'SET_EMAIL', payload: e.target.value})}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Email</span>
                </div>
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
                <button>Sign up</button>
            </div>
        </form>
    );
};

const ClientSignup = () => {
    const { state, dispatch } = useSignupReducer();
    const [showFirstPage, setShowFirstPage] = useState(true);
    const [showSecondPage, setShowSecondPage] = useState(false);

    return (
        <div className="signup-page">
            <div className="container">
                <h1>Client Signup</h1>
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
                {

                }
                <p>Already have an account <a href="/Client/Login">Login</a></p>
            </div>
        </div>
    );
};

export default ClientSignup;
