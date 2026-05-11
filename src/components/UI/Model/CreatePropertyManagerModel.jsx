import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Label } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { commonSaga } from 'store/actions';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './createPropertyManager.css'
const CreatePropertyManagerModel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [number, setNumber] = useState('');

  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));

  const initialValues = {
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    countryCode: '',
  };

  const validationSchema = Yup.object({
    companyName: Yup.string().required('Company name is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),

  });

  const toggle = () => {
    onClose(prev => !prev);
  };


  const handleChangeMobileNo = (x, num, setFieldValue) => {
    const l = num.dialCode.length;
    const mobile = x.slice(l);
    setNumber(x);
    // setCountryCode(num.dialCode);
    setFieldValue('mobileNumber', mobile);
    setFieldValue('countryCode', `+${num.dialCode}`);
  };

  useEffect(() => {
    if (commonData?.createPM?.dataSaved) {
      onClose(false);
    }
  }, [commonData?.createPM]);

  const onAdd = values => {
    console.log(values)
    dispatch(
      commonSaga({
        endPoint: '/propertyManager/createPropertyManager',
        type: 'post',
        stateObj: 'createPM',
        dataToPost: values,
      }),
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Add New Property Managers
        </ModalHeader>
        <ModalBody>
          {/* <AvForm className="form-horizontal" onValidSubmit={onAdd}> */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => onAdd(values)}
            className="form-horizontal"
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <div className="mb-3">
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    Company Name
                  </Label>
                  <Field
                    name="companyName"
                    label="Company Name"
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={values.companyName}
                  />
                  <ErrorMessage name="companyName" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    First Name
                  </Label>
                  <Field
                    name="firstName"
                    label="First Name"
                    type="text"
                    value={values.firstName}
                    className="form-control"
                    onChange={handleChange}
                  />
                  <ErrorMessage name="firstName" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    Last Name
                  </Label>
                  <Field
                    name="lastName"
                    label="Last Name"
                    type="text"
                    value={values.lastName}
                    className="form-control"
                    onChange={handleChange}
                  />
                  <ErrorMessage name="lastName" component="div" className="text-danger" />
                </div>
                <div>
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    Enter Email Id
                  </Label>
                  <Field
                    name="email"
                    label="Enter Email Id"
                    value={values.email}
                    className="form-control"
                    placeholder="Enter email"
                    type="email"
                    onChange={handleChange}
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>
                <div className="row mb-4">
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    Number
                  </Label>

                  <PhoneInput
                    inputStyle={{ width: '100%', paddingLeft: '50px', height: '50px' }}
                    country="us"
                    enableSearch
                    value={number}
                    onChange={(value, country) => handleChangeMobileNo(value, country, setFieldValue)}
                    autoFormat={false}
                    name="mobileno"
                    inputProps={{
                      name: 'phone',
                      required: true,
                      // autoFocus: true,
                    }}
                    countryCodeEditable={false}
                    containerClass="custom-phone-input"

                  />
                  <ErrorMessage name="mobileNumber" component="div" className="text-danger" />

                </div>
                <div className="f12">
                  <span>Note - A temporary password will be sent on the user email id.</span>
                </div>
                <div className="tac mt20">
                  <Button
                    className="w-50 mx-auto button-color"
                    color="primary"
                    disabled={commonData?.createPM?.isLoading}
                    type="submit"
                  >
                    Send Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreatePropertyManagerModel;
