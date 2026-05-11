import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, Card, Container, Alert, Spinner } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as Yup from 'yup';

import { clearAuth, passwordReset } from 'store/actions';

import './login.css';

const ResetPassword = () => {
  const { errorMsg, isResetPassword, isLoading } = useSelector(state => state.auth);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [pass, setPass] = useState('');

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d("!#$%&'()*+,-.:;<=>?@^_`{|}~)*]{10,}$/,
        'Enter valid password match with below conditions',
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Password does not match'),
  });

  const matchObj = {
    1: pass.length >= 10 && pass.match(/[A-Z]/) && pass.match(/[a-z]/),
    2: pass.match(/[A-Za-z]/) && pass.match(/[0-9]/),
    3: pass.match(/[*@!#%&()^~{}]+/),
  };

  const handleShow = val => {
    setShow(prev => ({ ...prev, [val]: !prev[val] }));
  };

  const resetPassword = val => {
    dispatch(passwordReset({ password: val.password, id: state }));
  };

  const isMatch = (num, isValid) => {
    if (matchObj[num]) {
      return 'color-green';
    }
    if (!isValid) {
      return 'color-red';
    }
    return '';
  };
  
  useEffect(() => {
    if (!state);
    return () => dispatch(clearAuth());
  }, []);
  
  return (
    <>
      <div className="account-pages my-5 pt-sm-5 login__hero">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col md={8} lg={6} xl={6}>
              <Card>
                <CardBody className="p-4">
                  <div className="text-center mt-4 mb-2">
                    <h5 className="Reset__header">Reset Password</h5>
                  </div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={values => resetPassword(values)}
                    enableReinitialize
                  >
                    {({ values, setFieldValue, isValid }) => (
                      <Form>
                        <div className="p-2 mt-4">
                          {errorMsg && (
                            <div>
                              <Alert color="danger">{errorMsg}</Alert>
                            </div>
                          )}
                          <div className="mb-5 position-relative">
                            <div>
                              <Field
                                name="password"
                                value={values.password}
                                type={show.password ? 'text' : 'password'}
                                placeholder="Enter New Password"
                                className="form-control"
                                onChange={e => {
                                  setFieldValue('password', e.target.value);
                                  setPass(e.target.value);
                                }}
                              />
                            </div>
                            <div className="password-eye">
                              <i
                                onClick={() => handleShow('password')}
                                className={
                                  show.password
                                    ? 'fas fa-eye-slash position-absolute mx-3'
                                    : 'fas fa-eye position-absolute mx-3'
                                }
                              />
                            </div>
                            <ErrorMessage name="password" component="div" className="text-danger" />
                          </div>

                          <div className="mb-5 position-relative">
                            <div>
                              <Field
                                name="confirmPassword"
                                type={show.confirmPassword ? 'text' : 'password'}
                                placeholder="Retype New Password"
                                className="form-control"
                                onChange={e => {
                                  setFieldValue('confirmPassword', e.target.value);
                                }}
                              />
                            </div>

                            <div className="password-eye">
                              <i
                                onClick={() => handleShow('confirmPassword')}
                                className={
                                  show.confirmPassword
                                    ? 'fas fa-eye-slash position-absolute mx-3'
                                    : 'fas fa-eye position-absolute mx-3'
                                }
                              />
                            </div>
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="mt-4 text-end">
                            <button
                              className="btn w-sm waves-effect waves-light w-100 py-2"
                              style={{backgroundColor: '#34c38f', borderColor: '#34c38f', color: '#fff'}}
                              type="submit"
                            >
                              {isLoading ? <Spinner size="sm" /> : 'Reset Password'}
                            </button>
                          </div>
                        </div>
                        <div className="Reset_Para mt-3">
                          <p className={isMatch(1, isValid)}>
                            1. At least 10 characters with atleast 1 uppercase and 1 lowercase
                            letters.
                          </p>
                          <p className={isMatch(2, isValid)}>
                            2. A mixture of letters and Numbers.
                          </p>
                          <p className={isMatch(3, isValid)}>
                            3.Inclusion of at least one special character
                          </p>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <Alert color="info">
                    NOTE : Change password in every 90 Days to increase security
                  </Alert>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {isResetPassword && (
          <SweetAlert
            title="Password reset successfully please login"
            success
            confirmBtnBsStyle="success"
            onConfirm={() => navigate('/signin')}
          />
        )}
      </div>
    </>
  );
};

export default ResetPassword;
