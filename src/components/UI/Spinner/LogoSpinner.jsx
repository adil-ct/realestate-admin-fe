import React from 'react';
import { Spinner } from 'reactstrap';
// Logo removed for whitelabeling
import './Spinner.scss';

const LogoLoader = ({backdrop}) => (
  <>
    <div className="spinner-container">
      <div className="spinner-card">
        {/* Logo removed - showing only spinner */}
        <Spinner className="spinner-body spin-content" style={{ color: '#34c38f' }} />
      </div>
    </div>
    {backdrop && <div className="modal-backdrop show" />}
  </>
);

export default LogoLoader;
