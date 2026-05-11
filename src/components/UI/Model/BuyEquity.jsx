import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, Button, FormGroup, Label } from 'reactstrap';
import * as Yup from 'yup';

import { buyEquity } from 'store/actions';

const BuyEquityModal = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    paymentId: '',
  };

  const validationSchema = Yup.object({
    paymentId: Yup.number().required('Payment ID is required'),
  });

  const toggle = () => {
    onClose(false);
  };

  const buySuccess = () => {
    toggle();
    navigate('/published-properties', {state: 'OnSale' });
    toast.success('Investment Successful');
  };

  const onSubmit = values => {
    dispatch(buyEquity({ data: { propertyId: data._id, ...values }, success: buySuccess }));
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Buy Equity
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => onSubmit(values)}
            className="form-horizontal"
          >
            {({ values, handleChange }) => (
              <Form>
                <FormGroup>
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    Payment ID
                  </Label>
                  <Field
                    name="paymentId"
                    type="number"
                    className="form-control"
                    onChange={handleChange}
                    value={values.paymentId}
                    placeholder="Enter Payment ID"
                  />
                  <ErrorMessage name="paymentId" component="div" className="text-danger" />
                </FormGroup>
                <FormGroup className="tac mt20">
                  <Button color="primary w-50 mx-auto button-color" type="submit">
                    Submit
                  </Button>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default BuyEquityModal;
