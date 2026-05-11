import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Input, ModalFooter, Button } from 'reactstrap';
import { otpVerify } from 'store/actions';
import './authenticationModal.css';

const Select2faModal = ({ isOpen, onClose, next }) => {
  const dispatch = useDispatch()
  const [method, setMethod] = useState('GA');
  const toggle = () => {
    onClose(prev=>!prev);
  };
  const onContinue = () => {
     toggle()
    if(method==='GA') next(true);
    else dispatch(otpVerify())
  };
  const handleChange = e => {
    setMethod(e.target.value);
  };
  return (
    <>
      <Modal isOpen={isOpen} centered>
        <ModalHeader className="header2famethod" toggle={toggle}>
          Select Option To Setup 2FA
        </ModalHeader>
        <ModalBody>
          <div className="selcect2fabody">
            <div>
              <Input
                type="radio"
                name="method"
                value="GA"
                checked={method === 'GA'}
                onChange={handleChange}
              />
              <h5 className="radioinput">Google Authenticator </h5>
            </div>
            <div>
              <Input
                type="radio"
                value="none"
                name="method"
                checked={method === 'none'}
                onChange={handleChange}
              />
              <h5 className="radioinput"> None </h5>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="footer2famethod">
          <Button className='w-50' color="primary" onClick={onContinue}>
            Continue
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Select2faModal;
