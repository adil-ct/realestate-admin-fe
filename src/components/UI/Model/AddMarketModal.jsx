import React from 'react';
import { Col, Modal, Row, Spinner, Label } from 'reactstrap';
import { useSelector } from 'react-redux';
import JoditEditor from 'jodit-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import 'jodit';

import { editorConfig } from 'constants/EditorConfig';

import 'jodit/build/jodit.min.css';

const AddMarketModal = ({ close, addMarket }) => {
  const { createLoader } = useSelector(state => state.market);

  const initialValues = {
    marketName: '',
    state: '',
    city: '',
    propertyGrowth: '',
    rentGrowth: '',
    marketRating: '',
    description: '',
    marketChart: [],
  };

  const validationSchema = Yup.object().shape({
    marketName: Yup.string().required('Market Name is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    propertyGrowth: Yup.number()
      .typeError('Property Growth must be a number')
      .required('Property Growth is required'),
    rentGrowth: Yup.number()
      .typeError('Rent Growth must be a number')
      .required('Rent Growth is required'),
    marketRating: Yup.string().required('Market Rating is required'),
    description: Yup.string().required('Description is required'),
  });

  const addMarketFun = value => {
    addMarket(value);
  };

  return (
    <div>
      <Modal isOpen centered style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <div className="d-flex justify-content-left">
            <h5 className="modal-title mt-0" id="myModalLabel">
              Add Market
            </h5>
          </div>
          <button
            type="button"
            onClick={close}
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
            onSubmit={values => addMarketFun(values)}
            enableReinitialize
          >
            {({ values, handleChange, setFieldValue }) => (
              <>
                <Form>
                  <Row>
                    <Col lg="6" className="px-3 py-2 ">
                      <Label>Name</Label>
                      <Field
                        type="text"
                        name="marketName"
                        className="form-control"
                        value={values.marketName}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="marketName" component="div" className="text-danger" />
                    </Col>

                    <Col lg="6" className="px-3 py-2 ">
                      <Label>State</Label>
                      <Field
                        type="text"
                        name="state"
                        className="form-control"
                        value={values.state}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="state" component="div" className="text-danger" />
                    </Col>

                    <Col lg="6" className="px-3 py-2 ">
                      <Label>City</Label>
                      <Field
                        type="text"
                        name="city"
                        className="form-control"
                        value={values.city}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="city" component="div" className="text-danger" />
                    </Col>

                    <Col lg="6" className="px-3 py-2 ">
                      <Label>Property Growth(%)</Label>
                      <Field
                        type="text"
                        name="propertyGrowth"
                        className="form-control"
                        value={values.propertyGrowth}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="propertyGrowth" component="div" className="text-danger" />
                    </Col>

                    <Col lg="6" className="px-3 py-2 ">
                      <Label>Rent Growth(%)</Label>
                      <Field
                        type="text"
                        name="rentGrowth"
                        className="form-control"
                        value={values.rentGrowth}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="rentGrowth" component="div" className="text-danger" />
                    </Col>

                    <Col lg="6" className="px-3 py-2 ">
                      <Label>Market rating</Label>
                      <Field
                        type="text"
                        name="marketRating"
                        className="form-control"
                        value={values.marketRating}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="marketRating" component="div" className="text-danger" />
                    </Col>
                    
                    <Col lg="12" className="px-3 py-2 ">
                      <Label>Description</Label>
                      <JoditEditor
                        value={values.description}
                        config={editorConfig}
                        onChange={value => {
                          setFieldValue('description', value);
                        }}
                      />
                      <ErrorMessage name="description" component="div" className="text-danger" />
                    </Col>
                  </Row>
                  <div className="modal-footer d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary waves-effect dropdownColor w-50"
                      data-dismiss="modal"
                    >
                      {createLoader ? <Spinner size="sm" /> : 'Add Market'}
                    </button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default AddMarketModal;
