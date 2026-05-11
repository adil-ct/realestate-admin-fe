import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Col, Label, Form, Input, Modal, Spinner } from 'reactstrap';

import { 
  commonSaga, 
  commonSuccess,
  generateTempPassword 
} from 'store/actions';
import './authenticationModal.css';

const ForgotPasswordModal = ({ open, close, success }) => {
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));

  const [error, setError] = useState('');
  const [values, setValues] = useState('');
  const [loader, setLoader] = useState('');

  const handleChange = event => {
    setValues(event.target.value);
    if (error && event.target.value) {
      setError('');
    }
  };

  useEffect(() => {
    setLoader(false);
    if(commonData?.forgotPWD?.fullResponse?.result) {
      success();
      dispatch(commonSuccess({stateObj: "forgotPWD", fullResponse: {result: 0}}));
      dispatch(generateTempPassword({ id: commonData?.forgotPWD?.fullResponse?.data?.userId }));   
    } else {
      setError(commonData?.forgotPWD?.errorMsg);
    }
  }, [commonData?.forgotPWD?.dataObj])

  const handleSubmit = async event => {
    event.preventDefault();
    if (!values.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setError('Enter valid email');
      return;
    }
    
    setLoader(true);
    dispatch(commonSaga({endPoint: `/admin/forgotPassword`, type: "post", stateObj: "forgotPWD", dataToPost: { email: values }, token: false, fullResRequired: true}));
  };

  return (
    <>
      <div>
        <div>
          <Modal isOpen={open} centered>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Forgot password
              </h5>
              <button
                type="button"
                onClick={() => {
                  close(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <Label for="horizontal-email-Input" className="col-sm-3 col-form-Label">
                    Enter email
                  </Label>
                  <Col sm={12} className="d-flex justify-content-end">
                    <Input
                      type="text"
                      placeholder=" Enter Email"
                      className="form-control"
                      onChange={handleChange}
                      id="horizontal-newpassword-Input"
                      value={values}
                      name="email"
                      bsSize="lg"
                    />
                  </Col>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Col className="text-center my-2">
                  <button
                    type="submit"
                    className="btn btn-primary waves-effect w-25 py-2"
                    data-dismiss="modal"
                  >
                    {loader ? <Spinner /> : 'Send Link'}
                  </button>
                </Col>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;
