import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ShowBankDetails from 'components/UI/Model/ShowBankDetail';
import DeleteCard from 'components/UI/Model/DeleteCard';
import DatatableTables from 'components/Table/Table';
import AddCard from 'components/UI/Model/AddCard';
import { accountDetailsColumn } from 'constants/columnUtility';
import { getListOfBankAccount } from 'store/actions';

function AccountDetails() {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  const dispatch = useDispatch();
  const [addCard, setAddCard] = useState(false);
  const [usersData, setUserData] = useState([]);
  const [bankDetails, setBankDetails] = useState(false);
  const [singleAcc, setSingleACC] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  
  const { linkedBankAccounts, deleteCardData } = useSelector(
    state => state.account,
  );

  const handelAddCard = value => {
    setAddCard(value);
  };

  const showBankDetails = singleAccDetails => {
    setBankDetails(true);
    setSingleACC(singleAccDetails);
  };

  const deleteBankDetail = deletedId => {
    setDeleteModal(true);
    setDeleteId(deletedId);
  };

  const handelDelete = () => {
    setDeleteModal(false);
  };

  const handelShowDetails = () => {
    setBankDetails(false);
  };

  const getDetails = list => {
    let sdetail = [];
    if (list && list?.length) {
      sdetail = list?.map(item => ({
        _id: item.id,
        accountHolder: item.billing_details.name,
        bankName: item.us_bank_account.bank_name,
        accountNumber: `****${item.us_bank_account.last4}`,
        action: (
          <div className="d-flex justify-content-evenly " key={item._id}>
            <i className="fa fa-eye" role="button" onClick={() => showBankDetails(item)} />
            <i className="fa fa-trash" role="button" onClick={() => deleteBankDetail(item.id)} />
          </div>
        ),
      }));
    }
    return sdetail;
  };

  useEffect(() => {
    dispatch(getListOfBankAccount());
    // dispatch(getListOfCards());
  }, [deleteCardData]);

  useEffect(() => {
    const sdetail = getDetails(linkedBankAccounts.data);
    setUserData(sdetail);
  }, [linkedBankAccounts]);

  return (
    <div className="page-content">
      <Container fluid>
        <Card>
          <Row>
            <CardBody>
              <Row>
                <Col>
                  <h2 className="ps-4">Account Details</h2>
                  <div className="d-flex align-items-center justify-content-between ps-4 pe-4">
                    <span>Bank Details</span>
                  </div>
                  <DatatableTables className="mt-2" column={accountDetailsColumn} row={usersData} />

                </Col>
                {/* <AddBank
                  handelAddAccount={handelAddAccount}
                  modal={addAccount}
                  redirectUrl={redirectedPath ? redirectedPathUrl : ''}
                  hadelAddBillingDetailsClick={hadelAddBillingDetailsClick}
                  updatedValues={updatedValues}
                  selctedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  updatedSelectedWireValues={updatedSelectedWireValues}
                /> */}
                <Elements stripe={stripePromise}>
                  <AddCard
                    modal={addCard}
                    handelAddCard={handelAddCard}
                    close={() => setAddCard(false)}
                  />
                </Elements>

                {/* <AddBillingDetails
                  redirectUrl={redirectedPath ? redirectedPathUrl : ''}
                  modal={addBillingDetails}
                  handelAddBilling={handelAddBillingDetails}
                  backBtn={hadelBackBtnBillingModal}
                  selectedToken={token}
                  selectedAccType={accType}
                  selectedEmail={email}
                  selectedOption={selectedOption}
                  selectedWireOptions={selectedWireOptions}
                /> */}
              </Row>
            </CardBody>
          </Row>
        </Card>
        <ShowBankDetails modal={bankDetails} handelShowDetails={handelShowDetails} details={singleAcc} />
        <DeleteCard isOpen={deleteModal} onClose={handelDelete} id={deleteId} medium="bank" />
      </Container>
    </div>
  );
}

export default AccountDetails;
