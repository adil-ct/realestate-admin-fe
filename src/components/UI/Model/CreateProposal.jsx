import React, { useEffect, useState } from 'react';
import { Col, Label, Modal, Row, Spinner } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { parseISO } from 'date-fns' 
import moment from 'moment';
import * as Yup from 'yup';

import { editorConfig } from 'constants/EditorConfig';
import { proposalMain } from 'http/axios/axios_main';
import { commonSaga } from 'store/actions';
import PDF from 'assets/images/PDF.png';
import DOC from 'assets/images/DOC.png';
import DropDownMenu from 'components/Dropdowncomponent/DropDownMenu';

import 'react-datepicker/dist/react-datepicker.css';
import '../../propertyManagement/propertymanagement.css';
import 'react-phone-input-2/lib/style.css';

const CreateProposal = ({ isOpen, close, edit, refresh }) => {
  const documentImage = { pdf: PDF, msword: DOC };
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));
  const [selectedFiles, setselectedFiles] = useState(edit ? edit?.documents : []);

  const handleDelete = () => {
    setselectedFiles([]);
  };

  const initialValues = {
    title: edit?.preLinkTitle || '',
    votingStartDate: edit?.votingStartDate ?  parseISO(edit?.votingStartDate) : '',
    votingEndDate: edit?.votingStartDate ?  parseISO(edit?.votingStartDate) : '',
    summary: edit?.summary || '',
    votingOption1: edit?.voteOptions[0]?.label || '',
    votingOption2:  edit?.voteOptions[1]?.label || '',
    description: edit?.description || '',
    documents: edit?.documents || '',
    propertyId: edit?.propertyId?._id || '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    votingStartDate: Yup.date().required('Voting start date is required'),
    votingEndDate: Yup.date().required('Voting end date is required'),
    summary: Yup.string().required('Summary is required'),
    votingOption1: Yup.string().required('Voting option 1 is required'),
    votingOption2: Yup.string().required('Voting option 2 is required'),
    description: Yup.string().required('Description is required'),
    documents: Yup.string().required('Attachment is required'),
    propertyId: Yup.string().required('Property ID is required'),
  });

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  };
  const getList = () => {
    dispatch(
      commonSaga({
        endPoint: `/property/property-list/proposals?status=completed`,
        type: 'get',
        stateObj: 'propertyListingForDropdown',
      }),
    );
  };

  useEffect(() => {
    getList();
  }, []);

  const handleAcceptedFiles = async files => {
    const fd = new FormData();
    Object.entries(files).forEach(([, value]) => {
      fd.append('documents', value);
    });
    try {
      const authToken = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await proposalMain({
        method: 'post',
        url: '/proposals/file.upload',
        data: fd,
        ...config,
      });
      return response.data?.data?.documents;
    } catch (err) {
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
    return false;
  };

  const submit = async v => {
    setLoading(true);

    const success = () => {
      setLoading(false);
      close(false);
      refresh(true);
    };

    let url = selectedFiles.length > 0 ? selectedFiles : [];

    if (v?.documents?.length) {
      url = await handleAcceptedFiles(v?.documents);
    }

    if (edit) {
      const values = {
        title: v.title,
        votingStartDate: moment(new Date(v.votingStartDate)).format('L'),
        votingEndDate: moment(new Date(v.votingEndDate)).format('L'),
        summary: v.summary,
        voteOptions: [{ label: v.votingOption1 }, { label: v.votingOption2 }],
        description: v.description,
        documents: url,
        propertyId: v.propertyId,
      };

      dispatch(
        commonSaga({
          endPoint: `/proposals/updateProposal/${edit._id}`,
          type: 'patch',
          stateObj: 'updateProposal',
          dataToPost: values,
          baseEP: 'INVESTOR',
          success,
          msg: 'Proposal Updated Successfully!',
          showAlert: true,
        }),
      );
      setLoading(false);
      return;
    }
    const values = {
      title: v.title,
      votingStartDate: moment(new Date(v.votingStartDate)).format('L'),
      votingEndDate: moment(new Date(v.votingEndDate)).format('L'),
      summary: v.summary,
      voteOptions: [{ label: v.votingOption1 }, { label: v.votingOption2 }],
      description: v.description,
      documents: url,
      propertyId: v.propertyId,
    };
    dispatch(
      commonSaga({
        endPoint: '/proposals/createProposal',
        type: 'post',
        stateObj: 'createProposal',
        dataToPost: values,
        baseEP: 'INVESTOR',
        success,
        msg: 'Proposal Added Successfully!',
        showAlert: true,
      }),
    );
    setLoading(false);
  };

  return (
    <>
      <div>
        <div>
          <Modal centered isOpen={!!isOpen}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                {isOpen === 'view' ? 'View' : isOpen === 'edit' ? 'Edit' : 'Create'} Proposal
              </h5>
              <button
                type="button"
                onClick={() => {
                  close(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={values => submit(values)}
              >
                {({ values, handleChange, setFieldValue, errors }) => (
                  <>              
                    <Form>
                      <div className="row mb-4">
                        <Label for="horizontal-firstname-Input" className=" col-form-Label">
                          Title
                        </Label>
                        <Col sm={12}>
                          <Field
                            type="text"
                            className="form-control"
                            id="horizontal-firstnamele"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="title" component="div" className="text-danger" />
                        </Col>
                      </div>
                      <Row>
                        <Col sm={6}>
                          <div className="mb-4 ">
                            <Label for="horizontal-email-Input" className=" col-form-Label">
                              Voting Start Date
                            </Label>
                            <DatePicker
                              id="votingStartDate"
                              name="votingStartDate"
                              selected={values.votingStartDate}
                              onChange={date => setFieldValue('votingStartDate', date)}
                              className="form-control"
                              dateFormat="dd-MM-yyyy"
                              minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                            />
                            <ErrorMessage
                              name="votingStartDate"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-4">
                            <Label for="horizontal-email-Input" className=" col-form-Label">
                              Voting End Date
                            </Label>
                            <DatePicker
                              id="votingEndDate"
                              name="votingEndDate"
                              selected={values.votingEndDate}
                              onChange={date => setFieldValue('votingEndDate', date)}
                              className="form-control"
                              dateFormat="dd-MM-yyyy"
                              minDate={
                                values.votingStartDate
                                  ? new Date(
                                      new Date(values.votingStartDate).setDate(
                                        new Date(values.votingStartDate).getDate() + 1,
                                      ),
                                    )
                                  : new Date()
                              }
                            />
                             <ErrorMessage
                              name="votingEndDate"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="row mb-4">
                        <Label for="horizontal-firstname-Input" className=" col-form-Label">
                          Voting option 1 (For the proposal)
                        </Label>
                        <Col sm={12}>
                          <Field
                            type="text"
                            id="horizontal-firstname-Input"
                            name="votingOption1"
                            className="form-control"
                            value={values.votingOption1}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="votingOption1" component="div" className="text-danger" />
                        </Col>
                      </div>
                      <div className="row mb-4">
                        <Label for="horizontal-firstname-Input" className=" col-form-Label">
                          Voting option 2 (Against the proposal)
                        </Label>
                        <Col sm={12}>
                          <Field
                            type="text"
                            id="horizontal-firstname-Input"
                            name="votingOption2"
                            className="form-control"
                            value={values.votingOption2}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="votingOption2" component="div" className="text-danger" />
                        </Col>
                      </div>
                      <div className="col-sm-auto mb-4">
                        <label className="" htmlFor="autoSizingSelect">
                          Select Property
                        </label>
                        <DropDownMenu
                          options={commonData?.propertyListingForDropdown?.dataObj}
                          setFieldValue={setFieldValue}
                          className="description_box"
                          errors={errors?.propertyId}
                          selectedValues={values?.propertyId}
                          disabled={commonData?.propertyListingForDropdown?.isLoading}
                        />
                      </div>
                      <div className="row mb-4">
                        <Label for="horizontal-firstname-Input" className=" col-form-Label">
                          Summary
                        </Label>
                        <Col sm={12}>
                          <Field
                            as="textarea"
                            id="horizontal-firstname-Input"
                            name="summary"
                            className="form-control"
                            value={values.summary}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="summary" component="div" className="text-danger" />
                        </Col>
                      </div>
                      <div className="row mb-4">
                        <Label for="horizontal-firstname-Input" className=" col-form-Label">
                          Description
                        </Label>
                        <JoditEditor                        
                          config={editorConfig}
                          value={values.description}                          
                          onChange={(value) => setFieldValue('description',value)}
                        />
                        <ErrorMessage name="description" component="div" className="error" />
                      </div>
                      <div className="row ">
                        <Label for="horizontal-firstname-Input" className=" col-form-Label">
                          Attachment: Supported File Type - Doc , Pdf , Media
                        </Label>
                        <Col sm={12}>
                          {selectedFiles?.length === 0 && (
                            <>
                              <Field
                                type="file"
                                name="documents"
                                className="form-control"
                                multiple="multiple"
                                accept=".doc,.docx,.pdf,audio/*,video/*,image/*"
                                onChange={handleChange}                               
                              />
                            </>
                          )}                       
                          {selectedFiles?.length > 0 &&
                            selectedFiles.map(item => (
                              <>
                                {item?.contentType?.includes('video') &&
                                  Object.keys(item)?.length > 1 && (
                                    <div key={item?.key} className="image-container">
                                      <video width="350" height="240" controls>
                                        <source src={item?.url} type="video/mp4" />
                                        <track
                                          src="captions_en.vtt"
                                          kind="captions"
                                          srcLang="en"
                                          label="english_captions"
                                        />
                                      </video>
                                      <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => handleDelete()}
                                      >
                                        <i className="fa fa-trash mx-2" role="button" />
                                      </button>
                                    </div>
                                  )}
                                {item?.contentType === 'application/pdf' && (
                                  <Row className="document-container p-1 w-100" key={item.key}>
                                    <Col lg={3}>
                                      <a
                                        href={item.url || item.location}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={documentImage[item.contentType.split('/').pop()]}
                                          alt={item.key}
                                          height="50"
                                          width="50"
                                        />
                                      </a>
                                    </Col>
                                    <Col lg={4} className="text-break">
                                      {item.key}
                                    </Col>
                                    <Col>{formatBytes(item.sizeInMegaByte || item.size)}</Col>

                                    <Col>
                                      <div className="cross" onClick={() => handleDelete()}>
                                        X
                                      </div>
                                    </Col>
                                  </Row>
                                )}
                                {item?.contentType?.includes('image') && (
                                  <div key={item.key} className="image-container">
                                    <img
                                      src={item.url}
                                      alt={item.key}
                                      className="image-preview"                               
                                    />
                                    <button
                                      type="button"
                                      className="delete-button"
                                      onClick={() => handleDelete()}
                                    >
                                      <i className="fa fa-trash mx-2" role="button" />
                                    </button>
                                  </div>
                                )}
                              </>
                            ))}
                            <ErrorMessage name="documents" component="div" className="error" />
                        </Col>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="submit"
                          className="btn btn-primary waves-effect waves-light w-25"
                        >
                          {loading ? <Spinner size="sm" /> : 'Submit'}
                        </button>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>           
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default CreateProposal;
