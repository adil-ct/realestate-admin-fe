import { Modal, FormGroup, Input, Label } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';

import { getServiceFees, getWalletBalance } from 'store/actions';
import paymentList from '_mocks/paymentMethodsList';
import ButtonLoader from '../Buttonloader/ButtonLoader';
import CurrencyFormat from '../../CurrencyFormat/index';

import './Model.scss';

const WalletDepositModal = ({ isOpen, close, modal, selectedOptionHandler, selectedOption }) => {
  const paymentMethodsList = paymentList()?.data;
  const { walletBalance, isLoading } = useSelector(state => state.account);
  const { isLoading: userLoading } = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServiceFees());
    dispatch(getWalletBalance());
  }, []);

  const onClickCloseHandler = () => {
    close();
    selectedOptionHandler('');
  };

  const onClickHandler = () => {
    modal();
  };

  return (
    <>
      <Modal centered isOpen={isOpen} className="payment_modals">
        <div className="modal-header justify-content-center pb-0">
          <h5 className="modal-title mt-0 fw-bold" id="myModalLabel">
            Deposit
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
        <div className="modal-body m0">
          <div className="body-text d-flex m0 justify-content-between align-items-center">
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
              {!paymentMethodsList?.length && <span>No Payment Method added yet</span>}
              {paymentMethodsList?.length && <>
                <span className="selectmethod_label">Select Payment Method</span>
                <div className="add-deposit-radio-container">
                  {paymentMethodsList?.filter(method => method?.canDeposit).map(method =>(
                    <FormGroup check className="me-2 deposit-modal-alinement" key={method?.key}>
                      <Label check>
                        <Input
                          type="radio"
                          value={selectedOption}
                          name="radio"
                          checked={selectedOption === method?.key}
                          onClick={() => selectedOptionHandler(method?.key)}
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
              }
            </FormGroup>
          </div>
        </div>

        <div className="modal-footer justify-content-center pt-0 ">
          <ButtonLoader
            text="Continue"
            loading={userLoading?.walletAddress || userLoading?.moonpay}
            disabled={!selectedOption}
            onClick={onClickHandler}
            className="btn btn-continue"
          />
        </div>
      </Modal>
    </>
  );
};

export default WalletDepositModal;
