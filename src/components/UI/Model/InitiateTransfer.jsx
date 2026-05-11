import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Modal, ModalHeader, ModalBody, Button, FormGroup, Label, Input } from 'reactstrap';
import * as Yup from 'yup';

import { getEarlyInvestor, commonSaga } from 'store/actions';

const InitiateTransfer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userList } = useSelector(state => state.user);
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  const initialValues = {
    sourceId: '',
    destinationId: '',
    amount: '',
  };

  const validationSchema = Yup.object().shape({
    sourceId: Yup.string().required('Source is required'),
    destinationId: Yup.string().required('Destination is required'),
    amount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Amount is required'),
  });

  const toggle = () => {
    onClose(false);
  };

  const onTransfer = values => {
    dispatch(
      commonSaga({
        endPoint: `/payment/create-transfer`,
        type: 'post',
        stateObj: 'createTransferState',
        dataToPost: values,
        msg: 'Transfer Done Successfully!',
        showAlert: true,
        baseEP: 'PAYMENT',
      }),
    );
  };

  useEffect(() => {
    dispatch(getEarlyInvestor({ list: 'user/listUsers', field: 'userList' }));
  }, []);

  useEffect(() => {
    if (commonData?.createTransferState?.dataObj?.status === 'pending') {
      onClose(false);
    }
  }, [commonData?.createTransferState?.dataObj]);
  
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Transfer
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema} 
            onSubmit={values => onTransfer(values)}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {userList?.length > 0 && (
                  <FormGroup>
                    <Label for="sourceId">Source</Label>
                    <Input
                      type="select"
                      name="sourceId"
                      id="sourceId"
                      className="form-select"
                      onChange={handleChange}
                      value={values.sourceId}
                    >
                      <option disabled value="">
                        Select Source
                      </option>
                      {userList?.map(option => (
                        <option key={option?._id} value={option?._id}>
                          {option?.firstName} ({option?.email})
                        </option>
                      ))}
                    </Input>
                    <ErrorMessage name="sourceId" component="div" className="text-danger" />
                  </FormGroup>
                )}

                {userList?.length > 0 && (
                  <FormGroup>
                    <Label for="destinationId">Destination</Label>
                    <Input
                      type="select"
                      name="destinationId"
                      id="destinationId"
                      className="form-select"
                      onChange={handleChange}
                      value={values.destinationId}
                    >
                      <option disabled value="">
                        Select Destination
                      </option>
                      {userList?.map(option => (
                        <option key={`dest${option?._id}`} value={option?._id}>
                          {option?.firstName} ({option?.email})
                        </option>
                      ))}
                    </Input>
                    <ErrorMessage name="destinationId" component="div" className="text-danger" />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    type="text"
                    name="amount"
                    id="amount"
                    placeholder="Enter Amount"
                    onChange={handleChange}
                    value={values.amount}
                  />
                  <ErrorMessage name="amount" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="tac mt20">
                  <Button
                    disabled={commonData?.createTransferState?.isLoading}
                    color="primary w-50 mx-auto button-color"
                    type="submit"
                  >
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

export default InitiateTransfer;
