import React from 'react';
import { Col, Label, Modal, Row } from 'reactstrap';
import { Field, Form, Formik } from 'formik';

export const AddVariable = ({ close, handleSubmit }) => {
  const initialValues = {
    name: '',
    value: '',
    applicable: '',
  };

  return (
    <Modal isOpen centered style={{ maxWidth: '600px' }}>
      <div className="modal-header">
        <div className="d-flex justify-content-left">
          <h5 className="modal-title mt-0" id="myModalLabel">
            Add Variable
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
        enableReinitialize
        onSubmit={values => {
          handleSubmit(values);
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <div className="modal-body">
              <Row>
                <Col lg="6" className="px-3 py-2 ">
                  <Label for="horizontal-firstname-Input" className="col-form-Label">
                    Enter Name
                  </Label>
                  <Field
                    name="name"
                    type="text"
                    label="Enter Name"
                    className="form-control"
                    id="basicpill-pancard-input5"
                    value={values.name}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col lg="6" className="px-3 py-2 ">
                  <Label for="horizontal-firstname-Input" className="col-form-Label">
                    Enter Value
                  </Label>
                  <Field
                    name="value"
                    type="number"
                    label="Enter Value"
                    className="form-control"
                    id="basicpill-pancard-input5"
                    value={values.value}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col lg="6" className="px-3 py-2 mt-2">
                  <Label for="horizontal-firstname-Input" className="col-form-Label">
                    Select Applicable
                  </Label>               
                  <Field
                    as="select"
                    name="applicable"
                    type="select"
                    label="Select Applicable"
                    className="form-control form-select"
                    id="basicpill-pancard-input5"
                    required
                  >
                    <option value="">Select Applicable</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Field>
                </Col>
              </Row>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"              
                className="btn btn-primary waves-effect dropdownColor w-50"
                data-dismiss="modal"
              >
                Add
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
