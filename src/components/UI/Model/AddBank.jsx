// import { AvFeedback, AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// import { FormGroup, Input, Label, Modal, ModalBody, TabContent, TabPane } from 'reactstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import React, { useEffect, useState } from 'react';
// import { usePlaidLink } from 'react-plaid-link';
// import { useHistory } from 'react-router';

// import { AiOutlineClose } from 'react-icons/ai';

// // static imports
// import './addBank.css';
// import {
//   getPlaidTokenSaga,
//   getLocation,
//   getCityLocationSaga,
//   getSelectedLocation,
//   getSelectedCity,
// } from 'store/actions';
// // eslint-disable-next-line no-unused-vars

// const AddBank = ({
//   hadelAddBillingDetailsClick,
//   updatedSelectedWireValues,
//   selectedOptionFiat,
//   handelAddAccount,
//   updatedValues,
//   displayRadio,
//   redirectUrl,
//   modal,
// }) => {
//   const { countries, selectedCountry } = useSelector(state => state.account);
//   const { plaidLinkToken } = useSelector(state => state.account);
//   const dispatch = useDispatch();
//   const history = useHistory();

//   const [plaidConfigToken, setPlaidConfigToken] = useState('');
//   const [selctedOption, setSelectedOption] = useState('ACH');
//   const [fetchToken, setFetchToken] = useState(false);
//   const [accType, setAccType] = useState('retail');
//   const [token, setToken] = useState('');

//   const [wireValues, setWireValues] = useState({
//     accountNumber: '12340010',
//     routingNumber: '121000248',
//     bankName: 'SAN FRANCISCO',
//     country: 'United States',
//     city: '',
//     bankType: 'USBANK',
//   });

//   const toggle = () => {
//     handelAddAccount(false);
//     setAccType('');
//   };

//   useEffect(() => {
//     dispatch(
//       getLocation({
//         reqType: 'get',
//         url: '/auth/country-code',
//         type: 'countries',
//       }),
//     );
//   }, []);

//   useEffect(() => {
//     if(selectedCountry) {
//       dispatch(
//         getCityLocationSaga({
//           reqType: 'get',
//           url: `/auth/cities/${selectedCountry}`,
//           type: 'city',
//         }),
//       );
//     }
//   }, [selectedCountry]);

//   const selectedWireValues = (event, field) => {
//     setWireValues({
//       ...wireValues,
//       [field]: event.target.value,
//     });
//   };
//   useEffect(() => {
//     setPlaidConfigToken(plaidLinkToken?.link);
//   }, [plaidLinkToken]);

//   const countryHandler = event => {
//     selectedWireValues(event, 'country');
//     dispatch(getSelectedLocation(event.target.value));
//   };

//   const cityHandler = event => {
//     selectedWireValues(event, 'city');
//     dispatch(getSelectedCity(event.target.value));
//   };

//   const config =
//     // Plaid token instance for redirect uri
//     redirectUrl?.length > 0
//       ? {
//           token: localStorage.getItem('link_token'),
//           receivedRedirectUri: redirectUrl,
//           onSuccess: publicToken => {
//             // send public_token to server
//             setToken(publicToken);
//           },
//           onExit: (error, metadata) => {
//             // Using the console for debugging the error if any errors occur
//             console.log('data', error, metadata);
//             history.push('/account-details');
//           },
//         }
//       : {
//           token: plaidConfigToken,
//           onSuccess: publicToken => {
//             // send public_token to server
//             setToken(publicToken);
//           },
//           onExit: (error, metadata) => {
//             // Using the console for debugging the error if any errors occur
//             console.log('data', error, metadata);
//           },
//         };

//   const selType = [
//     {
//       label: 'Personal Bank',
//       value: 'retail',
//     },
//     {
//       label: 'Business Bank',
//       value: 'business',
//     },
//   ];

//   const selWireType = [
//     {
//       label: 'US Bank Account',
//       value: 'USBANK',
//     },
//     {
//       label: 'Non-US Bank Account-IBAN Supported',
//       value: 'NONUS-IBAN',
//     },
//     {
//       label: ' Non-US Bank Account-IBAN Not Supported',
//       value: 'NONUS-NIBAN',
//     },
//   ];

