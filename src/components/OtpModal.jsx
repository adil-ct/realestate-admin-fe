import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import OtpInput from "react18-input-otp";

import { commonSaga, commonSuccess } from 'store/actions';

const OtpModal = ({ close, next, data }) => {
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
      commonData: state.common,
  }));

  const [modalEdit, setModalEdit] = useState(false);
  const [otp, setOtp] = useState('');
  const [error] = useState('');
  const [time, setTime] = useState(30);
  const [timer, setTimer] = useState('');
  const handleChange = e => setOtp(e);
  const alterMobile = `${data?.withoutCountryCode}`.replace(/.(?=.{4})/g, 'X');

  const togEdit = () => setModalEdit(!modalEdit);

  useEffect(() => {
    if(commonData?.verifyOTPState?.fullResponse?.result) {
      const payload = {
        mobileNumber: data?.withoutCountryCode
      };

      dispatch(commonSaga({endPoint: `/admin/update-admin`, type: "put", stateObj: "updateAdminState", dataToPost: payload}));
    }
  }, [commonData?.verifyOTPState?.dataObj]);

  useEffect(() => {
    if(commonData?.updateAdminState?.dataUpdated) {
      close();
      next();
      dispatch(commonSuccess({stateObj: "updateAdminState", dataUpdated: false}));
      window.location.reload();
    }
  }, [commonData?.updateAdminState?.dataUpdated]);

  const verfiyOtp = () => {
    const payload = {
      mobileNumber: data?.withCountryCode,
      code: otp
    }
    dispatch(commonSaga({endPoint: `/auth/verifyOTP`, type: "post", stateObj: "verifyOTPState", dataToPost: payload, baseEP: "AUTH", fullResRequired: true}));
  };

  useEffect(() => {
    if (time) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setTime(time - 1);
        }, 1000),
      );
    }
  }, [time]);

  const resendOTP = () => {
    setTime(30);
    dispatch(commonSaga({endPoint: `/auth/sendOTP`, type: "post", stateObj: "sendOTPState", dataToPost: {mobileNumber: data?.withCountryCode, channel: "SMS" }, msg: 'OTP Sent Successfully!', showAlert: true, baseEP: "AUTH"}));
  }

  return (
    <>
      <div>
        <div>
          <Modal
            isOpen
            centered
            toggle={() => {
              togEdit();
            }}
          >
            <div className="modal-header justify-content-center">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Enter OTP
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
              <div className="">
                <div className="text-center">
                  <p className="text-muted mt-3">
                    Verify the code sent to your mobile <br />
                    number +{alterMobile} to Login.
                  </p>
                </div>
                <div className="d-flex flex-row mt-4 justify-content-center">
                  <OtpInput
                    numInputs={6}
                    value={otp}
                    onChange={handleChange}
                    isInputNum
                    inputStyle={{
                      padding: 10,
                      marginRight: 20,
                      border: '1px solid #828A9C',
                      borderRadius: 3,
                      width: 50,
                      height: 50,
                      textAlign:"center"
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <span className="d-block mobile-text">Don&apos;t receive the code?</span>{' '}
                &nbsp;&nbsp;
                {time ? (
                  <span className="font-weight-bold">
                    <p className="cursor-pointer">Resend code in {time} seconds</p>
                  </span>
                ) : (
                  <span className="font-weight-bold" onClick={resendOTP} style={{ cursor: 'pointer' }}>
                    <a className="cursor-pointer">Resend code</a>
                  </span>
                )}
              </div>
            </div>
            <p>{error}</p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary waves-effect waves-light dropdownColor"
                onClick={verfiyOtp}
              >
                Verify OTP
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default OtpModal;
