/* eslint-disable react/button-has-type */
import React from 'react';
import { Spinner } from 'reactstrap';
import './buttonloader.css';

const ButtonLoader = ({ text, loading, onClick, success, className, type, disabled }) => (
  <button
    type={type || "button"}
    onClick={onClick}
    disabled={disabled}
    className={className || (success ? 'button-success-loader' : 'button-loader')}
  >
    {loading ? (
      <Spinner size="sm" style={{ color: success ? '#1A2B4A' : '#ffffff' }} />
    ) : success ? (
      <span>
        <i className="fas fa-check success-icon" />
        {text}
      </span>
    ) : (
      text
    )}
  </button>
);

export default ButtonLoader;
