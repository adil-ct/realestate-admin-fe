import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import { parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Breadcrumb from 'components/BreadCrumb';
import { commonSaga } from 'store/actions';
import MultiSelectDropdown from 'components/multiSelectDropdown/MultiSelectDropdown';
import Loader from 'components/UI/Spinner/Spinner';

import './comparableProperty.css';
import 'react-datepicker/dist/react-datepicker.css';
import { removeEmptyFields } from 'utils/helperFunction';

const ViewComparableProperty = () => {
  const dispatch = useDispatch();
  const { propertyId, action } = useParams();

  const isDisabled = action === 'view';
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const { property, propertyDetails, updateProperty } = useSelector(state => state.common);

  const initialValues = {
    name: propertyDetails?.dataObj?.name || '',
    baths: propertyDetails?.dataObj?.baths || '',
    beds: propertyDetails?.dataObj?.beds || '',
    sqFt: propertyDetails?.dataObj?.sqFt || '',
    priceSold: propertyDetails?.dataObj?.priceSold || '',
    dateSold: propertyDetails?.dataObj?.dateSold
      ? parseISO(propertyDetails?.dataObj?.dateSold)
      : '',
    properties: propertyDetails?.dataObj?.properties || [],
    monthlyRent: propertyDetails?.dataObj?.monthlyRent || '',
    isLease: propertyDetails?.dataObj?.isLease || false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(' Name is required'),
    baths: Yup.number().required('Baths is required'),
    beds: Yup.number().required('Beds is required'),
    sqFt: Yup.number().required('Area is required'),
    properties: Yup.array()
      .min(1, 'Select at least one Property')
      .required('Properties are required'),
  });

  const getPropertyDetails = () => {
    dispatch(
      commonSaga({
        endPoint: `marketplace/comparable-properties/${propertyId}`,
        type: 'get',
        stateObj: 'propertyDetails',
        baseEP: 'MARKETPLACE',
      }),
    );
  };

  const handleUpdateProperty = values => {
    const success = () => {
      toast.success(`${values?.name} successfully updated`);
    };

    const propertyDetail = removeEmptyFields(values);
    dispatch(
      commonSaga({
        endPoint: `marketplace/update-comparable-property/${propertyId}`,
        type: 'put',
        stateObj: 'updateProperty',
        dataToPost: propertyDetail,
        baseEP: 'MARKETPLACE',
        success,
      }),
    );
  };

  useEffect(() => {
    if (property) setPropertyList(property?.dataObj?.resultData);
  }, [property]);

  useEffect(() => {
    setBreadcrumb([
      {
        name: 'Comparable Property',
        link: '/comparable-property',
      },
      { name: 'Comparable Property Details' },
    ]);

    getPropertyDetails();

    dispatch(
      commonSaga({
        endPoint: `/property/onSaleProperties?limit=100`,
        type: 'get',
        stateObj: 'property',
      }),
    );
  }, [propertyId]);

  return (
    <div className="page-content">
      <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize>
        {({ values, handleChange, setFieldValue, dirty, errors, isValid }) => (
          <>
            <div className="ps-2 d-flex justify-content-between">
              <Breadcrumb items={breadcrumb} />
              {dirty && (
                <Button
                  className="button-color save-btn"
                  onClick={() => handleUpdateProperty(values)}
                  disabled={!isValid || updateProperty?.isLoading}
                >
                  Save Changes
                </Button>
              )}
            </div>
            <div className="property_details">
              {propertyDetails?.isLoading ? (
                <Loader />
              ) : (
                <Form>
                  <div className="row mb-4">
                    <div className="property_label">Name</div>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control description_box"
                      value={values.name}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>

                  <div className="row mb-4">
                    <div className="col-lg-6">
                      <div className="property_label">Area (Square Feet)</div>
                      <Field
                        type="number"
                        id="sqFt"
                        name="sqFt"
                        className="form-control"
                        value={values.sqFt}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={isDisabled}
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
                        disabled={isDisabled}
                      />
                      <ErrorMessage name="monthlyRent" component="div" className="text-danger" />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="property_label">Properties</div>
                    <MultiSelectDropdown
                      options={propertyList}
                      selectedValues={values?.properties}
                      placeholder="Select Properties"
                      setFieldValue={setFieldValue}
                      disabled={property?.isLoading || isDisabled}
                      errors={errors?.properties}
                      fieldName="properties"
                    />
                  </div>
                </Form>
              )}
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default ViewComparableProperty;
