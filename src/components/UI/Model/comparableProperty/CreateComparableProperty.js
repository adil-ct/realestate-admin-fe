import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import MultiSelectDropdown from 'components/multiSelectDropdown/MultiSelectDropdown';
import { commonSaga } from 'store/actions';

import { removeEmptyFields } from 'utils/helperFunction';

import 'react-datepicker/dist/react-datepicker.css';
import './createComparableProperty.css';

const CreateComparableProperty = ({ isOpen, close, getComparablePropertyList }) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    sqFt: '',
    properties: [],
    monthlyRent: '',
  };

  const { property, createComparableProperty: createProperty } = useSelector(state => state.common);
  const [propertyList, setPropertyList] = useState([]);

  const createComparableProperty = values => {
    const success = () => {
      toast.success(`Comparable property successfully created`);
      close(false);
      getComparablePropertyList();
    };

    const propertyDetail = removeEmptyFields(values);

    dispatch(
      commonSaga({
        endPoint: `marketplace/create-comparable-property`,
        type: 'post',
        stateObj: 'createComparableProperty',
        dataToPost: propertyDetail,
        baseEP: 'MARKETPLACE',
        success,
      }),
    );
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(' Name is required'),
    sqFt: Yup.number().required('Area is required'),
    properties: Yup.array()
      .min(1, 'Select at least one Property')
      .required('Properties are required'),
  });

  useEffect(() => {
    dispatch(
      commonSaga({
        endPoint: `/property/onSaleProperties?limit=100`,
        type: 'get',
        stateObj: 'property',
      }),
    );
  }, []);

  useEffect(() => {
    if (property) setPropertyList(property?.dataObj?.resultData);
  }, [property]);

  return (
    <>
      <div>
        <div>
          <Modal centered isOpen={!!isOpen}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModaldiv">
                Create Comparable Property
              </h5>
              <button
                type="button"
                onClick={() => {
                  close(false);
                }}
                className="close"
                data-dismiss="modal"
                // aria-div="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={values => createComparableProperty(values)}
              >
                {({ values, handleChange, setFieldValue, errors }) => (
                  <>
                    <Form>
                      <div className="row mb-4">
                        <div className="promo_label">Name</div>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="form-control description_box"
                          value={values.name}
                          onChange={handleChange}
                        />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                      </div>

                      <div className="row mb-4">
                        <div className="col-lg-6">
                          <div className="promo_label">Area (Square Feeet)</div>
                          <Field
                            type="number"
                            id="sqFt"
                            name="sqFt"
                            className="form-control"
                            value={values.sqFt}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <ErrorMessage name="sqFt" component="div" className="text-danger" />
                        </div>

                        <div className="col-lg-6">
                          <div className="property_label">Monthly Rent</div>
                          <Field
                            type="number"
                            id="monthlyRent"
                            name="monthlyRent"
                            className="form-control description_box"
                            value={values.monthlyRent}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="promo_label">Properties</div>
                        <MultiSelectDropdown
                          options={propertyList}
                          selectedValues={values?.properties}
                          placeholder="Select Properties"
                          setFieldValue={setFieldValue}
                          disabled={property?.isLoading}
                          errors={errors?.properties}
                          fieldName="properties"
                        />
                      </div>

                      <Button
                        className="button-color create_promo_btn"
                        type="submit"
                        disabled={createProperty?.isLoading}
                      >
                        {createProperty?.isLoading ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          'Create Property'
                        )}
                      </Button>
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

export default CreateComparableProperty;
