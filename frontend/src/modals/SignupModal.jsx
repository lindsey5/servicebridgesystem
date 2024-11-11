import React from 'react';
import './modal.css';
import logo from '../assets/customer-service.png';
import { useNavigate } from 'react-router-dom';

const SignupModal = ({ show, hideModal }) => {
  if (!show) return null;
  const navigate = useNavigate();

  return (
    <div className="auth-modal-container" id="login-modal">
      <div className="modal">
        <div onClick={hideModal} className="close-btn">X</div>
        <img src={ logo } alt="Customer Service" />
        <h1>Sign Up as</h1>
        <button className="button" onClick={()=> navigate('/Client/Signup')}>Client</button>
        <button className="button" onClick={()=> navigate('/Provider/Signup')}>Provider</button>
      </div>
    </div>
  );
};

export default SignupModal;
