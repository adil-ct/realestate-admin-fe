// /* eslint-disable no-underscore-dangle */
// import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// import { Button, FormGroup, Label, Container} from 'reactstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useHistory } from 'react-router';
// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import Dropzone from 'react-dropzone';
// import JoditEditor from "jodit-react";
// import "jodit";

// import { commonSaga, commonSuccess } from 'store/actions';
// import { editorConfig } from 'constants/EditorConfig';
// import { axiosMain } from 'http/axios/axios_main';
// import MultiSelect from 'components/MultiSelect';
// import ProgressBar from 'components/ProgressBar';
// import Breadcrumb from 'components/BreadCrumb';
// import "jodit/build/jodit.min.css";
// import '../viewcommon.css';
// import './index.css';

// const AddBlog = () => {
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const { state } = useLocation();
//     const { commonData } = useSelector((stateObj) => ({
//         commonData: stateObj.common,
//     }));
//     const [viewMode, setViewMode] = useState(state?.data?.type || "create");
//     const [editorVal, setEditorVal] = useState(state?.data?.content || '');
//     const [selectedBlogTypes, setSelectedBlogTypes] = useState([]);
//     const [uploadedFile, setUploadedFile] = useState({});
//     const [uploading, setUploading] = useState(0);
//     const BreadCrumbList = ([
//       {
//         name: 'Blogs',
//         link: '/blogs',
//       },
//       { name: 'Blog Details' },
//     ]);

//     useEffect(() => {
//         dispatch(commonSaga({endPoint: `/admin/blog-types?page=1&limit=100&isHidden=false`, type: 'get', stateObj: 'typeList'}));
//     }, []);

//     useEffect(() => {
//       if(commonData?.typeList?.reqCompleted) {
//         dispatch(commonSaga({endPoint: `/admin/authors?page=1&limit=100&isHidden=false`, type: 'get', stateObj: 'authorsList'}));
//       }
//     }, [commonData?.typeList]);

//     useEffect(() => {
//         if(commonData?.createBlog?.dataSaved || commonData?.updateBlog?.dataUpdated) {
//             setViewMode('create');
//             setUploadedFile({});
//             if(commonData?.createBlog?.dataSaved) {
//               dispatch(commonSuccess({stateObj: "createBlog", dataSaved: false}));
//             } else {
//               dispatch(commonSuccess({stateObj: "updateBlog", dataUpdated: false}));
//             }
//             history.push({pathname: `/blogs`});
//         }
//     }, [commonData?.createBlog, commonData?.updateBlog]);

//   const onTransfer = (event, values) => {
//       let _selectedBlogTypes = [];
//       if(selectedBlogTypes) {
//         _selectedBlogTypes = commonData?.typeList?.dataObj?.blogType.filter(ele => selectedBlogTypes.indexOf(ele?.name) !== -1).map(ele => ele?._id);
//       }
//       const dataToPost = {
//         ...values,
//         content: editorVal,
//         image: uploadedFile[0],
//         blogType: _selectedBlogTypes?.length && _selectedBlogTypes || state?.data?.blogTypeDetails
//       }

//       if(event?.target?.checkValidity()) {
//         if(viewMode === "create") {
//           dispatch(commonSaga({endPoint: `/admin/create-blog`, type: "post", stateObj: "createBlog", dataToPost, 'msg': 'Blog Added Successfully!', showAlert: true}));
//         } else {
//           dispatch(commonSaga({endPoint: `/admin/update/blog/${state?.data?._id}`, type: "put", stateObj: "updateBlog", dataToPost, 'msg': 'Blog Updated Successfully!', showAlert: true}));
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

//   const handleChange = (e) => {
//      setEditorVal(e);
//   };
  
//   return (  
//     <>
//     <div className="page-content">
//       <div className="breadcrumb_btn">
//         <Breadcrumb items={BreadCrumbList} />
//       </div>

