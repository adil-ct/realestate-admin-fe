import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, CardBody, Card, Container, Alert, Spinner } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import OtpInput from "react18-input-otp";

// Logo removed for whitelabeling
import Confirm2faModal from 'components/UI/Model/authenticationmodals/confirm2faModal';
import { otpVerify, clearAuth } from 'store/actions';
import { authMain } from 'http/axios/axios_main';

import './login.css';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(20);
  const [timer, setTimer] = useState('');
  const [confirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = e => setOtp(e);
  const { isLoading, errorMsg } = useSelector(state => state.auth);

  useEffect(() => {
    if (!location.state) {
      navigate('/signin');
    }
    return () => {
      dispatch(clearAuth());
      localStorage.removeItem('islogin');
    };
  }, []);
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

  const verifyOtp = () => {
    if (isLoading) return;
    const { _id, countryCode, mobileNumber } = location.state;
    dispatch(otpVerify({ userId: _id, code: otp, countryCode, mobileNumber }));
  };
  const sendOtp = async () => {
    const { countryCode, mobileNumber } = location.state;
    setSending(true);
    await authMain.post('/auth/sendOTP', {
      mobileNumber: `${countryCode}${mobileNumber}`,
      channel: "SMS",
    });
    setSending(false);
    setTime(20);
    setOtp('');
    dispatch(clearAuth());
  };
  return (
    <>
      <div className="account-pages my-5 pt-sm-5 login__hero">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col className="container-otp">
              <Card className="otp-card">
                <div className="text-center mt-4">
                  <div className="d-block auth-logo">
                    {isLoading ? <Spinner className="spinner-logo-otp" /> : null}
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#34c38f', marginBottom: '10px'}}>Occurrence</div>
                  </div>
                </div>

                <CardBody className="p-4">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                    }}
                  >
                    <div className="text-center letters-space">
                      <h5 className="login__header" style={{color: '#34c38f'}}>Verification Code</h5>
                      <p className="text-muted mt-3">
                        {/* Enter the code generated in your Authenticator App */}
                        Please enter the code received on registered mobile number
                      </p>
                    </div>
                    <div className="">
                      <div className="d-flex flex-row mt-5 otp-input">
                        <OtpInput
                          numInputs={6}
                          value={otp}
                          onChange={handleChange}
                          isInputNum
                          shouldAutoFocus="true"
                          className="otpscreen"
                          inputStyle={{
                            padding: 10,
                            marginRight: 20,
                            border: '1px solid #828A9C',
                            borderRadius: 3,
                            width: 40,
                            height: 50,
                          }}
                        />
                      </div>
                      <div className="mt-4 d-flex justify-content-center">
                        <span className="d-block mobile-text">Did not receive the code?</span>{' '}
                        &nbsp;&nbsp;
                        {time ? (
                          <span className="font-weight-bold">
                            <p className="cursor-pointer">Resend code in {time} seconds</p>
                          </span>
                        ) : sending ? (
                          <span className="font-weight-bold">sending...</span>
                        ) : (
                          <span
                            className="font-weight-bold"
                            // style={{ cursor: 'pointer' }}
                            onClick={sendOtp}
                          >
                            <a className="cursor-pointer">Resend code</a>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 mb-4 text-center">
                      <button
                        className="btn w-sm waves-effect waves-light w-75"
                        style={{backgroundColor: '#34c38f', borderColor: '#34c38f', color: '#fff'}}
                        type="button"
                        onClick={verifyOtp}
                      >
                        Authenticate
                      </button>
                    </div>
                    {errorMsg && (
                      <div className="my-3">
                        <Alert color="danger" className="text-center">
                          {errorMsg}
                        </Alert>
                      </div>
                    )}
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Confirm2faModal isOpen={confirmModal} />
    </>
  );
};
export default Otp;
