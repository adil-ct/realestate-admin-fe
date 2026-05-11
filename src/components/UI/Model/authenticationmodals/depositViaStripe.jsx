import React from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { IoIosArrowBack } from 'react-icons/io';
import {loadStripeOnramp} from '@stripe/crypto';

import { CryptoElements, OnrampElement } from './StripeCryptoElements';
import './authenticationModal.css';

// Use environment variable for Stripe key (same key works for both regular Stripe and Crypto OnRamp)
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51Qs9fi07VEsNxHEiR0flEEWGF6EhfD2sJzMmaVtdhgNvWPUlSRfEB0U5AqKFR6CRxKu67XVLRunhoPPhF6dvPh5s006mVZ164q";
const stripeOnrampPromise = loadStripeOnramp(publishableKey);

const DepositViaStripe = ({ isOpen, onClose, backBtn, clientSecret }) => {
  const toggle = () => {
    onClose(prev => !prev);
  };

  return (
    <>
      <Modal isOpen={isOpen} centered>
        <ModalHeader toggle={toggle}>
          {' '}
          <div className="mb-2" onClick={backBtn}>
            <IoIosArrowBack />
            <span className="m-header-qr">Back</span>
          </div>
        </ModalHeader>
        <ModalBody className="scan2fabodycontainer">
            <CryptoElements stripeOnramp={stripeOnrampPromise}>
                <OnrampElement clientSecret={clientSecret} />
            </CryptoElements>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DepositViaStripe;