//   const selectionHandler = event => {
//     setAccType(event.target.value);
//   };

//   // const emailHandler = event => {
//   //   setEmail(event.target.value);
//   // };

//   const { open, ready } = usePlaidLink(config);

//   useEffect(() => {
//     if (ready && fetchToken && plaidConfigToken?.length > 0) {
//       open();
//       setFetchToken(false);
//     }
//   }, [fetchToken, ready, open]);

//   // Plaid token instance for redirect uri
//   useEffect(() => {
//     if (ready && redirectUrl?.length > 0 && localStorage.getItem('link_token').length > 0) {
//       open();
//       setFetchToken(false);
//     }
//   }, [redirectUrl, ready, open]);

//   // Get plaid token link from api
//   const getPlaidTokenHandler = async () => {
//     await dispatch(getPlaidTokenSaga());
//     setFetchToken(true);
//   };

//   return (
//     <Modal isOpen={modal} toggle={toggle} centered scrollable>
//       <ModalBody>
//         <div>
//           <div className="modal-header-class">
//             <button
//               type="button"
//               onClick={toggle}
//               className="modal-colse-btn-black"
//               data-dismiss="modal"
//               aria-label="Close"
//             >
//               <AiOutlineClose />
//             </button>{' '}
//           </div>
//           <div>
//             <h2 className="add-bank-modal-title">Add Bank Account</h2>
//           </div>
//           {!displayRadio && (
//             <div>
//               <FormGroup tag="fieldset">
//                 <span className="add-bank-select-method">Select Payment Method</span>
//                 <div className="add-bank-radio-container">
//                   <FormGroup check className="me-2">
//                     <Label check>
//                       <Input
//                         type="radio"
//                         value={selctedOption}
//                         name="radio"
//                         checked={selctedOption === 'ACH'}
//                         onClick={() => setSelectedOption('ACH')}
//                       />{' '}
//                       ACH
//                     </Label>
//                   </FormGroup>
//                   <FormGroup check>
//                     <Label check>
//                       <Input
//                         type="radio"
//                         value={selctedOption}
//                         name="radio"
//                         checked={selctedOption === 'Wire'}
//                         onClick={() => setSelectedOption('Wire')}
//                       />{' '}
//                       Wire
//                     </Label>
//                   </FormGroup>
//                 </div>
//               </FormGroup>
//             </div>
//           )}
//           <TabContent
//             activeTab={
//               selectedOptionFiat
//                 ? selectedOptionFiat === 'ACH'
//                   ? 1
//                   : 2
//                 : selctedOption === 'ACH'
//                 ? 1
//                 : 2
//             }
//           >
//             <TabPane tabId={1}>
//               <div>
//                 <AvForm onValidSubmit={hadelAddBillingDetailsClick}>
//                   <AvGroup className="add-bank-modal-form-label-container fetch-btn-container">
//                     <Label>Plaid Token</Label>
//                     <AvField
//                       type="text"
//                       name="Plained Token"
//                       placeholder="Plaid Token"
//                       disabled
//                       required
//                       value={token}
//                     />
//                     <div className="plaid-input-div-container">
//                       <button
//                         type="button"
//                         className="plain-input-btn"
//                         onClick={getPlaidTokenHandler}
//                       >
//                         Fetch Token
//                       </button>
//                     </div>
//                   </AvGroup>
//                   {/* <Col sm="12">
//                     <AvGroup className="add-bank-modal-form-label-container">
//                       <Label>Email</Label>
//                       <AvField
//                         type="email"
//                         name="Email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={emailHandler}
//                         required
//                       />
//                     </AvGroup>
//                   </Col> */}
//                   <Label>Account Type</Label>
//                   <AvField
//                     type="select"
//                     name="Account Type"
//                     className="form-select"
//                     value={accType}
//                     onChange={selectionHandler}
//                     required
//                   >
//                     {selType.map(option => (
//                       <option value={option.value}>{option.label}</option>
//                     ))}
//                   </AvField>
//                   <div className="add-bank-modal-bottom-btn-container">
//                     <button type="button" className="add-bank-modal-bottom-btn" onClick={toggle}>
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="add-bank-modal-bottom-btn add-bank-electric-blue"
//                       onClick={() => updatedValues(token, accType)}
//                     >
//                       Add Billing Details
//                     </button>
//                   </div>
//                 </AvForm>
//               </div>
//             </TabPane>
//             <TabPane tabId={2}>
//               <AvForm onValidSubmit={hadelAddBillingDetailsClick} model={wireValues}>
//                 <FormGroup>
//                   <Label for="AccountType">Account Type</Label>
//                   <AvField
//                     id="AccountType"
//                     name="bankType"
//                     type="select"
//                     className="form-select"
//                     value={wireValues.bankType}
//                     onChange={event => selectedWireValues(event, 'bankType')}
//                   >
//                     {/* <option value="" disabled>
//                       Select
//                     </option> */}
//                     {selWireType.map(option => (
//                       <option value={option.value}>{option.label}</option>
//                     ))}
//                   </AvField>
//                 </FormGroup>

