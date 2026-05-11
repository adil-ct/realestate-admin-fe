import React from 'react';
import { Modal } from 'reactstrap';
import { useSelector } from 'react-redux';
import { IoIosArrowBack } from 'react-icons/io';

import './Model.scss';

const WalletDepositBankModal = ({ isOpen, close, backBtn }) => {
  const { moonpay } = useSelector(state => state.user);
  const onClickCloseHandler = () => {
    close();
  };

  return (
    <>
      <Modal centered isOpen={isOpen} className="payment_modals deposit_modal_new">
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
              Deposit
            </h5>
          </div>
        </div>

        <div className="modal-body">
          <div className="iframeContainer">
            <iframe title="moon-pay" src={moonpay?.data} scrolling="no" className="iframe-style" />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WalletDepositBankModal;
