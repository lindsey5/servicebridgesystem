import { useState } from 'react';
import '../styles/signup.css';
import useSignupReducer from '../../hooks/useSignupReducer';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

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
                    username: state.username,
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

const nextPage = ({e, state, dispatch, setShowFirstPage}) =>{
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
    }
}


const FirstPage = ({state, dispatch, setShowFirstPage}) => {
    const { data } = useFetch('/api/cities');

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
                <div>
                   <span>Location:</span>
                   <select style={{marginLeft: '15px', height: '30px'}} onChange={(e) => dispatch({type: 'SET_LOCATION', payload: e.target.value})}>
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
    return (
        <form onSubmit={(e) => signup({e, confirmPass, state, dispatch, navigate})}>
            <div className='second-page'>
            {state.errors && state.errors.map(error => <p key={error}>{error}</p>)}
                <div className='input-container'>
                    <input id='fn' type='text'
                        placeholder='Username'
                        value={state.username}
                        onChange={(e) => dispatch({type: 'SET_USERNAME', payload: e.target.value})}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        required
                    />
                    <span>Username</span>
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

const ProviderSignup = () => {
    const { state, dispatch } = useSignupReducer();
    const [showFirstPage, setShowFirstPage] = useState(true);

    return (
        <div className="signup-page">
            <div className="container">
                <h1>Provider Signup</h1>
                {showFirstPage && (
                    <FirstPage 
                        state={state}
                        dispatch={dispatch}
                        setShowFirstPage={setShowFirstPage}
                    />
                )}
                {!showFirstPage && (
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