//                 <AvGroup className="add-bank-modal-form-label-container">
//                   <Label for="BankAccountNumber">Bank Account Number</Label>
//                   <AvInput
//                     name="BankAccountNumber"
//                     placeholder="Account Number"
//                     value={wireValues.accountNumber}
//                     onChange={event => selectedWireValues(event, 'accountNumber')}
//                     required
//                   />
//                   <AvFeedback>This is required field</AvFeedback>
//                 </AvGroup>
//                 <AvGroup className="add-bank-modal-form-label-container">
//                   <Label for="BankRoutingNumber">Bank Routing Number</Label>
//                   <AvInput
//                     name="BankRoutingNumber"
//                     placeholder="Bank Routing Number"
//                     value={wireValues.routingNumber}
//                     onChange={event => selectedWireValues(event, 'routingNumber')}
//                     required
//                   />
//                   <AvFeedback>This is required field</AvFeedback>
//                 </AvGroup>
//                 {/* <AvGroup className="add-bank-modal-form-label-container">
//                   <Label for="BankName">Bank Name</Label>
//                   <AvInput
//                     name="BankName"
//                     placeholder="Bank Name"
//                     value={wireValues.bankName}
//                     onChange={event => selectedWireValues(event, 'bankName')}
//                     // required
//                   />
//                   <AvFeedback>This is required field</AvFeedback>
//                 </AvGroup> */}
//                 <FormGroup>
//                   <Label for="BankCountry">Bank Country</Label>
//                   <AvField
//                     id="BankCountry"
//                     name="country"
//                     type="select"
//                     className="form-select"
//                     value={wireValues.country}
//                     onChange={countryHandler}
//                     required
//                   >
//                     <option value="United States">United States</option>
//                     {countries?.map(option => (
//                       <option value={option.country_name}>{option.country_name}</option>
//                     ))}
//                   </AvField>
//                 </FormGroup>
//                 <FormGroup>
//                   <Label for="BankCity">Bank City</Label>
//                   <AvInput
//                     id="BankCity"
//                     name="city"
//                     value={wireValues.city}
//                     onChange={cityHandler}
//                   />
//                   {/* <AvField
//                     id="BankCity"
//                     name="city"
//                     type="select"
//                     value={wireValues.city}
//                     onChange={cityHandler}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select
//                     </option>
//                     {cities && cities?.map(option => <option value={option}>{option}</option>)}
//                   </AvField> */}
//                 </FormGroup>
//                 <div className="add-bank-modal-bottom-btn-container">
//                   <button type="button" className="add-bank-modal-bottom-btn" onClick={toggle}>
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="add-bank-modal-bottom-btn add-bank-electric-blue"
//                     onClick={() => updatedSelectedWireValues(wireValues)}
//                   >
//                     Add Billing Details
//                   </button>
//                 </div>
//               </AvForm>
//             </TabPane>
//           </TabContent>
//         </div>
//       </ModalBody>
//     </Modal>
//   );
// };

// export default AddBank;
