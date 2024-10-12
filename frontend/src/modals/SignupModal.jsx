import React from 'react';
import './modal.css';
import logo from '../assets/customer-service.png';

const SignupModal = ({ show, hideModal }) => {
  if (!show) return null;

  return (
    <div className="auth-modal-container" id="login-modal">
      <div className="modal">
        <div onClick={hideModal} className="close-btn">X</div>
        <img src={ logo } alt="Customer Service" />
        <h1>Sign Up as</h1>
        <button className="button">Client</button>
        <button className="button">Provider</button>
      </div>
    </div>
  );
};

export default SignupModal;
