import { useState, useEffect } from 'react';
import { Button, Modal } from 'reactstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';

import './Model.scss';

const WalletDepositConfirmModal = ({
  walletDespoitDetails,
  selectedOption,
  depositAmount,
  selectedCard,
  closeDep,
  success,
  isOpen,
  close,
}) => {
  const { linkedCards } = useSelector(state => state.account);
  const [ipAddress, setIpAddress] = useState('- -');

  const handleSubmit = () => {
    success();
    close();
    closeDep();
  };

  const getIpAddress = async () => {
    const res = await axios.get('https://geolocation-db.com/json/');
    setIpAddress(res.data.IPv4);
  };

  useEffect(() => {
    getIpAddress();
  }, []);

  const onClickCloseHandler = () => close();
  const selectedCreditCard = linkedCards.filter(card => card.cardId === selectedCard);

  return (
    <>
      <Modal centered isOpen={isOpen} className="payment_modals">
        <div className="modal-header justify-content-center pb-0">
          <h5 className="modal-title mt-0 fw-bold" id="myModalLabel">
            Authorization
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
        <div className="mt-3 mb-3">
          <p className="authorization-space">
            I authorize Circle Internet Financial, on behalf of Bricklane Technologies Inc. to
            electronically debit my account(and,if necessary. electronically credit my account) at
            the financial institution selected by me in the previous step:
          </p>
        </div>
        {selectedOption !== 'card' && (
          <>
            <div className="deposit-fees authorization-space">
              <p>Account Holder Name</p>
              <p>
                <strong>{walletDespoitDetails?.accountHolder || 'N/A'}</strong>
              </p>
            </div>
            <div className="deposit-fees authorization-space">
              <p>Routing Number</p>
              <p>{walletDespoitDetails?.routingNumber || 'N/A'}</p>
            </div>
            <div className="deposit-fees authorization-space">
              <p>Account Number</p>
              <p>{walletDespoitDetails?.accountNumber || 'N/A'}</p>
            </div>
          </>
        )}
        {selectedOption === 'card' && (
          <div className="deposit-fees authorization-space">
            <p>Card Number</p>
            {/* <p>{selectedWireOptions?.routingNumber}</p> */}
            <p>{`**** **** **** ${selectedCreditCard[0]?.lastFour}`}</p>
          </div>
        )}
        <div className="deposit-fees authorization-space">
          <p>Amount</p>
          <p>{depositAmount}</p>
        </div>
        <div className="deposit-fees authorization-space">
          <p>Authorization Date and Time</p>
          <p>{moment(walletDespoitDetails?.plaid_created_at).format('lll')}</p>
        </div>
        <div className="deposit-fees authorization-space">
          <p>IP Address</p>
          <p>{ipAddress}</p>
        </div>

        <div className="mt-3">
          <p className="authorization-space">
            PLEASE NOTE: You are authorizing a one-time payment that will begin processing
            immediately. If there is a problem with the transaction, you may contact
            <span className="terms-linkcolor">
              {' '}
              <a href="mailto:support@Investech.ooo" className="terms-linkcolor">
                {' '}
                support@investech.ooo
              </a>{' '}
            </span>{' '}
            however, there is no guarantee of cancellation.
          </p>
          <div className="mt-3">
            <p className="authorization-space">
              Scheduled in advance payments may be revoked by contacting{' '}
              <span className="terms-linkcolor">
                {' '}
                <a href="mailto:support@investtech.ooo" className="terms-linkcolor">
                  {' '}
                  support@investtech.ooo
                </a>
              </span>{' '}
              in 3 business days prior to the scheduled payment.
            </p>
          </div>
          <div className="my-3">
            <p className="authorization-space">
              I agree with Circle{' '}
              <span className="terms-linkcolor">
                {' '}
                <a
                  href="https://www.circle.com/en/legal/usdc-terms"
                  target="_blank"
                  className="terms-linkcolor"
                  rel="noopener noreferrer"
                >
                  USDC Terms{' '}
                </a>
              </span>
              and{' '}
              <span className="terms-linkcolor">
                <a
                  href="https://www.circle.com/en/legal/privacy-policy"
                  target="_blank"
                  className="terms-linkcolor"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </span>
              .
            </p>
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          <Button className="btn button__remove px-4 mx-1" onClick={onClickCloseHandler}>
            Cancel
          </Button>
          <Button className="btn button__primary px-4 mx-1" onClick={handleSubmit}>
            Authorize
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default WalletDepositConfirmModal;
