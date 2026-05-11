import { useDispatch, useSelector } from 'react-redux';
import { Col, Label, Form, Modal } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { commonSaga } from 'store/actions';

const PhoneInputModal = ({ close, next }) => {
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
      commonData: state.common,
  }));

  const [number, setNumber] = useState('');
  const [, setCountryCode] = useState('1');
  const [mobileNumber, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleChange = (num, data) => {
    const countryCode = data.dialCode;
    const phone = num.slice(countryCode.length);
    setPhone(phone);
    setCountryCode(countryCode);
    setNumber(num);
  };
  
  useEffect(() => {
      if(commonData?.sendOTPState?.fullResponse?.result) {
        close();
        next({withoutCountryCode: mobileNumber, withCountryCode: number});
      }
  }, [commonData?.sendOTPState?.dataObj]);

  const sendOtp = () => {  
    if (number) {
      dispatch(commonSaga({endPoint: `/auth/sendOTP`, type: "post", stateObj: "sendOTPState", dataToPost: {mobileNumber: number, channel: "SMS",}, msg: 'OTP Sent Successfully!', showAlert: true, baseEP: "AUTH", fullResRequired: true}));
    } else {
      setError('phone number is required');
    }
  };
  return (
    <>
      <div>
        <div>
          <Modal isOpen centered>
            <div className="modal-header justify-content-center">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Change Mobile Number
              </h5>
              <button
                type="button"
                onClick={close}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form>
                <div className="row mb-4">
                  <Label for="horizontal-firstname-Input">Mobile Number</Label>
                  <Col sm={12}>
                    <PhoneInput
                      inputClass="w-100 h-4"
                      country="us"
                      enableSearch
                      value={number}
                      onChange={handleChange}
                      autoFormat={false}
                      countryCodeEditable={false}
                    />
                  </Col>
                </div>
              </Form>
              <p style={{ color: 'red' }}>{error}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary waves-effect waves-light dropdownColor"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default PhoneInputModal;
