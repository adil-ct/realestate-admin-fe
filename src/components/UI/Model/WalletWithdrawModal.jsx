import React, { useState, useEffect } from 'react';
import { Button, Col, Modal, FormGroup, Input, Label } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack } from 'react-icons/io';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';

import paymentList from '_mocks/paymentMethodsList';
import {
  getServiceFees,
  getListOfBankAccount,
  getWalletBalance,
  withdrawCurrency,
} from 'store/actions';
import ButtonLoader from '../Buttonloader/ButtonLoader';
import CurrencyFormat from '../../CurrencyFormat/index';

import './Model.scss';

const WalletWithdrawModal = ({
  isOpen,
  close,
  setSelectedOption,
  selectedOption,
  modal,
  withdrawModalHandler,
  withdrawModal2,
  backBtn,
}) => {
  const paymentMethodsList = paymentList()?.data;
  const dispatch = useDispatch();
  // linkedBankAccounts, serviceFees
  const { walletBalance, isLoading } = useSelector(state => state.account);
  const [isActive, setIsActive] = useState(false);

  const initialValues = {
    toAddress: '',
    qty: '',
  };

  const validationSchema = Yup.object().shape({
    toAddress: Yup.string().required('Wallet Address is required'),
    qty: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Amount is required'),
  });

  const handleActive = () => {
    setIsActive(!isActive);
  };

  const onClickCloseHandler = () => {
    close();
    handleActive();
    setSelectedOption('');
  };
  const onClickHandler = () => {
    modal();
    withdrawModalHandler();
  };

  const withdrawHandlerSubmit = requestBody => {
    dispatch(
      withdrawCurrency({
        requestBody,
        handleSuccess: () => {
          withdrawModalHandler();
          close();
        },
      }),
    );
  };

  const depositSuccess = values => {
    withdrawHandlerSubmit(values);
  };

  useEffect(() => {
    dispatch(getWalletBalance());
    dispatch(getListOfBankAccount());
    dispatch(getServiceFees());
  }, []);

  return (
    <>
      <Modal centered isOpen={isOpen} className="payment_modals">
        <div className="modal-header justify-content-center pb-0">
          <h5 className="modal-title mt-0 fw-bold " id="myModalLabel">
            Withdraw
          </h5>

          <button
            type="button"
            onClick={onClickCloseHandler}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="body-text d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-dollar-sign" />
              <span className="fw-bold ms-2">USD</span>
            </div>
            <div className="text-end">
              <p className="m-0 fw-bold">
                {isLoading.walletBalance ? (
                  '$0'
                ) : (
                  <CurrencyFormat prefix="$" value={walletBalance.availableBalance} />
                )}
              </p>
              <p className="m-0">
                <i>Current balance</i>
              </p>
            </div>
          </div>
          <div>
            <FormGroup tag="fieldset">
              {paymentMethodsList?.filter(method => method?.canWithdraw)?.length === 0 && (
                <span>No Payment Method added yet</span>
              )}
              {paymentMethodsList?.filter(method => method?.canWithdraw)?.length > 0 && (
                <>
                  <span className="add-bank-select-method">Select Withdrawal Method</span>
                  <div className="add-deposit-radio-container">
                    {paymentMethodsList
                      ?.filter(method => method?.canWithdraw)
                      .map(method => (
                        <FormGroup check className="me-2 deposit-modal-alinement" key={method?.key}>
                          <Label check>
                            <Input
                              type="radio"
                              value={selectedOption}
                              name="radio"
                              checked={selectedOption === method?.name}
                              onClick={() => setSelectedOption(method?.name)}
                            />{' '}
                            {method?.name}
                          </Label>
                          <div>
                            <spam>{method?.limit}</spam>
                          </div>
                        </FormGroup>
                      ))}
                  </div>
                </>
              )}
            </FormGroup>
          </div>
        </div>

        <div className="modal-footer justify-content-center pt-0 ">
          <Button
            className="btn btn-continue"
            disabled={
              !selectedOption ||
              paymentMethodsList?.filter(method => method?.canWithdraw)?.length === 0
            }
            onClick={onClickHandler}
          >
            Continue
          </Button>
        </div>
      </Modal>

      <Modal centered isOpen={withdrawModal2} className="payment_modals ">
        <div>
          <div className="modal-header justify-content-start pb-0">
            <div className="mb-2" onClick={backBtn}>
              <IoIosArrowBack />
              Back
            </div>
            <button
              type="button"
              onClick={onClickCloseHandler}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="deposit-modalheader">
            <h5 className="modal-title mt-0 fw-bold" id="myModalLabel">
              Withdraw
            </h5>
          </div>
        </div>
        <div className="modal-body">
          <div className="body-text mb-3 d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-dollar-sign" />
              <span className="fw-bold ms-2">USD</span>
            </div>
            <div className="text-end">
              <p className="m-0 fw-bold">
                {isLoading.walletBalance ? (
                  '$0'
                ) : (
                  <CurrencyFormat prefix="$" value={walletBalance.availableBalance} />
                )}
              </p>
              <p className="m-0">
                <i>Current balance</i>
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => depositSuccess(values)}
          >
            {({ values, handleChange }) => (
              <Form>
                <Col sm="12" className="mb-3 position-relative mx-auto">
                  <FormGroup>
                    <Label for="toAddress">Wallet Address</Label>
                    <Input
                      type="text"
                      name="toAddress"
                      id="toAddress"
                      onChange={handleChange}
                      value={values.toAddress}
                      className="form-control"
                    />
                    <ErrorMessage name="toAddress" component="div" className="text-danger" />
                  </FormGroup>
                </Col>

                <Col sm="12" className="mb-1 position-relative">
                  <FormGroup>
                    <Label for="qty">Amount</Label>
                    <Input
                      type="text"
                      name="qty"
                      id="qty"
                      placeholder="0.00"
                      onChange={handleChange}
                      value={values.qty}
                      className="form-control"
                    />
                    <ErrorMessage name="qty" component="div" className="text-danger" />
                    <p className="text-muted usd">
                      <i>~USD</i>
                    </p>
                  </FormGroup>
                </Col>

                <div className="modal-footer justify-content-center pt-0">
                  <ButtonLoader
                    text="Confirm Transaction"
                    loading={isLoading?.withdrawCurrency}
                    disabled={!selectedOption}
                    onClick={onClickHandler}
                    className="btn btn-continue"
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default WalletWithdrawModal;
