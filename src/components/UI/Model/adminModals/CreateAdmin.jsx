import React, { useState, useEffect } from 'react';
import { Col, Modal, Spinner } from 'reactstrap';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import RenderIf from 'components/RenderIf';

import 'react-phone-input-2/lib/style.css';
import './createAdmin.css';

const CreateModal = ({ isOpen, close, disable, onSubmit, adminDetails, generateTempPassword }) => {
  const [number, setNumber] = useState('');
  // const [countryCode, setCountryCode] = useState('1');

  const { generatingTempPass } = useSelector(state => state.admins);

  const initialValues = {
    name: adminDetails.name || '',
    email: adminDetails.email || '',
    mobileNumber: adminDetails.mobileNumber || '',
    countryCode: adminDetails.countryCode || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),
  });

  useEffect(() => {
    const { mobileNumber, countryCode } = adminDetails;
    if (isOpen !== 'create') {
      if (adminDetails?.mobileNumber) {
        const phoneNumber = `${countryCode || ''}${mobileNumber || ''}`;
        setNumber(phoneNumber);
      }
    }
  }, []);
  
  const handleChangeMobileNo = (x, num, setFieldValue) => {
    const l = num.dialCode.length;
    const mobile = x.slice(l);
    setNumber(x);
    // setCountryCode(num.dialCode);
    setFieldValue('mobileNumber', mobile);
    setFieldValue('countryCode', `+${num.dialCode}`);
  };

  // function togCreate() {
  //   close(false);
  // }

  const submit = value => {
    const objToPost = value;
    if (isOpen === 'edit') {
      objToPost.status = adminDetails.status;
      delete objToPost.email;
    }
    onSubmit(objToPost);
  };

  return (
    <>
      <div>
        <div>
          <Modal centered isOpen={!!isOpen}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                {isOpen === 'view' ? 'View' : isOpen === 'edit' ? 'Edit' : 'Create'} Admin
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
            <div className="modal-body pb-0">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={values => submit(values)}
              >
                {({ values, handleChange, setFieldValue }) => (
                  <>
                    <Form>
                      <div className="row mb-4">
                        <div className="form_label">Name</div>
                        <Col sm={12}>
                          <Field
                            type="name"
                            id="name"
                            name="name"
                            className="form-control"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Name"
                            disabled={isOpen === 'edit' || isOpen === 'view'}
                          />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </Col>
                      </div>

                      <div className="row mb-4">
                        <div className="form_label">Email</div>
                        <Col sm={12}>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            disabled={isOpen === 'edit' || isOpen === 'view'}
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </Col>
                      </div>

                      <div className="row mb-4">
                        <div className="form_label">Number</div>
                        
                        <PhoneInput
                          inputStyle={{ width: '100%', paddingLeft: '50px', height: '50px' }}
                          country="us"
                          enableSearch
                          disabled={disable}
                          value={number}
                          onChange={(value, country) => handleChangeMobileNo(value, country, setFieldValue )}
                          autoFormat={false}
                          name="mobileno"
                          inputProps={{
                            name: 'phone',
                            required: true,
                            // autoFocus: true,
                          }}
                          countryCodeEditable={false}
                          containerClass='custom-phone-input'
                        />
                        <ErrorMessage name="mobileNumber" component="div" className="text-danger" />                        
           
                      </div>

                      {/* <div className="col-sm-auto">
                        <label htmlFor="autoSizingSelect">Select Role</label>
                        <select
                          name="role"
                          id="autoSizingSelect"
                          className="form-select p-2"
                          onChange={handleChange}
                          value={values.role}
                          disabled
                        >
                          <option value="1">Default</option>
                        </select>
                      </div> */}

                      {isOpen === 'create' && (
                        <button
                          type="submit"
                          className="btn btn-primary waves-effect waves-light w-25 create_btn"
                        >
                          Submit
                        </button>
                      )}
                    </Form>
                  </>
                )}
              </Formik>
            </div>
            <RenderIf render={isOpen === 'edit' || isOpen === 'create'}>
              <div className="modal-footer">
                {isOpen === 'edit' && !adminDetails?.isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      generateTempPassword();
                    }}
                    disabled={generatingTempPass}
                    className="btn btn-success waves-effect waves-light w-50"
                  >
                    {generatingTempPass ? <Spinner size="sm" /> : 'Create Temporary Password'}
                  </button>
                )}
              </div>
            </RenderIf>
            {/* <RenderIf render={isOpen === 'view'}>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    togCreate();
                  }}
                  className="btn btn-primary waves-effect"
                  data-dismiss="modal"
                >
                  View Activity Log
                </button>
              </div>
            </RenderIf> */}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
