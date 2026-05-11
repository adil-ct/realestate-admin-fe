import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import { Modal, ModalHeader, ModalBody, Button, FormGroup, Label } from 'reactstrap';
import * as Yup from 'yup';

import ProgressBar from 'components/ProgressBar';
import { axiosMain } from 'http/axios/axios_main';

const AddPaymentMethods = ({ isOpen, onClose, modalType, setModalType, data, onSubmit}) => {
    const { commonData } = useSelector((state) => ({
      commonData: state.common,
    }));

    const [uploading, setUploading] = useState(0);
    
    const [uploadedFile, setUploadedFile] = useState({});

  const initialValues = {
    name: '',
    subHeading: '',
    description: '',
    booleanArr: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    subHeading: Yup.string().required('Subheading is required'),
    description: Yup.string().required('Description is required'),
    booleanArr: Yup.array().min(1, 'At least one boolean value is required'),
  });


    const toggle = () => {
      onClose({show: false, data: {}});
    };

  const onTransfer = (values) => {
    const dataToPost = {
      ...values,
      icon: uploadedFile[0]?.url
    }
    onSubmit(dataToPost);
  }

  const handleAcceptedFiles = async files => {
    if (!files.length) return;
    const fd = new FormData();
    const docType = 'documents';
    try {
      files.forEach(item => fd.append(docType, item));
      const response = await axiosMain({
        method: 'post',
        url: '/property/file.upload',
        data: fd,
        onUploadProgress: progress => {
          const { total, loaded } = progress;
          const totalSizeInMB = total / 1000000;
          const loadedSizeInMB = loaded / 1000000;
          const uploadPercentage = Math.floor((loadedSizeInMB / totalSizeInMB) * 100);
          setUploading(uploadPercentage);
        },
      });
      setUploadedFile(response.data?.data?.[docType]);
    } catch (err) {
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };

  const handlePaymentType = (e, setFieldValue) => {
    const updatedArr = e.target.checked ? [e.target.name] : [];
    setFieldValue('booleanArr', updatedArr);
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>Payment Method</ModalHeader>
        <ModalBody>
          <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => onTransfer(values)}
            className="form-horizontal"
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>              
                <FormGroup>
                  <Label>Name</Label>
                  <Field
                    type="text"             
                    name="name"
                    className="form-control w-100"
                    value={values?.name}
                    handleChange={handleChange}
                    disabled={modalType === 'view'}
                  />
                   <ErrorMessage name="name" component="div" className="text-danger" />
                </FormGroup>
                <FormGroup>
                  <Label>Sub Heading</Label>
                  <Field
                    type="text"
                    name="subHeading"                    
                    className="form-control w-100"
                    value={values?.subHeading}
                    handleChange={handleChange}
                    disabled={modalType === 'view'}
                  />
                   <ErrorMessage name="subHeading" component="div" className="text-danger" />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Field
                    type="text"
                    name="description"                
                    className="form-control w-100"
                    value={values?.description}
                    handleChange={handleChange}
                    disabled={modalType === 'view'}
                  />
                   <ErrorMessage name="description" component="div" className="text-danger" />
                </FormGroup>
                <FormGroup inline name="booleanArr">
                  <label>
                    <Field
                      type="checkbox"
                      name="canWithdraw"
                      disabled={modalType === 'view'}
                      checked={values.booleanArr.includes('canWithdraw')}
                      onChange={(e)=>handlePaymentType(e,setFieldValue)}
                    />
                    Can Withdraw
                  </label>
                  <label>
                    <Field
                      type="checkbox"
                      name="canDeposit"
                      disabled={modalType === 'view'}
                      checked={values.booleanArr.includes('canDeposit')}
                      onChange={(e)=>handlePaymentType(e,setFieldValue)}

                    />
                    Can Deposit
                  </label>
                  <label>
                    <Field
                      type="checkbox"
                      name="isHidden"
                      disabled={modalType === 'view'}
                      checked={values.booleanArr.includes('isHidden')}
                      onChange={(e)=>handlePaymentType(e,setFieldValue)}

                    />
                    Hide
                  </label>
                  <ErrorMessage name="booleanArr" component="div" className="text-danger" />
                </FormGroup>

                {modalType !== 'create' && !uploadedFile?.length && data?.icon && (
                  <img className="mt20" src={data?.icon} height="50" alt={data?.name} />
                )}

                {uploadedFile?.length && uploadedFile[0]?.contentType.includes('image') && (
                  <img
                    className="mt20"
                    src={uploadedFile[0]?.url}
                    height="100"
                    alt={uploadedFile[0]?.key}
                  />
                )}

                {modalType !== 'view' && (
                  <FormGroup>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                      accept=".svg,.jpeg,.jpg,.png"
                      multiple={false}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="needsclick" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <h6>
                            <i className="display-6 text-muted uil uil-cloud-upload" /> Choose Icons
                            File or Drop
                          </h6>
                          <p>.svg, .png, .jpg and .jpeg format supported</p>
                        </div>
                      )}
                    </Dropzone>
                  </FormGroup>
                )}
                <FormGroup className="tac mt20">
                  {modalType !== 'view' && (
                    <Button
                      disabled={
                        commonData?.updatePaymentMethod?.isLoading ||
                        commonData?.createPaymentMethod?.isLoading
                      }
                      color="primary w-50 mx-auto button-color"
                      type="submit"
                    >
                      {modalType === 'create' ? 'Submit' : 'Update'}
                    </Button>
                  )}
                  {modalType === 'view' && (
                    <Button
                      color="primary w-50 mx-auto button-color"
                      onClick={() => setModalType('edit')}
                      type="button"
                    >
                      Edit
                    </Button>
                  )}
                </FormGroup>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AddPaymentMethods;
