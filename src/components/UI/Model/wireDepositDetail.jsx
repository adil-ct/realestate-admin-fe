import React from 'react';
import { useSelector } from 'react-redux';

import { Col, Modal, ModalBody, Row } from 'reactstrap';

// static imports
import './wireDeposite.css';

const wireDepositDetails = ({ modal, handelShowDetails, close }) => {
  const toggle = () => {
    handelShowDetails(false);
    close();
  };

  const { wireInstruction } = useSelector(state => state.account);

  return (
    <Modal centered isOpen={modal} toggle={toggle} scrollable>
      <ModalBody className="add-card-modal-body">
        <div>
          <div className="add-card-modal-header-class">
            <button
              type="button"
              onClick={toggle}
              className="modal-colse-btn-black"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>{' '}
          </div>
          <div>
            <h2 className="add-card-modal-title">Wire Deposit Details</h2>
            <p className="wire-tracking">Tracking Ref: {wireInstruction?.trackingRef}</p>
          </div>
          <p className="wire-tracking">
            Please make the transaction using the below details that will take $0.00 as a fee.
          </p>
          <div>
            <div className="bill-details-subtitle">
              <h4>Beneficiary Details</h4>
            </div>
            <Row>
              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <div>
                    <h6>Beneficiary Name</h6>
                  </div>
                  <div>
                    <p> {wireInstruction?.beneficiary?.name}</p>
                  </div>
                </div>

                <div className="show-bank-detail">
                  <h6>Address 2</h6>

                  <p>{wireInstruction?.beneficiary?.address2}</p>
                </div>
              </Col>

              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <h6>Address 1</h6>

                  <p>{wireInstruction?.beneficiary?.address1}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <div className="bill-details-subtitle">
              <h4>Beneficiary Bank Details</h4>
            </div>
            <Row>
              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <h6>Name</h6>

                  <p>{wireInstruction?.beneficiaryBank?.name}</p>
                </div>
                <div className="show-bank-detail">
                  <h6>Swift Code</h6>

                  <p>{wireInstruction?.beneficiaryBank?.swiftCode}</p>
                </div>
                <div className="show-bank-detail">
                  <h6>Routing Number</h6>

                  <p>{wireInstruction?.beneficiaryBank?.routingNumber}</p>
                </div>
                <div className="show-bank-detail">
                  <h6>Account Number</h6>

                  <p>{wireInstruction?.beneficiaryBank?.accountNumber}</p>
                </div>
              </Col>
              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <h6>Address</h6>

                  <p>{wireInstruction?.beneficiaryBank?.address}</p>
                </div>
                <div className="show-bank-detail">
                  <h6>City</h6>

                  <p>{wireInstruction?.beneficiaryBank?.city}</p>
                </div>
                <div className="show-bank-detail">
                  <h6>Postal Code</h6>

                  <p>{wireInstruction?.beneficiaryBank?.postalCode}</p>
                </div>
                <div className="show-bank-detail">
                  <h6>Country</h6>

                  <p>{wireInstruction?.beneficiaryBank?.country}</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default wireDepositDetails;
