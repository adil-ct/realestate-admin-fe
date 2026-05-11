// import { AvField, AvForm } from 'availity-reactstrap-validation';
// import { useDispatch, useSelector } from 'react-redux';
// import React, { useEffect, useState } from 'react';
// import { Button, Col, Modal } from 'reactstrap';
// import { IoIosArrowBack } from 'react-icons/io';
// import axios from 'axios';

// import {
//   getListOfBankAccount,
//   getListOfCards,
//   getWireInstruction,
//   depositCurrency,
// } from 'store/actions';
// import WalletDepositConfirmModal from 'components/UI/Model/WalletDepositConfirmModal';
// import AddBillingDetails from 'components/UI/Model/AddBillingDetails';
// import WireDepositModal from 'components/UI/Model/wireDepositDetail';
// import CurrencyFormat from 'components/CurrencyFormat';
// import AddBank from 'components/UI/Model/AddBank';
// import AddCard from './AddCard';

// import './Model.scss';

// const WalletDepositBankModal = ({ isOpen, close, selectedOptionFiat, selectedButton, backBtn }) => {
//   const { serviceFees, linkedBankAccounts } = useSelector(state => state.account);
//   const { linkedCards } = useSelector(state => state.account);
//   const dispatch = useDispatch();

//   const [walletDespoitDetails, setWalletDespoitDetails] = useState({});
//   const [addBillingDetails, setAddBillingDetails] = useState(false);
//   const [serviceFeeAmount, setServiceFeeAmount] = useState(0);
//   const [depositAmount, setDepositAmount] = useState('');
//   const [addAccount, setAddAccount] = useState(false);
//   const [bankDetails, setBankDetails] = useState({});
//   const [isDeposit, setIsDeposit] = useState(false);
//   const [addCard, setAddCard] = useState(false);
//   const [accType, setAccType] = useState('');
//   const [token, setToken] = useState('');
//   const [email, setEmail] = useState('');
//   const [selectedWireOptions, setSelectedWireOptions] = useState({
//     accountNumber: '',
//     routingNumber: '',
//     bankName: '',
//     country: '',
//     city: '',
//     bankType: '',
//   });

//   useEffect(() => {
//     const selectedBank = linkedBankAccounts?.banks?.filter(acc => acc?.id === bankDetails);
//     console.log(bankDetails, selectedBank, linkedBankAccounts?.banks);
//     setWalletDespoitDetails((selectedBank?.length && selectedBank[0]) || {});
//   }, [bankDetails]);

//   const continueDepositModal = async () => {
//     const endpoint =
//       selectedOptionFiat === 'ACH' || selectedOptionFiat === 'card'
//         ? '/payment/create-payment'
//         : '/payment/wire-payment';

//     const res = await axios.get('https://geolocation-db.com/json/');
//     let requestBody;
//     if (selectedButton === 'merchant') {
//       requestBody =
//         selectedOptionFiat === 'Wire'
//           ? {
//               amount: {
//                 amount: depositAmount,
//                 currency: 'USD',
//               },
//               wireId: bankDetails,
//               type: 'merchant',
//             }
//           : {
//               metadata: {
//                 ipAddress: res.data.IPv4,

//                 // hardcoded will update with unique identifer
//                 sessionId: 'DE6FA86F60BB47B379307F851E238617',
//               },
//               amount: {
//                 amount: depositAmount,
//                 currency: 'USD',
//               },
//               source: {
//                 id: bankDetails,
//                 type: selectedOptionFiat === 'ACH' ? 'ach' : 'card',
//               },
//               description: 'Payment',
//               type: 'merchant',
//             };
//     } else {
//       // Request body according to bank type
//       requestBody =
//         selectedOptionFiat === 'Wire'
//           ? {
//               amount: {
//                 amount: depositAmount,
//                 currency: 'USD',
//               },
//               wireId: bankDetails,
//             }
//           : {
//               metadata: {
//                 ipAddress: res.data.IPv4,
//                 // hardcoded will update with unique identifer
//                 sessionId: 'DE6FA86F60BB47B379307F851E238617',
//               },
//               amount: {
//                 amount: depositAmount,
//                 currency: 'USD',
//               },
//               source: {
//                 id: bankDetails,
//                 type: selectedOptionFiat === 'ACH' ? 'ach' : 'card',
//               },
//               description: 'Payment',
//             };
//     }
//     dispatch(depositCurrency({ endpoint, requestBody }));
//   };

