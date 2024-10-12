import React from 'react';
import './modal.css';
import logo from '../assets/customer-service.png';
import { Link } from "react-router-dom";

const LoginModal = ({ show, hideModal }) => {
  if (!show) return null;

  return (
    <div className="auth-modal-container" id="login-modal">
      <div className="modal">
        <div onClick={hideModal} className="close-btn">X</div>
        <img src={ logo } alt="Customer Service" />
        <h1>Log In as</h1>
        <Link to='/Client/Login'>
          <button className="button">Client</button>
        </Link>
        <Link to='/Provider/Login'>
          <button className="button">Provider</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginModal;
