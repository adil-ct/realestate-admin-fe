import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Spinner, Modal } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { clearAuth, passwordReset } from 'store/actions';

import './login.css';

const ChangePassword = ({ close }) => {
  const { isLoading, isResetPassword } = useSelector(state => state.auth);
  const { state } = useLocation();
  const dispatch = useDispatch();

  const [show, setShow] = useState({ oldpassword:false , password: false, confirmPassword: false });
  const [pass, setPass] = useState('');
  const [oldPass, setOldPass] = useState('');

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

  const resetPassword = (val) => {
    if (val?.confirmPassword === val?.password) {
      dispatch(passwordReset({ password: val.password, id: localStorage.getItem('userId') }));
    } else {
      alert('Password and Confirm Password Mismatched!');
    }
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

  useEffect(() => {
    if (isResetPassword) {
      close();
      toast.success('Password Reset Successfully!');
    }
  }, [isResetPassword]);

  return (
    <>
      <Modal isOpen centered>
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myModalLabel">
            Change Password
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => resetPassword(values)}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid }) => (
              <Form>
                <div className="mb-5 position-relative">
                  <div>
                    <Field
                      name="oldpassword"
                      value={oldPass}
                      type={show.oldpassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Enter Old Password"
                      onChange={e => setOldPass(e.target.value.trim())}
                    />
                  </div>
                  <div className="password-eye">
                    <i
                      onClick={() => handleShow('oldpassword')}
                      className={
                        show.password
                          ? 'fas fa-eye-slash position-absolute mx-3'
                          : 'fas fa-eye position-absolute mx-3'
                      }
                    />
                  </div>
                </div>
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
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </div>

                <div className="mt-4 text-end">
                  <button
                    className="btn w-sm waves-effect waves-light w-100 py-2"
                    style={{backgroundColor: '#34c38f', borderColor: '#34c38f', color: '#fff'}}
                    type="submit"
                  >
                    {isLoading ? <Spinner size="sm" /> : 'Change Password'}
                  </button>
                </div>

                <div className="Reset_Para mt-3">
                  <p className={isMatch(1, isValid)}>
                    1. At least 10 characters with atleast 1 uppercase and 1 lowercase letters.
                  </p>
                  <p className={isMatch(2, isValid)}>2. A mixture of letters and Numbers.</p>
                  <p className={isMatch(3, isValid)}>
                    3.Inclusion of at least one special character
                  </p>
                </div>
              </Form>
            )}
          </Formik>
          <Alert color="info">NOTE : Change password in every 90 Days to increase security</Alert>
        </div>
      </Modal>
    </>
  );
};

export default ChangePassword;