//   useEffect(() => {
//     dispatch(getListOfBankAccount());
//     dispatch(getListOfCards());
//   }, []);

//   const hadelAddBillingDetailsClick = () => {
//     setAddAccount(false);
//     setAddBillingDetails(true);
//   };
//   const handleAddAccount = value => {
//     setAddAccount(value);
//   };

//   const getWireDetailsSuccess = () => {
//     setIsDeposit(true);
//   };

//   const onClickHandler = () => {
//     // confirm();
//     // continueDepositModal();
//     // setIsDeposit(true);

//     // close();
//     const trackingId = linkedBankAccounts?.banks?.filter(acc => acc?._id === bankDetails);

//     dispatch(
//       getWireInstruction({
//         id: trackingId[0]?.id,
//         handleSuccess: getWireDetailsSuccess,
//       }),
//     );
//     // close();
//   };

//   const depositSuccess = () => {
//     continueDepositModal();
//   };

//   const onClickCloseHandler = () => {
//     close();
//   };

//   const handelAddAccount = value => {
//     setAddAccount(value);
//   };

//   const updatedSelectedWireValues = selectedValues => {
//     setSelectedWireOptions({ ...selectedValues });
//   };

//   const updatedValues = (selectedToken, selectedAccType, selectedEmail) => {
//     setToken(selectedToken);
//     setAccType(selectedAccType);
//     setEmail(selectedEmail);
//   };

//   const handelAddBillingDetails = value => {
//     setAddBillingDetails(value);
//   };

//   const walletClose = () => {
//     setIsDeposit(false);
//   };

//   const handelShowDetails = () => {
//     setIsDeposit(false);
//   };

//   const updateServiceFeeAmount = val => {
//     setDepositAmount(val);
//     if (selectedOptionFiat === 'ACH') {
//       if (val.length > 0) {
//         const fees =
//           Number(val) * (serviceFees[0]?.achPaymentFeePercentage / 100) +
//           serviceFees[0]?.achPaymentFee;
//         setServiceFeeAmount(Math.round(fees * 100) / 100);
//       } else {
//         setServiceFeeAmount(0);
//       }
//     } else {
//       if (val.length > 0) {
//         const fees =
//           Number(val) * (serviceFees[0]?.cardFeesPercentage / 100) + serviceFees[0]?.cardFees;
//         setServiceFeeAmount(Math.round(fees * 100) / 100);
//       } else {
//         setServiceFeeAmount(0);
//       }
//     }
//   };

//   const handelAddCard = value => {
//     setAddCard(value);
//   };

//   const onClickBankCardHandler = () => {
//     if (selectedOptionFiat === 'card') {
//       handelAddCard(true);
//     } else {
//       handleAddAccount(true);
//     }
//   };

//   const TRACKING_REFRENCE = process.env.REACT_APP_TRACKING_REF;

//   return (
//     <>
//       <Modal centered isOpen={isOpen} className="payment_modals">
//         <div>
//           <div className="modal-header justify-content-start pb-0">
//             <div className="mb-2" onClick={backBtn}>
//               <IoIosArrowBack />
//               Back
//             </div>

//             <button
//               type="button"
//               onClick={onClickCloseHandler}
//               className="close"
//               data-dismiss="modal"
//               aria-label="Close"
//             >
//               <span aria-hidden="true">&times;</span>
//             </button>
//           </div>

//           <div className="deposit-modalheader">
//             <h5 className="modal-title mt-0 fw-bold" id="myModalLabel">
//               Deposit
//             </h5>
//           </div>
//         </div>

