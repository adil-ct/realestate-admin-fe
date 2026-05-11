import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, CardBody, Label } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import PhoneInput from 'react-phone-input-2';
import { Field, Form, Formik } from 'formik';

import ChangePassword from 'views/auth/Login/ChangePassword';
import PhoneInputModal from 'components/PhoneInputModal';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import { GetUserProfile } from 'store/actions';
import avatar from 'assets/images/avatar.jpg';
import OtpModal from 'components/OtpModal';

import 'react-phone-input-2/lib/style.css';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  const [isOtpModal, setOtpModal] = useState(false);
  const [updatedNumber, setUpdatedNumber] = useState({});
  const [passwordModal, setPasswordModal] = useState(false);
  const [phoneModal, setPhoneModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successAlertOtp, setSuccessAlertOtp] = useState(false);

  const handlePassword = () => setPasswordModal(prev => !prev);
  const handlePhone = () => setPhoneModal(prev => !prev);

  const handleOtpModal = val => {
    setUpdatedNumber(val);
    setOtpModal(prev => !prev);
  };

  const copyToCLipBoard = value => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    dispatch(GetUserProfile());
  }, []);

  const mobileUpdatedCB = () => {
    setSuccessAlertOtp(true);
    dispatch(GetUserProfile());
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="UI Elements"
            breadcrumbItem="Tabs & Accordions"
            items={[{ name: 'Profile' }]}
          />
          <Card>
            <CardBody className="w-75 m-auto">
              <Row style={{ padding: '20px 0px' }}>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                  <div style={{ padding: '20px 80px' }}>
                    <Formik>
                      <Form>
                        <div className="text-center">
                          <img
                            src={avatar}
                            alt=""
                            className="avatar-md rounded-circle img-thumbnail"
                          />
                          {userData?.blockchainAddress && (
                            <div className="d-flex align-items-center justify-content-center py-2">
                              <div>
                                {userData?.blockchainAddress?.replace(
                                  /.(?<=\w{7})\w(?=\w{6})/g,
                                  '.',
                                )}
                              </div>
                              {copied ? (
                                <div className="color-green">
                                  <i className="fas fa-check ms-3 me-1" />
                                  Copied
                                </div>
                              ) : (
                                <i
                                  className="fas fa-clone mb-0 cursor-pointer ms-3"
                                  onClick={() => copyToCLipBoard(userData?.blockchainAddress)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <Label
                            for="horizontal-firstname-Input"
                            className="col-sm-6 col-form-Label d-block"
                          >
                            Full Name
                          </Label>
                          <Field
                            name="name"
                            id="YourName"
                            className="py-2 form-control"
                            type="text"
                            value={userData?.name}
                            disabled
                          />
                        </div>
                        <div className="mb-3">
                          <Label
                            for="horizontal-firstname-Input"
                            className="col-sm-6 col-form-Label d-block"
                          >
                            Email
                          </Label>
                          <Field
                            name="email"
                            id="YourName"
                            type="Email"
                            className="py-2 form-control"
                            value={userData?.email}
                            disabled
                          />
                        </div>
                        <div className="mb-3">
                          <Label
                            for="horizontal-firstname-Input"
                            className="col-sm-6 col-form-Label"
                          >
                            Mobile Number
                          </Label>
                          <PhoneInput
                            country="us"
                            value={`${userData?.countryCode}${userData?.mobileNumber}`}
                            name="mobileno"
                            autoFormat={false}
                            countryCodeEditable={false}
                            disabled="true"
                          />
                        </div>
                        <div className=" mt-5">
                          <Col sm="12">
                            <div className="d-flex flex-wrap justify-content-evenly">
                              <div>
                                <button
                                  type="button"
                                  onClick={handlePassword}
                                  className="btn btn-primary waves-effect waves-light dropdownColor"
                                  data-toggle="modal"
                                  data-target="#myModal"
                                >
                                  Update Password
                                </button>
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={handlePhone}
                                  className="btn btn-primary waves-effect waves-light dropdownColor"
                                  data-toggle="modal"
                                  data-target="#myModal"
                                >
                                  Update Phone Number
                                </button>
                                {passwordModal && <ChangePassword close={handlePassword} />}
                                {phoneModal && (
                                  <PhoneInputModal close={handlePhone} next={handleOtpModal} />
                                )}
                                {successAlert && (
                                  <SweetAlert
                                    title="Password updated successfully"
                                    success
                                    confirmBtnBsStyle="success"
                                    onConfirm={() => setSuccessAlert(false)}                
                                  />
                                )}
                                {successAlertOtp && (
                                  <SweetAlert
                                    title="Mobile number updated successfully"
                                    success
                                    confirmBtnBsStyle="success"
                                    onConfirm={() => setSuccessAlertOtp(false)}
                                  />
                                )}
                                {isOtpModal && (
                                  <OtpModal
                                    close={handleOtpModal}
                                    data={updatedNumber}
                                    next={mobileUpdatedCB}
                                  />
                                )}
                              </div>
                            </div>
                          </Col>
                        </div>
                      </Form>
                    </Formik>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default MyProfile;
