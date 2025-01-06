import { useState } from 'react'
import './CustomizedInput.css'

const CustomizedInput = ({type, placeholder, onChange}) => {
    const [show, setShow] = useState(false);

    const handleFocus = (e) => {
        if(!e.target.classList.contains('has-value')){
            e.target.classList.add('has-value')
        }
    }

    const handleBlur = (e) => {
        if(!e.target.value) e.target.classList.remove('has-value')
    }

    return(
        <div className='customized-input-container'>
            <input 
                type={type === 'password' ? (show ? 'text' : 'password') :type} 
                placeholder={placeholder} 
                onFocus={handleFocus} 
                onBlur={handleBlur} 
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <span>{placeholder}</span>
            {type === 'password' && <img src={`/icons/${show ? 'hide' : 'show'}.png`} alt="" onClick={() => setShow(!show)}/>}
        </div> 
    )
}

export default CustomizedInput