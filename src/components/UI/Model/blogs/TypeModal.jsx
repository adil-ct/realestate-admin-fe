// import { useDispatch, useSelector } from 'react-redux';
// import React, { useEffect } from 'react';

// import { AvGroup, AvInput, AvField, AvForm } from 'availity-reactstrap-validation';
// import { Modal, ModalHeader, Label, ModalBody, Button, FormGroup} from 'reactstrap';

// import { commonSaga } from 'store/actions';

// const TypeModal = ({ isOpen, onClose, modalType, setModalType, data}) => {
//     const dispatch = useDispatch();
//     const { commonData } = useSelector((state) => ({
//         commonData: state.common,
//     }));

//     useEffect(() => {
//         if(commonData?.createType?.dataSaved || commonData?.updateType?.dataUpdated) {
//             onClose(false);
//         }
//     }, [commonData?.createType?.dataObj, commonData?.updateType?.dataObj]);

//     const toggle = () => {
//         onClose(false);
//     };

//   const onSubmit = (event, values) => {
//       if(event?.target?.checkValidity()) {
//         if(modalType === "create") {
//             dispatch(commonSaga({endPoint: `/admin/create-type`, type: "post", stateObj: "createType", dataToPost: values, 'msg': 'Type Added Successfully!', showAlert: true}));
//         } else {
//           dispatch(commonSaga({endPoint: `/admin/update/blogType/${data?._id}`, type: "put", stateObj: "updateType", dataToPost: values, 'msg': 'Type Updated Successfully!', showAlert: true}));
//         } 
//       }
//   }
  
//   return (  
//     <>
//       <Modal isOpen={isOpen} toggle={toggle} centered>
//         <ModalHeader className="mx-auto" toggle={toggle}>Blog Type</ModalHeader>
//         <ModalBody>
//             <AvForm onValidSubmit={onSubmit} model={data}>
//                 <FormGroup>
//                     <AvField name="name" disabled={modalType === "view"} label="Name" placeholder="Name" required />
//                 </FormGroup>
//                 <AvGroup check className="mt20">
//                     <Label check>
//                         <AvInput disabled={modalType === "view"} type="checkbox" name="isHidden" /> Hide
//                     </Label>
//                 </AvGroup>
//                 <FormGroup className="tac mt20">
//                     {modalType !== "view" && <Button disabled={commonData?.createType?.isLoading || commonData?.updateType?.isLoading} color="primary w-50 mx-auto button-color" type="submit">
//                         {modalType === "create" ? "Submit" : "Update"}
//                     </Button>}
//                     {modalType === "view" && <Button color="primary w-50 mx-auto button-color" onClick={() => setModalType("edit")} type="button">
//                         Edit
//                       </Button>
//                     }
//                 </FormGroup>
//             </AvForm>
//         </ModalBody>
//       </Modal>
//     </>
//   )
// }

// export default TypeModal