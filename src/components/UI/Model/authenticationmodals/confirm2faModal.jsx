import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, List } from 'reactstrap';
import { otpVerify } from 'store/actions';
import './authenticationModal.css';

const Confirm2faModal = ({ isOpen }) => {
  const [copied, setCopied] = useState(false);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const copyToCLipBoard = value => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setChecked(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleContinue = () => {
    dispatch(otpVerify());
  };
  const handleChange = e => {
    setChecked(e.target.checked);
  };
  return (
    <>
      <Modal isOpen={isOpen} centered>
        <ModalHeader>Setup 2FA</ModalHeader>
        <ModalBody className="scan2fabodycontainer">
          <div className="scan2fabody">
            <h5>Save your secret Recovery Password</h5>
            <div className="secretcode">
              <div>EEHEJHEHEBHCYU</div>

              <i
                role="button"
                className={copied ? 'fas fa-check color-green' : 'far fa-copy'}
                onClick={() => copyToCLipBoard('EEHEJHEHEBHCYU')}
              />
            </div>
            <List tag="ol" className="orderlist">
              <li>Copy your secret recovery code.</li>
              <li>Keep your secret recovery code safe.</li>
              <li>You will only be able to recover your account through this code.</li>
            </List>
            <div>
              <Input type="checkbox" checked={checked} onChange={handleChange} />
              <Label className="ml-1" check>
                Yes, I have copied the code
              </Label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="footer2famethod">
          <Button color="primary" className="w-50" onClick={handleContinue} disabled={!checked}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Confirm2faModal;
