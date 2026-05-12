import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Row, Col, CardBody, Card, Container, Alert, Spinner } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import * as actions from 'store/actions';
import Scan2FAModal from 'components/UI/Model/authenticationmodals/scan2FAmodal';
import Select2faModal from 'components/UI/Model/authenticationmodals/select2FA';
import Logo from 'components/UI/Logo/Logo';

import ForgotPasswordModal from 'components/UI/Model/authenticationmodals/forgotPasswordModal';

import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [remember, setRemember] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [show, setShow] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [selct2fa, setSelect2fa] = useState(false);
  const [scan2fa, setScan2fa] = useState(false);
  const { errorMsg, isLoading, userData } = useSelector(state => state.auth);

  useEffect(
    () => () => {
      dispatch(actions.clearAuth());
    },
    [],
  );

  const initialValues = {
    email: '',
    password: '',
  };
  
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSuccess = () => {
    if (userData && userData?.forceUpdatePassword) {
      navigate('/reset-password', { state: userData._id });
      return;
    }
    if (!userData?.twoFA?.none) {
      navigate('/otp', { state: userData });
    }
    navigate('/dashboard');
  }

  const handleSubmit = (val) => {
    if (isLoading) return;
    dispatch(actions.login({...val , onSuccess}));
  };

  return (
    <>
      <div className="account-pages my-5 pt-sm-5 login__hero">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <div className="text-center mt-4">
                  <div className="d-block auth-logo">
                    {isLoading && <Spinner className="spinner-logo" />}
                    <div className="auth-brand">
                      <Logo height={44} tone="light" />
                    </div>
                    <div className="auth-subtitle">Admin Console</div>
                  </div>
                </div>

                <CardBody className="p-4">
                  <div className="p-2 mt-4">
                    {errorMsg && (
                      <div>
                        <Alert color="danger">{errorMsg}</Alert>
                      </div>
                    )}
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      enableReinitialize
                      onSubmit={values => handleSubmit(values)}
                    >
                      {({ values, handleChange }) => (
                        <>
                          <Form>
                            <div className="mb-3">
                              <div className="form_label">Email</div>
                              <Field
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={values.email}
                                onChange={handleChange}
                              />
                              <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                              <div className="float-end forget_password">
                                <a className="forgot-link" onClick={() => setForgot(true)}>Forgot password?</a>
                              </div>

                              <div className="form_label">Password</div>
                              <div className='d-flex justify-content-end col-sm-12'>
                              <Field
                                type={show ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-control"
                                value={values.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                              />
                              <i onClick={() => setShow(prev => !prev)} 
                                className={show ? 'fas fa-eye-slash position-absolute mx-3' : 'fas fa-eye position-absolute mx-3'}
                                style={{ marginTop: '13px', paddingRight: '15px' }}
                              />
                              </div>                          
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="mt-4 text-end">
                              <button
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={isLoading}
                              >
                                {isLoading ? <Spinner size="sm" style={{ color: '#fff' }} /> : 'Log In'}
                              </button>
                            </div>
                          </Form>
                        </>
                      )}
                    </Formik>                  
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Select2faModal isOpen={selct2fa} onClose={setSelect2fa} next={setScan2fa} />
        <Scan2FAModal isOpen={scan2fa} onClose={setScan2fa} />
        {successAlert && (
          <SweetAlert
            title="Request for forgot password sent successfully, super admin will send the temporary password on your email."
            success
            confirmBtnBsStyle="success"
            onConfirm={() => setSuccessAlert(false)}
          />
        )}
        {forgot && (
          <ForgotPasswordModal
            open
            close={setForgot}
            success={() => {
              setSuccessAlert(true);
              setForgot(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Login;