//       <Container fluid>
//         <div className="investor-background p30">
//           <AvForm onValidSubmit={onTransfer} model={state?.data}>
//             <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
//             <FormGroup>
//                 <AvField disabled={viewMode === "view"} name="title" label="Title" placeholder="Title" required />
//             </FormGroup>
//             <Label>Description</Label>
//             <div>
//                 {viewMode !== "view" && (
//                     <JoditEditor
//                         value={editorVal}
//                         config={editorConfig}
//                         onChange={(value) => {
//                         handleChange(value)
//                     }}
//                 />
//                 )}
//                 {viewMode === "view" && (
//                     <div className="descriptionBox" dangerouslySetInnerHTML={{__html: editorVal}} />
//                 )}
//             </div>
//             {commonData?.typeList?.dataObj?.blogType?.length > 0 && 
//             <>
//               <Label>Blog Type </Label>
//               <MultiSelect 
//                 options={commonData?.typeList?.dataObj?.blogType?.map(ele => ele?.name)} 
//                 preSelected={state?.data?.blogTypeDetails?.map(ele => ele?.name)}
//                 onSelect={(list) => setSelectedBlogTypes(list)}
//                 disabled={viewMode === "view" }
//                 eleClass="customMultiSelect"
//                 title="Blog Type"
//                 name="blogType"
//                 showSelected
//               />
//              </>}
//             {commonData?.authorsList?.dataObj?.authors?.length > 0 && <AvField
//                 label="Author" 
//                 type="select"
//                 name="author"
//                 className="form-select"
//                 disabled={viewMode === "view"}
//                 value={state?.data?.authorDetails?._id}
//                 required
//             >
//                 <option disabled="true" value="">Select Author</option>
//                 {commonData?.authorsList?.dataObj?.authors?.map(option => (
//                     <option key={option?._id} value={option?._id}>{option?.firstName} {option?.lastName}</option>
//                 ))}
//             </AvField>}
//             <AvGroup check className="mt20">
//                 <Label check>
//                     <AvInput disabled={viewMode === "view"} type="checkbox" name="isOnTop" /> Set On Top
//                 </Label>
//             </AvGroup>
//             <AvGroup check className="mt20">
//                 <Label check>
//                     <AvInput disabled={viewMode === "view"} type="checkbox" name="isPopular" /> Set Popular
//                 </Label>
//             </AvGroup>
//             <AvGroup check className="mt20">
//                 <Label check>
//                     <AvInput disabled={viewMode === "view"} type="checkbox" name="isHidden" /> Hide
//                 </Label>
//             </AvGroup>
//             {viewMode !== "create" && !uploadedFile?.length && state?.data?.image?.contentType?.includes('image') && <img className="mt20" src={state?.data?.image?.url} height="100" alt={state?.data?.image?.key} />}
//             {uploadedFile?.length && uploadedFile[0]?.contentType?.includes('image') && <img className="mt20" src={uploadedFile[0]?.url} height="100" alt={uploadedFile[0]?.key} />}

//             {viewMode !== "view" && <FormGroup>
//                 <Dropzone
//                 onDrop={acceptedFiles => {handleAcceptedFiles(acceptedFiles);}}
//                 accept=".svg,.jpeg,.jpg,.png" multiple={false}>
//                     {({ getRootProps, getInputProps }) => (
//                     <div className="needsclick" {...getRootProps()}>
//                         <input {...getInputProps()} />
//                         <h6><i className="display-6 text-muted uil uil-cloud-upload" /> Choose Icons File or Drop</h6>
//                         <p>.svg, .png, .jpg and .jpeg format supported</p>
//                     </div>
//                     )}
//                 </Dropzone>
//             </FormGroup>}
//             <FormGroup className="tac mt20">
//                 {viewMode !== "view" && <Button disabled={commonData?.createBlog?.isLoading} color="primary w-50 mx-auto button-color" type="submit">{viewMode === "edit" ? "Update" : "Submit"}</Button>}
//                 {viewMode === "view" && <Button color="primary w-50 mx-auto button-color" onClick={() => setViewMode("edit")} type="button">Edit</Button>}
//             </FormGroup>
//         </AvForm>
//         </div>
//       </Container>
//     </div>
//     </>
//   )
// }

// export default AddBlog