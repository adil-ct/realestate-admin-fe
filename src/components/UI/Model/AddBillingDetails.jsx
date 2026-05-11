// import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
// import { Col, Label, Modal, ModalBody, Row } from 'reactstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router';
// import { IoIosArrowBack } from 'react-icons/io';
// import { AiOutlineClose } from 'react-icons/ai';
// import {
//   addACHBankAccountSaga,
//   addWireBankAccountSaga,
//   getCityLocationSaga,
//   getDistrictLocationSaga,
// } from 'store/actions';

// // Static imports
// import './AddBilling.css';
// import axios from 'axios';

// const AddBillingDetails = ({
//   redirectUrl,
//   modal,
//   handelAddBilling,
//   backBtn,
//   selectedToken,
//   selectedAccType,
//   selectedEmail,
//   selectedOption,
//   selectedWireOptions,
//   addCardHandler,
//   cardDetails,
//   addCard,
// }) => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const { countries, districts, plaidLinkToken } = useSelector(state => state.account);
//   const [selectedValues, setSelectedValues] = useState({
//     firstName: '',
//     lastName: '',
//     country: 'United States',
//     city: '',
//     district: '',
//     zipCode: '',
//     address1: '',
//     address2: '',
//   });

//   const toggle = () => {
//     handelAddBilling(false);
//   };

//   useEffect(() => {
//     dispatch(
//       getCityLocationSaga({
//         reqType: 'get',
//         url: `/auth/cities/${selectedValues.country}`,
//         type: 'city',
//       }),
//     );
//   }, []);

//   useEffect(() => {
//     dispatch(
//       getDistrictLocationSaga({
//         reqType: 'get',
//         url: `/auth/district/${selectedValues.country}`,
//         type: 'state',
//       }),
//     );
//   }, [selectedValues.country]);

//   const selectedWireValues = (event, field) => {
//     setSelectedValues({
//       ...selectedValues,
//       [field]: event.target.value,
//     });
//   };

//   const cityHandler = event => {
//     selectedWireValues(event, 'city');
//     dispatch(
//       getDistrictLocationSaga({
//         reqType: 'get',
//         url: `/auth/district/United States`,
//         type: 'district',
//       }),
//     );
//   };

//   const handleSuccess = () => {
//     if (redirectUrl.length > 0) history.push('/account-details');
//   };
//   const CountryCode =
//     countries && countries.filter(country => country.country_name === selectedValues.country);
//   const bankCountryCode =
//     countries && countries.filter(country => country.country_name === selectedWireOptions.country);
//   const submitBankDetails = async () => {
//     if (addCard === 'addCard') {
//       const splitedDate = cardDetails.expiryDate.split('/');
//       const res = await axios.get('https://geolocation-db.com/json/');
//       const requestBody = {
//         cvv: cardDetails.cvv,
//         number: cardDetails.cardNumber.replace(/ /g, ''),
//         expMonth: splitedDate[0],
//         expYear: `20${splitedDate[1]}`,
//         billingDetails: {
//           name: `${selectedValues.firstName} ${selectedValues.lastName}`,
//           line1: selectedValues.address1,
//           city: selectedValues.city,
//           postalCode: selectedValues.zipCode,
//           district: selectedValues.district,
//           country: CountryCode[0].TLD,
//         },
//         metadata: {
//           email: cardDetails.email,
//           ipAddress: res.data.IPv4,
//           sessionId: 'DE6FA86F60BB47B379307F851E238617',
//         },
//       };
//       addCardHandler(requestBody);
//     } else {
//       if (selectedOption === 'ACH') {
//         const requestBody = {
//           publicToken: selectedToken,
//           bankAccountType: selectedAccType,
//           billingDetails: {
//             name: `${selectedValues.firstName} ${selectedValues.lastName}`,
//           },
//           metadata: {
//             email: selectedEmail,
//           },
//           plaid_created_at: plaidLinkToken?.plaid_created_at
//         };
//         dispatch(addACHBankAccountSaga({ requestBody, handleSuccess }));
//       } else {
//         const requestBody =
//           selectedWireOptions.bankType === 'NONUS-IBAN'
//             ? {
//                 iban: selectedWireOptions.accountNumber,
//                 accountNumber: selectedWireOptions.accountNumber,
//                 routingNumber: selectedWireOptions.routingNumber,
//                 bankType: selectedWireOptions.bankType,
//                 billingDetails: {
//                   name: `${selectedValues.firstName} ${selectedValues.lastName}`,
//                   line1: selectedValues.address1,
//                   city: selectedValues.city,
//                   postalCode: selectedValues.zipCode,
//                   district: selectedValues.district,
//                   country: CountryCode[0].TLD,
//                 },
//                 bankAddress: {
//                   bankName: selectedWireOptions.bankName,
//                   city: selectedWireOptions.city,
//                   country: bankCountryCode[0].TLD,
//                 },
//               }
//             : {
//                 accountNumber: selectedWireOptions.accountNumber,
//                 routingNumber: selectedWireOptions.routingNumber,
//                 bankType: selectedWireOptions.bankType,
//                 billingDetails: {
//                   name: `${selectedValues.firstName} ${selectedValues.lastName}`,
//                   line1: selectedValues.address1,
//                   city: selectedValues.city,
//                   postalCode: selectedValues.zipCode,
//                   district: selectedValues.district,
//                   country: CountryCode[0].TLD,
//                 },
//                 bankAddress: {
//                   bankName: selectedWireOptions.bankName,
//                   city: selectedWireOptions.city,
//                   country: bankCountryCode[0].TLD,
//                 },
//               };
//         dispatch(addWireBankAccountSaga({ requestBody, handleSuccess }));
//       }
//     }
//     // if (addWireBankAccount) {
//     handelAddBilling(false);

