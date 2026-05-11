import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Modal, ModalHeader, ModalBody, Button, FormGroup, Spinner, Label, Input } from 'reactstrap';
import * as Yup from 'yup';

import { commonSaga } from 'store/actions';

const TransferFinancials = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  
  const validationSchema = Yup.object().shape({   
    amount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Amount is required'),
  });

  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  useEffect(() => {
    if (commonData?.createPropertyTransferState?.dataObj?.code === 200) {
      onClose(false);
    }
  }, [commonData?.createPropertyTransferState?.dataObj]);

  const toggle = () => {
    onClose(false);
  };

  const onTransfer = (values) => {    
      const adminId = localStorage.getItem('userId');
      dispatch(
        commonSaga({
          endPoint: `/payment/create-propertyTransfer`,
          type: 'post',
          stateObj: 'createPropertyTransferState',
          dataToPost: {
            destinationId: data?.flag === 'deposit' ? data?.walletAddress : adminId,
            sourceId: data?.flag === 'deposit' ? adminId : data?.walletAddress,
            amount: Number(values?.amount),
          },
          msg: 'Transfer Done Successfully!',
          showAlert: true,
          baseEP: 'PAYMENT',
        }),
      );    
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Transfer
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              amount: '',
            }}
            validationSchema={validationSchema} 
            onSubmit={values => onTransfer(values)} 
          >
            {({ values, handleChange }) => (
              <Form >
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    type="text"
                    name="amount"
                    id="amount"
                    placeholder="Enter Amount"
                    onChange={handleChange}
                    value={values.amount}
                    className='form-control'
                  />
                  <ErrorMessage name="amount" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="tac mt20">
                  <Button
                    disabled={commonData?.createPropertyTransferState?.isLoading}
                    color="primary w-50 mx-auto button-color"
                    type="submit"
                  >
                    {commonData?.createPropertyTransferState?.isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      'Submit'
                    )}
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

export default TransferFinancials;
