import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Col, Label, Modal, Row } from 'reactstrap';
import * as Yup from 'yup';

const AddStepModal = ({ close, handleSubmit, model }) => {
   
  const initialValues = {
  name: model?.name || '',
  description: model?.description || '',
  date: model?.date || ''
  }
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required').nullable(),
  });

  return(
  <div>
    <Modal isOpen centered style={{ maxWidth: '600px' }}>
      <div className="modal-header">
        <div className="d-flex justify-content-left">
          <h5 className="modal-title mt-0" id="myModalLabel">
            Add Step
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
        onSubmit={values => handleSubmit(values)}
        className="form-horizontal"
      >
        {({ values, handleChange }) => (
          <Form>
            <div className="modal-body">
              <Row>
                <Col lg="6" className="px-3 py-2 ">
                  <Label>Enter step name</Label>
                  <Field
                    name="name"
                    type="text"                    
                    className="form-control"
                    id="basicpill-pancard-input5"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Col>
                <Col lg="6" className="px-3 py-2 ">
                  <Label>Enter date</Label>
                  <Field
                    name="date"
                    type="date"                    
                    className="form-control"
                    id="basicpill-pancard-input5"
                    value={values.date}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="date" component="div" className="text-danger" />
                </Col>
                <Col lg="12" className="px-3 py-2 mt-2">
                  <Label>Enter step description</Label>
                  <Field
                    name="description"
                    type="textarea"                   
                    className="form-control"
                    id="basicpill-pancard-input5"
                    value={values.description}
                    onChange={handleChange}
                    rows={5}
                  />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </Col>
              </Row>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"                
                className="btn btn-primary waves-effect dropdownColor w-50"
                data-dismiss="modal"
              >
                {model ? 'Update Step' : 'Add Step'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  </div>
)};

export default AddStepModal;