//         <div className="modal-body">
//           <AvForm className="mt-3" onValidSubmit={onClickHandler}>
//             <div className="deposit-fees-main">
//               <button
//                 type="button"
//                 className="deposite-buttons"
//                 color="secondary"
//                 onClick={onClickBankCardHandler}
//               >
//                 <i className="fa fa-plus deposit-icon" />
//                 {selectedOptionFiat === 'card' ? 'Add Card' : 'Add Bank'}
//               </button>
//             </div>
//             <Col sm="12" className="mb-3  position-relative">
//               <AvField
//                 name="bank"
//                 className="form-select"
//                 label={<h6>Select Bank Account</h6>}
//                 type="select"
//                 onChange={event => {
//                   setBankDetails(event.target.value);
//                 }}
//                 required
//               >
//                 <option value="" disabled>
//                   Select
//                 </option>
//                 {linkedBankAccounts &&
//                   linkedBankAccounts?.banks?.length > 0 &&
//                   selectedOptionFiat !== 'card' &&
//                   linkedBankAccounts?.banks
//                     ?.filter(item => item.type.toLowerCase() === selectedOptionFiat.toLowerCase())
//                     .map(bank => (
//                       <option value={selectedOptionFiat === 'Wire' ? bank._id : bank.id}>
//                         {' '}
//                         {bank.bankName}({bank.accountNumber})
//                       </option>
//                     ))}
//                 {linkedCards &&
//                   selectedOptionFiat === 'card' &&
//                   linkedCards?.map(card => (
//                     <option value={card.cardId}>{`**** **** **** ${card.lastFour}`}</option>
//                   ))}
//               </AvField>
//               {/* <div>
//                 <i className="fas fa-angle-down drop-down" />
//               </div> */}
//             </Col>
//             {!TRACKING_REFRENCE === 'true' ||
//               (selectedOptionFiat !== 'Wire' && (
//                 <>
//                   <Col sm="12" className="mb-3 position-relative">
//                     <AvField
//                       name="Amount"
//                       label={<h6>Enter Deposit Amount</h6>}
//                       type="text"
//                       placeholder="0.00"
//                       value={depositAmount}
//                       onChange={e => {
//                         updateServiceFeeAmount(e.target.value);
//                       }}
//                       required
//                     />
//                     <p className="text-muted usd">
//                       <i>~USD</i>
//                     </p>
//                   </Col>

//                   <div className="deposit-fees">
//                     <p>Fees</p>
//                     <p>
//                       $
//                       {selectedOptionFiat === 'Wire'
//                         ? serviceFees[0]?.wirePaymentFee
//                         : serviceFeeAmount}
//                       .00
//                     </p>
//                   </div>
//                   <div className="deposit-fees">
//                     <p>Total</p>
//                     <p>
//                       {selectedOptionFiat === 'Wire' ? (
//                         Number(depositAmount) > 0 ? (
//                           Math.round(
//                             (Number(depositAmount) - serviceFees[0]?.wirePaymentFee) * 100,
//                           ) > 0 ? (
//                             <CurrencyFormat
//                               prefix="$"
//                               value={Math.round(
//                                 Number(depositAmount) - serviceFees[0]?.wirePaymentFee,
//                               )}
//                               zeroAllowed
//                             />
//                           ) : (
//                             '$ 0.00'
//                           )
//                         ) : (
//                           '$ 0.00'
//                         )
//                       ) : (
//                         <CurrencyFormat
//                           prefix="$"
//                           value={Number(depositAmount) - serviceFeeAmount}
//                           zeroAllowed
//                         />
//                       )}
//                     </p>
//                   </div>
//                 </>
//               ))}
//             <div className="modal-footer justify-content-center pt-0">
//               <Button type="submit" className="btn btn-continue">
//                 Confirm Transaction
//               </Button>
//             </div>
//           </AvForm>
//         </div>
//       </Modal>
//       {selectedOptionFiat && (
//         <AddBank
//           handelAddAccount={handelAddAccount}
//           modal={addAccount}
//           updatedValues={updatedValues}
//           hadelAddBillingDetailsClick={hadelAddBillingDetailsClick}
//           selectedOptionFiat={selectedOptionFiat}
//           displayRadio={selectedOptionFiat !== ''}
//           updatedSelectedWireValues={updatedSelectedWireValues}
//         />
//       )}
//       <AddBillingDetails
//         modal={addBillingDetails}
//         handelAddBilling={handelAddBillingDetails}
//         selectedToken={token}
//         selectedAccType={accType}
//         selectedEmail={email}
//         selectedOption={selectedOptionFiat}
//         selectedWireOptions={selectedWireOptions}
//       />
//       {selectedOptionFiat === 'ACH' && (
//         <WalletDepositConfirmModal
//           walletDespoitDetails={walletDespoitDetails}
//           selectedWireOptions={selectedWireOptions}
//           selectedOption={selectedOptionFiat}
//           depositAmount={depositAmount}
//           selectedCard={bankDetails}
//           success={depositSuccess}
//           close={walletClose}
//           isOpen={isDeposit}
//           closeDep={close}
//         />
//       )}
//       {selectedOptionFiat !== 'ACH' && (
//         <WireDepositModal modal={isDeposit} handelShowDetails={handelShowDetails} close={close} />
//       )}
//       <AddCard modal={addCard} handelAddCard={handelAddCard} close={() => setAddCard(false)} />
//     </>
//   );
// };

// export default WalletDepositBankModal;
