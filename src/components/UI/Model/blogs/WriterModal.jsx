// import { useDispatch, useSelector } from 'react-redux';
// import React, { useEffect, useState } from 'react';

// import { Modal, ModalHeader, ModalBody, Label, Button, FormGroup} from 'reactstrap';
// import { AvGroup, AvInput, AvField, AvForm } from 'availity-reactstrap-validation';
// import ProgressBar from 'components/ProgressBar';
// import { toast } from 'react-toastify';
// import Dropzone from 'react-dropzone';

// import { commonSaga } from 'store/actions';
// import { axiosMain } from 'http/axios/axios_main';

// const WriterModal = ({ isOpen, onClose, modalType, setModalType, data}) => {
//     const dispatch = useDispatch();
//     const { commonData } = useSelector((state) => ({
//         commonData: state.common,
//     }));

//     const [uploading, setUploading] = useState(0);
//     const [uploadedFile, setUploadedFile] = useState({});

//     useEffect(() => {
//         if(commonData?.createAuthor?.dataSaved || commonData?.updateAuthor?.dataUpdated) {
//             setUploadedFile({});
//             onClose(false);
//         }
//     }, [commonData?.createAuthor || commonData?.updateAuthor]);

//   const toggle = () => {
//     onClose(false);
//   };

//   const onTransfer = (event, values) => {
//       if(event?.target?.checkValidity()) {
//           values.profilePic = uploadedFile?.[0] || data?.profilePic;
//         if(modalType === "create") {
//           dispatch(commonSaga({endPoint: `/admin/create-author`, type: "post", stateObj: "createAuthor", dataToPost: values, 'msg': 'Writer Added Successfully!', showAlert: true}));
//         } else {
//           dispatch(commonSaga({endPoint: `/admin/update/author/${data?._id}`, type: "put", stateObj: "updateAuthor", dataToPost: values, 'msg': 'Writer Updated Successfully!', showAlert: true}));
//         }
//       }
//   }

//   const handleAcceptedFiles = async files => {
//     if (!files.length) return;
//     const fd = new FormData();
//     const docType = 'documents';
//     try {
//       files.forEach(item => fd.append(docType, item));
//       const response = await axiosMain({
//         method: 'post',
//         url: '/property/file.upload',
//         data: fd,
//         onUploadProgress: progress => {
//           const { total, loaded } = progress;
//           const totalSizeInMB = total / 1000000;
//           const loadedSizeInMB = loaded / 1000000;
//           const uploadPercentage = Math.floor((loadedSizeInMB / totalSizeInMB) * 100);
//           setUploading(uploadPercentage);
//         },
//       });
//       setUploadedFile(response.data?.data?.[docType])
//     } catch (err) {
//       const msg =
//         err.response?.status === 413
//           ? 'Request entity too large to upload'
//           : err.response?.data?.msg || 'Something went wrong, server error!';
//       toast.error(msg);
//     }
//   };
  
//   return (  
//     <>
//       <Modal isOpen={isOpen} toggle={toggle} centered>
//         <ModalHeader className="mx-auto" toggle={toggle}>Writer</ModalHeader>
//         <ModalBody>
//             <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
//             <AvForm onValidSubmit={onTransfer} model={data}>
//                 <FormGroup>
//                     <AvField disabled={modalType === "view"} name="firstName" label="First Name" placeholder="First Name" required />
//                 </FormGroup>
//                 <FormGroup>
//                     <AvField disabled={modalType === "view"} name="lastName" label="Last Name" placeholder="Last Name" required />
//                 </FormGroup>
//                 <AvGroup check className="mt20">
//                     <Label check>
//                         <AvInput disabled={modalType === "view"} type="checkbox" name="isHidden" /> Hide
//                     </Label>
//                 </AvGroup>
//                 {modalType !== "create" && !uploadedFile?.length && data?.profilePic?.contentType?.includes("image") && <img className="mt20" src={data?.profilePic?.url} height="100" alt={data?.profilePic?.key} />}
//                 {uploadedFile?.length && uploadedFile[0]?.contentType.includes("image") && <img className="mt20" src={uploadedFile[0]?.url} height="100" alt={uploadedFile[0]?.key} />}

//                 {modalType !== "view" && <FormGroup>
//                     <Dropzone
//                     onDrop={acceptedFiles => {handleAcceptedFiles(acceptedFiles);}}
//                     accept=".svg,.jpeg,.jpg,.png" multiple={false}>
//                         {({ getRootProps, getInputProps }) => (
//                         <div className="needsclick" {...getRootProps()}>
//                             <input {...getInputProps()} />
//                             <h6><i className="display-6 text-muted uil uil-cloud-upload" /> Choose Icons File or Drop</h6>
//                             <p>.svg, .png, .jpg and .jpeg format supported</p>
//                         </div>
//                         )}
//                     </Dropzone>
//                 </FormGroup>}
//                 <FormGroup className="tac mt20">
//                     {modalType !== "view" && <Button disabled={commonData?.createAuthor?.isLoading} color="primary w-50 mx-auto button-color" type="submit">
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

// export default WriterModal