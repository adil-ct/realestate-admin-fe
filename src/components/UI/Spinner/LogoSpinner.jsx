import React from 'react';
import { Spinner } from 'reactstrap';
import Logo from 'components/UI/Logo/Logo';
import './Spinner.scss';

const LogoLoader = ({ backdrop }) => (
  <>
    <div className="spinner-container">
      <div className="spinner-card">
        <Logo height={44} tone="light" className="spinner-logo-mark" />
        <Spinner className="spinner-body spin-content" style={{ color: '#C9A84C' }} />
      </div>
    </div>
    {backdrop && <div className="modal-backdrop show" />}
  </>
);

export default LogoLoader;
