import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './authenticationModal.css';

const Scan2FAModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const copyToCLipBoard = value => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      // console.log(err);
    }
  };
  const toggle = () => {
    onClose(prev => !prev);
  };
  const handleContinue = () => {
    navigate('/otp');
  };
  return (
    <>
      <Modal isOpen={isOpen} centered>
        <ModalHeader toggle={toggle}>Setup 2FA</ModalHeader>
        <ModalBody className="scan2fabodycontainer">
          <div className="scan2fabody">
            <h5>SCAN QR CODE</h5>
            <img
            alt=""
              className="scanimg"
              src="data:image/png;base64,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"
            />
            <h6>OR</h6>
            <div className="secretcode">
              <div>EEHEJHEHEBHCYU</div>

              <i
                role="button"
                className={copied ? 'fas fa-check color-green' : 'far fa-copy'}
                onClick={() => copyToCLipBoard('EEHEJHEHEBHCYU')}
              />
            </div>
            <div className="downloadtext">
              Download{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai?hl=en"
              >
                google authenticator
              </a>{' '}
              or{' '}
              <a href="https://authy.com/download/" target="_blank" rel="noreferrer">
                authy
              </a>{' '}
              to scan this code
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="footer2famethod">
          <Button color="primary" onClick={handleContinue}>
            Continue
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Scan2FAModal;