//     // }
//   };
//   return (
//     <Modal isOpen={modal} toggle={toggle} centered scrollable>
//       <ModalBody className="add-bank-modal-body">
//         <div>
//           <div className="modal-header-class d-flex justify-content-between add-billing-back-btn">
//             <div className="d-flex align-items-center" onClick={backBtn}>
//               <IoIosArrowBack />
//               Back
//             </div>
//             <div>
//               <button
//                 type="button"
//                 onClick={toggle}
//                 className="modal-colse-btn-black"
//                 data-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <AiOutlineClose />
//               </button>{' '}
//             </div>
//           </div>
//           <div>
//             <h2 className="add-bank-modal-title">Add Billing Details</h2>
//           </div>
//           <Row>
//             <AvForm onValidSubmit={submitBankDetails}>
//               {/* <div className="d-flex justify-content-between">
//                 <label>Same as personal details</label>
//                 <ToggleSwitch status={getEarlyAccess} onChange={handleToggleChange} />
//               </div> */}
//               <Col sm="12">
//                 <AvGroup className="add-bank-modal-form-label-container">
//                   <Label>First Name</Label>
//                   <AvField
//                     type="text"
//                     name="Account Holder Name"
//                     value={selectedValues.firstName}
//                     onChange={event => selectedWireValues(event, 'firstName')}
//                     required
//                   />
//                 </AvGroup>
//               </Col>
//               <Col sm="12">
//                 <AvGroup className="add-bank-modal-form-label-container">
//                   <Label>Last Name</Label>
//                   <AvField
//                     type="text"
//                     name="Account Holder Name"
//                     value={selectedValues.lastName}
//                     onChange={event => selectedWireValues(event, 'lastName')}
//                     required
//                   />
//                 </AvGroup>
//               </Col>
//               <Row>
//                 <Col xs="6">
//                   <AvField
//                     type="select"
//                     name="Country"
//                     label="Country"
//                     className="form-select"
//                     required={selectedOption === 'Wire'}
//                     value={selectedValues.country}
//                     onChange={event => selectedWireValues(event, 'country')}
//                   >
//                     <option value="United States">United States</option>
//                     {countries?.map(option => (
//                       <option value={option.country_name}>{option.country_name}</option>
//                     ))}
//                   </AvField>
//                 </Col>
//                 {districts && Object.values(districts)?.length > 0 ? (
//                   <Col xs="6">
//                     <AvField
//                       type="select"
//                       name="District"
//                       label="District"
//                       value={selectedValues.district}
//                       onChange={event => selectedWireValues(event, 'district')}
//                       required={selectedOption === 'Wire'}
//                     >
//                       <option value="select">District</option>
//                       {/* <option value="1">1</option>
//                     <option value="2">2</option> */}
//                       {/* {districts &&
//                         Object.values(districts)?.map(option => (
//                           <option value={option.name}>{option.name}</option>
//                         ))} */}
//                       {districts &&
//                         Object.values(districts)?.map((item, index) => (
//                           <option key={item.name} value={Object.keys(districts)[index]}>
//                             {item.name}
//                           </option>
//                         ))}
//                     </AvField>
//                   </Col>
//                 ) : (
//                   <Col xs="6">
//                     <AvField
//                       type="text"
//                       name="District"
//                       label="District"
//                       value={selectedValues.district}
//                       placeholder=""
//                       onChange={event => selectedWireValues(event, 'district')}
//                       required={selectedOption === 'Wire'}
//                     />
//                   </Col>
//                 )}
//               </Row>
//               <Row>
//                 <Col xs="6" className="mt-2">
//                   <AvField
//                     type="text"
//                     name="City"
//                     label="City"
//                     value={selectedValues.city}
//                     onChange={cityHandler}
//                     required={selectedOption === 'Wire'}
//                   >
//                     {/* <option value="" disabled>
//                       Select
//                     </option>
//                     {cities && cities?.map(option => <option value={option}>{option}</option>)} */}
//                   </AvField>
//                 </Col>
//                 <Col xs="6">
//                   <AvGroup className="add-bank-modal-form-label-container">
//                     <AvField
//                       type="Number"
//                       name="Zipcode"
//                       label="Zipcode"
//                       value={selectedValues.zipCode}
//                       onChange={event => selectedWireValues(event, 'zipCode')}
//                       required={selectedOption === 'Wire'}
//                     />
//                   </AvGroup>
//                 </Col>
//               </Row>

//               <Col sm="12">
//                 <AvGroup className="add-bank-modal-form-label-container">
//                   <Label>Streat Address 1</Label>
//                   <AvField
//                     type="text"
//                     name="Streat Address 1"
//                     value={selectedValues.address1}
//                     onChange={event => selectedWireValues(event, 'address1')}
//                     required={selectedOption === 'Wire'}
//                   />
//                 </AvGroup>
//               </Col>
//               <Col sm="12">
//                 <AvGroup className="add-bank-modal-form-label-container">
//                   <Label>Streat Address 2</Label>
//                   <AvField
//                     type="text"
//                     name="Streat Address 2"
//                     value={selectedValues.address2}
//                     onChange={event => selectedWireValues(event, 'address2')}
//                   />
//                 </AvGroup>
//               </Col>
//               <div className="add-bank-modal-bottom-btn-container">
//                 <button type="button" className="add-bank-modal-bottom-btn" onClick={toggle}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="add-bank-modal-bottom-btn add-bank-electric-blue">
//                   Submit
//                 </button>
//               </div>
//             </AvForm>
//           </Row>
//         </div>
//       </ModalBody>
//     </Modal>
//   );
// };

// export default AddBillingDetails;
