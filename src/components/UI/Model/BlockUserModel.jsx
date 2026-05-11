import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button, Label } from 'reactstrap';
import * as Yup from 'yup';

import { commonSaga } from 'store/actions';

const BlockUserModel = ({user, userState}) => {
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));
  const [modalBlackList, setBlackList] = useState(false);

  const initialValues = {
    reason: '',
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required('This field is required'),
  });

  const togBlackList = () => {
    setBlackList(!modalBlackList);
  };

  const onBlock = values => {
    const dataToPost = {
      id: user,
      blockStatus: userState,
      blockReason: values.reason,
    };
    dispatch(
      commonSaga({
        endPoint: '/propertyManager/block',
        type: 'post',
        stateObj: 'blockPM',
        dataToPost,
        msg: `${userState ? 'Blocked' : 'Whitelisted'} Successfully!`,
        showAlert: true,
      }),
    );
  };

  useEffect(() => {
    if(commonData?.blockPM?.dataSaved) {
      setBlackList(false);
    }
  }, [commonData?.blockPM]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          togBlackList();
        }}
        className=""
        style={{ border: 'none', background: 'none' }}
        data-toggle="modal"
        data-target="#myModal"
      >
        {userState ? (
          <i className="fas fa-user-slash mx-1" />
        ) : (
          <i className="fas fa-user-check mx-1" />
        )}
      </button>
      <Modal isOpen={modalBlackList} toggle={togBlackList} centered>
        <ModalHeader className="mx-auto" toggle={togBlackList}>
          {userState ? 'Block' : 'Whitelist'} User
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => onBlock(values)}
            className="form-horizontal"
          >
            {({ values, handleChange }) => (
              <Form>
                <div className="mb-3">
                  <Label
                    for="horizontal-firstname-Input"
                    className="col-sm-6 col-form-Label d-block"
                  >
                    {`Reason For ${userState ? 'Block' : 'whitelist'}`}
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
                    {userState ? 'Block' : 'Whitelist'} User
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

export default BlockUserModel;
