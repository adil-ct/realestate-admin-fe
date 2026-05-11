import React from 'react';
import { Col, Label, Modal, Row } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const AddChartData = ({ close, handleSubmit, model }) => {
  const initialValues = {
    year: '',
    rent: '',
    appreciation: '',
  };

  const validationSchema = Yup.object({
    year: Yup.number().required('Year is required'),
    rent: Yup.number().typeError('Rent must be a number').required('Rent is required'),
    appreciation: Yup.number()
      .typeError('Appreciation must be a number')
      .required('Appreciation is required'),
  });

  const addData = values => {
    const stringValues = {};
    Object.keys(values).forEach(key => {
      if (values[key])  
      stringValues[key] = String(values[key]);
    });
    handleSubmit(stringValues);
  };

  return (

    <div>
      <Modal isOpen centered>
        <div className="modal-header">
          <div className="d-flex justify-content-left">
            <h5 className="modal-title mt-0" id="myModalLabel">
              Add Chart Data
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => addData(values)}
          className="form-horizontal"
        >
          {({ values, handleChange }) => (
            <Form>
              <div className="modal-body">
                <Row>
                  <Col lg="6">
                    <Label
                      for="horizontal-firstname-Input"
                      className="col-sm-6 col-form-Label d-block"
                    >
                      Enter year
                    </Label>
                    <Field
                      name="year"
                      type="number"
                      className="form-control"
                      id="basicpill-pancard-input5"
                      onChange={handleChange}
                      value={values.year}
                    />
                    <ErrorMessage name="year" component="div" className="text-danger" />
                  </Col>
                  <Col lg="6">
                    <Label
                      for="horizontal-firstname-Input"
                      className="col-sm-6 col-form-Label d-block w-100"
                    >
                      Enter rent amount($)
                    </Label>
                    <Field
                      name="rent"
                      type="number"
                      className="form-control"
                      id="basicpill-pancard-input5"
                      onChange={handleChange}
                      value={values.rent}
                    />
                    <ErrorMessage name="rent" component="div" className="text-danger" />
                  </Col>
                  <Col lg="6" className="mt-2">
                    <Label
                      for="horizontal-firstname-Input"
                      className="col-sm-6 col-form-Label d-block w-100"
                    >
                      Enter appreciation($)
                    </Label>
                    <Field
                      name="appreciation"
                      type="number"
                      className="form-control"
                      id="basicpill-pancard-input5"
                      onChange={handleChange}
                      value={values.appreciation}
                    />
                  </Col>
                  <ErrorMessage name="appreciation" component="div" className="text-danger" />
                </Row>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary waves-effect dropdownColor w-50"
                  data-dismiss="modal"
                >
                  {model ? 'Update' : 'Add'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AddChartData;
