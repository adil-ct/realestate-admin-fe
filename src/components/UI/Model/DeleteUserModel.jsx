import React from 'react';
import { Modal, ModalHeader, ModalBody, Button, Label } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';


const DeleteUserModel = ({ isOpen, onClose, onSubmit}) => {

  const toggle = () => {
    onClose(prev=>!prev);
  };
  
  const initialValues = {
    reason: '',
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required('This field is required'),
  });

  const onDelete = (values) => {  
    onSubmit(values);
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Delete User
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => onDelete(values)}
            className="form-horizontal"
          >
            {({ values, handleChange }) => (
              <Form>
                <div className="mb-3">
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    Reason For delete
                  </Label>
                  <Field
                    name="reason"
                    value={values.reason}
                    className="form-control h-25"
                    type="textarea"
                    as="textarea"
                    onChange={handleChange}
                  />
                  <ErrorMessage name="reason" component="div" className="text-danger" />
                </div>
                <div className="tac mt20">
                  <Button type="submit" color="primary w-50 mx-auto button-color">
                    Delete User
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DeleteUserModel;
