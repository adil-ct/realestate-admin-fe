/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button, FormGroup, Label } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import DatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';
import * as Yup from 'yup';

import ProgressBar from 'components/ProgressBar';
import { axiosMain } from 'http/axios/axios_main';
import { getPropertyList, commonSaga } from 'store/actions';
import RenderIf from 'components/RenderIf';

const AddCashFlowCycle = ({ isOpen, onClose, modalType, setModalType, data }) => {
  const dispatch = useDispatch();
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));
  const { propertyList } = useSelector(state => state.property);
  const [uploading, setUploading] = useState(0);
  const [uploadedFile, setUploadedFile] = useState([]);
 
  const setDefaultDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(5, 30, 0, 0); 
    return nextMonth;
  };

  const initialValues = {
    _property: data?._property || '',
    monthlyRentAmount: data?.monthlyRentAmount || '',
    startDate: data?.startDate ? parseISO(data?.startDate) : setDefaultDate(),
    rentalDuration: data?.rentalDuration || '',
    // currentMaintenanceReserveBalance: data?.currentMaintenanceReserveBalance || '',
    // currentVacancyReserveBalance: data?.currentVacancyReserveBalance || '',
    maxMaintenanceFee: data?.maxMaintenanceFee || '',
    maxVacancyFee: data?.maxVacancyFee || '',
    propertyMgtFee: data?.propertyMgtFee || '',
    rentalDocument: data?.rentalDocuments || '',
  };
 
  
  const validationSchema = Yup.object().shape({
    _property: Yup.string().required('Property is required'),
    monthlyRentAmount: Yup.number()
      .required('Monthly rent amount is required')
      .positive('Monthly rent amount must be a positive number'),
    startDate: Yup.date().required('Start date is required'),
    rentalDuration: Yup.number()
      .required('Rental duration is required')
      .integer('Rental duration must be a whole number'),
    // currentMaintenanceReserveBalance: Yup.number()
    //   .required('Current maintenance reserve balance is required')
    //   .min(0, 'Balance must be a non-negative number'),
    // currentVacancyReserveBalance: Yup.number()
    //   .required('Current vacancy reserve balance is required')
    //   .min(0, 'Balance must be a non-negative number'),
    maxMaintenanceFee: Yup.number()
      .required('Max maintenance fee is required')
      .min(0, 'Fee must be a non-negative number'),
    maxVacancyFee: Yup.number()
      .required('Max vacancy fee is required')
      .min(0, 'Fee must be a non-negative number'),
    propertyMgtFee: Yup.number()
      .required('Property management fee is required')
      .min(0, 'Fee must be a non-negative number'),
    rentalDocument: Yup.object().required('Rental document is required'),
  });

  useEffect(() => {
    dispatch(getPropertyList('itemsPerPage=100&status=OnSale'));
  }, []);

  const toggle = () => {
    onClose({ show: false, data: {} });
  };

  const onTransfer = values => {
    const alterObj = {
      ...values,
      propertyMgtFee: {
        value: values?.propertyMgtFee,
        isEnabled: true,
      },
      startDate: new Date(values?.startDate).toISOString(),
      rentalDocument: uploadedFile[0],
    };
 
    if (modalType === 'create') {
      dispatch(
        commonSaga({
          endPoint: '/cashflow/rental-period',
          type: 'post',
          stateObj: 'createRental',
          dataToPost: alterObj,
          msg: 'Rental Period Created Successfully!',
          showAlert: true,
        }),
      );
    } else {
      delete alterObj?._property;
      dispatch(
        commonSaga({
          endPoint: `/cashflow/rental-period/${data?._id}`,
          type: 'patch',
          stateObj: 'updateRental',
          dataToPost: alterObj,
          msg: 'Rental Period Updated Successfully!',
          showAlert: true,
        }),
      );
    }
  };

  const handleAcceptedFiles = async (files,setFieldValue) => {
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
      setFieldValue('rentalDocument',response.data?.data?.[docType][0])
    } catch (err) {
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Cashflow Cycle
        </ModalHeader>
        <ModalBody>
          <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={values => onTransfer(values)}
          >
            {({ values, handleChange, setFieldValue }) => (
              <>       
                <Form>
                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Property
                    </Label>
                    <Field
                      as="select"
                      label="Property"
                      type="select"
                      name="_property"
                      className="form-select"
                      disabled={modalType === 'view'}
                    >
                      <option disabled value="">
                        Select Property
                      </option>
                      {propertyList?.map(option => (
                        <option key={option?._id} value={option?._id}>
                          {option?.otherInfo?.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="_property" component="div" className="error" />
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Rent/Month
                    </Label>
                    <Field
                      type="number"
                      id="monthlyRentAmount"
                      name="monthlyRentAmount"
                      className="form-control"
                      value={values.monthlyRentAmount}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="monthlyRentAmount"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Start Date
                    </Label>
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      selected={values.startDate || setDefaultDate()}
                      onChange={date => setFieldValue('startDate', date)}
                      className="form-control w-100"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      disabled={modalType === 'view'}                    
                    />
                    <ErrorMessage name="startDate" component="div" className="text-danger" />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Duration (Months)
                    </Label>
                    <Field
                      type="number"
                      id="rentalDuration"
                      name="rentalDuration"
                      className="form-control"
                      value={values.rentalDuration}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="rentalDuration" component="div" className="text-danger" />
                  </FormGroup>
                  {/* <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Curr. Maintenance Reserve Balance ($)
                    </Label>
                    <Field
                      type="number"
                      id="currentMaintenanceReserveBalance"
                      name="currentMaintenanceReserveBalance"
                      className="form-control"
                      value={values.currentMaintenanceReserveBalance}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="currentMaintenanceReserveBalance"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup> */}
                  {/* <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Curr. Vacancy Reserve Balance ($)
                    </Label>
                    <Field
                      type="number"
                      id="currentVacancyReserveBalance"
                      name="currentVacancyReserveBalance"
                      className="form-control"
                      value={values.currentVacancyReserveBalance}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="currentVacancyReserveBalance"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup> */}
                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Max Maintance Fees
                    </Label>
                    <Field
                      type="number"
                      id="maxMaintenanceFee"
                      name="maxMaintenanceFee"
                      className="form-control"
                      value={values.maxMaintenanceFee}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="maxMaintenanceFee"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Max Vacancy Reserve Fees
                    </Label>
                    <Field
                      type="number"
                      id="maxVacancyFee"
                      name="maxVacancyFee"
                      className="form-control"
                      value={values.maxVacancyFee}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="maxVacancyFee" component="div" className="text-danger" />
                  </FormGroup>
                  <FormGroup className="mb-4">
                    <Label for="horizontal-firstname-Input" className="col-form-Label">
                      Property Management Fees
                    </Label>
                    <Field
                      type="number"
                      id="propertyMgtFee"
                      name="propertyMgtFee"
                      className="form-control"
                      value={values.propertyMgtFee}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={modalType === 'view'}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="propertyMgtFee" component="div" className="text-danger" />
                  </FormGroup>
                  {modalType !== 'create' &&
                    !uploadedFile?.length &&
                    data?.rentalDocuments?.contentType === 'image/jpeg' && (
                      <img
                        className="mt20"
                        src={data?.rentalDocuments?.url}
                        height="100"
                        alt={data?.rentalDocuments?.key}
                      />
                    )}
                  {modalType !== 'create' &&
                    !uploadedFile?.length &&
                    data?.rentalDocuments?.contentType === 'application/pdf' && (
                      <a
                        className="mt20"
                        href={data?.rentalDocuments?.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {data?.rentalDocuments?.key}
                      </a>
                    )}
                  <RenderIf
                    render={uploadedFile?.length && uploadedFile[0]?.contentType === 'image/jpeg'}
                  >
                    <img
                      className="mt20"
                      src={uploadedFile[0]?.url}
                      height="100"
                      alt={uploadedFile[0]?.key}
                    />
                  </RenderIf>

                  <RenderIf
                    render={
                      uploadedFile?.length && uploadedFile[0]?.contentType === 'application/pdf'
                    }
                  >
                    <a
                      className="mt20"
                      href={uploadedFile[0]?.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {uploadedFile[0]?.key}
                    </a>
                  </RenderIf>

                  {modalType !== 'view' && (
                    <FormGroup className="mb-4">
                      <Dropzone
                        onDrop={acceptedFiles => {
                          handleAcceptedFiles(acceptedFiles,setFieldValue);
                        }}
                        accept=".pdf,.jpeg"
                        multiple={false}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div className="needsclick" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <h6>
                              <i className="display-6 text-muted uil uil-cloud-upload" /> Choose
                              File or Drop
                            </h6>
                            <p>.pdf &amp; .JPEG format is supported.</p>
                          </div>
                        )}
                      </Dropzone>
                      <ErrorMessage name="rentalDocument" component="div" className="text-danger" />
                    </FormGroup>
                  )}
                  <FormGroup className="tac mt20">
                    {modalType !== 'view' && (
                      <Button
                        disabled={
                          commonData?.createRental?.isLoading || commonData?.updateRental?.isLoading
                        }
                        color="primary w-50 mx-auto button-color"
                        type="submit"
                      >
                        {modalType === 'create' ? 'Submit' : 'Updatee'}
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
              </>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AddCashFlowCycle;
