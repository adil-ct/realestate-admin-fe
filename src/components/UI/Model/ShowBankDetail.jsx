import React from 'react';
import { Col, Modal, ModalBody, Row } from 'reactstrap';

// static imports
import './addCard.css';

const ShowBankDetails = ({ modal, handelShowDetails, details }) => {
  const toggle = () => {
    handelShowDetails(false);
  };

  // const dispatch = useDispatch();
  // const { getBankDetailsData } = useSelector(state => state.account);

  // useEffect(() => {
  //   if (id) dispatch(getBankDetails(id));
  // }, [id]);

  return (
    <Modal isOpen={modal} toggle={toggle} scrollable>
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
            <h2 className="add-card-modal-title">Bank Account Details</h2>
          </div>
          <div>
            <div className="bill-details-subtitle">
              <h4>Bank Details</h4>
            </div>
            <Row>
              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <div>
                    <h6>Bank Name</h6>
                  </div>
                  <div>
                    {details && (
                      <p>
                        {details.us_bank_account.bank_name
                          ? details.us_bank_account.bank_name
                          : '--'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="show-bank-detail">
                  <h6>Account Number</h6>
                  {details && (
                    <p>
                      {details.us_bank_account.last4
                        ? `****${details.us_bank_account.last4}`
                        : '--'}
                    </p>
                  )}
                </div>
                <div className="show-bank-detail">
                  <h6>Account Holder</h6>
                  {details && (
                    <p>{details?.billing_details?.name ? details?.billing_details?.name : '--'}</p>
                  )}
                </div>
                <div className="show-bank-detail">
                  <h6>Bank Country</h6>
                  {details && (
                    <p>{details?.bankAddress?.country ? details?.bankAddress?.country : '--'}</p>
                  )}
                </div>
              </Col>

              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <h6>Routing Number</h6>
                  {details && (
                    <p>
                      {details?.us_bank_account.routing_number
                        ? details?.us_bank_account.routing_number
                        : '--'}
                    </p>
                  )}
                </div>
                <div className="show-bank-detail">
                  <h6>Account Type</h6>
                  {details && (
                    <p>
                      {details?.us_bank_account.account_type
                        ? details?.us_bank_account.account_type
                        : '--'}
                    </p>
                  )}
                </div>
                <div className="show-bank-detail">
                  <h6>Email</h6>
                  {details && (
                    <p>
                      {details?.billing_details?.email ? details?.billing_details?.email : '--'}
                    </p>
                  )}
                </div>
                <div className="show-bank-detail">
                  <h6>Phone Num</h6>
                  {details && <p>{details?.mobileNumber ? details?.mobileNumber : '--'}</p>}
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <div className="bill-details-subtitle">
              <h4>Billing Details</h4>
            </div>
            <Row>
              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <h6>Acc.Holder Name</h6>
                  {details && (
                    <p>{details?.billing_details?.name ? details?.billing_details?.name : '--'}</p>
                  )}
                </div>
                {/* <div className="show-bank-detail">
                  <h6>Account Number</h6>
                  {details && <p>{details?.accountNumber ? details?.accountNumber : '--'}</p>}
                </div> */}
                {/* <div className="show-bank-detail">
                  <h6>Account Holder</h6>
                  {details && (
                    <p>
                      {details?.billingDetails?.name
                        ? details?.billingDetails?.name
                        : '--'}
                    </p>
                  )}
                </div> */}
                {/* <div className="show-bank-detail">
                  <h6>Street Address 1</h6>
                  {details && (
                    <p>{details?.billingDetails?.line1 ? details?.billingDetails?.line1 : '--'}</p>
                  )}
                </div> */}
              </Col>
              <Col className="" xs="6">
                <div className="show-bank-detail">
                  <h6>Email</h6>
                  {details && (
                    <p>
                      {details?.billing_details?.email ? details?.billing_details?.email : '--'}
                    </p>
                  )}
                </div>
                {/* <div className="show-bank-detail">
                  <h6>Street Address 2</h6>
                  {details && <p>{details?.line2 ? details?.line2 : '--'}</p>}
                </div>
                <div className="show-bank-detail">
                  <h6>District</h6>
                  {details && (
                    <p>
                      {details?.billingDetails?.district ? details?.billingDetails?.district : '--'}
                    </p>
                  )}
                </div>
                <div className="show-bank-detail">
                  <h6>Country</h6>
                  {details && (
                    <p>
                      {details?.billingDetails?.country ? details?.billingDetails?.country : '--'}
                    </p>
                  )}
                </div> */}
              </Col>
            </Row>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ShowBankDetails;
