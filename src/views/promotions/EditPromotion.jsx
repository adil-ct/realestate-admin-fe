import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Button } from 'reactstrap';
import { parseISO } from 'date-fns' 
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Breadcrumb from 'components/BreadCrumb';
import { getEarlyInvestor, commonSaga } from 'store/actions';
import AddPromoTier from 'components/addPromoTier/AddPromoTier';
import MultiSelectDropdown from 'components/multiSelectDropdown/MultiSelectDropdown';
import SimpleToggleSwitch from 'components/Switch/SimpleToggleSwitch';
import DropDownMenu from 'components/Dropdowncomponent/DropDownMenu';
import Loader from 'components/UI/Spinner/Spinner';

import './editPromotion.css';
import 'react-datepicker/dist/react-datepicker.css';


const EditPromotion = () => {
  const dispatch = useDispatch();
  const { promoCode } = useParams();

  const [breadcrumb, setBreadcrumb] = useState([]);
  const [properties, setProperties] = useState([]);

  const { promoDetails, loading } = useSelector(state => state.user);
  const { property , updatePromo} = useSelector(state => state.common);

  const tier = {
    investAmount: '',
    numGiftTokens: '',
  };

  const initialValues = {
    promoName: promoDetails?.data?.[0]?.promoName || '',
    promoDescription: promoDetails?.data?.[0]?.promoDescription || '',
    promoStateIsOn: promoDetails?.data?.[0]?.promoStateIsOn || false,
    promoStartDate: promoDetails?.data?.[0]?.promoStartDate ? parseISO(promoDetails?.data?.[0]?.promoStartDate) : '',
    promoEndDate: promoDetails?.data?.[0]?.promoEndDate ? parseISO(promoDetails?.data?.[0]?.promoEndDate) : '',
    maxPromoCodeUse: promoDetails?.data?.[0]?.maxPromoCodeUse || 0,
    promoPurchaseProperties: promoDetails?.data?.[0]?.promoPurchaseProperties || [],
    propertyId: promoDetails?.data?.[0]?.promoGiftProperty?.propertyId || '',
    promoTiers: promoDetails?.data?.[0]?.promoGiftProperty?.promoTiers || [tier],
    initialTokensForPromo: promoDetails?.data?.[0]?.promoGiftProperty?.initialTokensForPromo || 0,
    tokensUsedForPromo: promoDetails?.data?.[0]?.promoGiftProperty?.tokensUsedForPromo || 0
  };

  const handleUpdatePromo = (values) => {
    const newTier = values?.promoTiers.map(({ ...rest }) => rest)
    const data = {
      promoCode: promoDetails?.data?.[0]?.promoCode,
      promoDescription: values?.promoDescription,
      promoName: values?.promoName,
      promoStateIsOn: values?.promoStateIsOn,
      promoStartDate: values?.promoStartDate,
      promoEndDate: values?.promoEndDate,
      maxPromoCodeUse: values?.maxPromoCodeUse,
      promoPurchaseProperties: values?.promoPurchaseProperties,
      promoGiftProperty: {
        propertyId: values?.propertyId,
        promoTiers: newTier,
        initialTokensForPromo: values?.initialTokensForPromo,
        tokensUsedForPromo: values?.tokensUsedForPromo,
      },
    };

    const success = () => {
      toast.success(`Promotion ${values?.promoCode} successfully updated`);
    }

    dispatch(
      commonSaga({
        endPoint: `payment/promotion-update`,
        type: 'post',
        stateObj: 'updatePromo',
        dataToPost: data,
        baseEP: 'PAYMENT',
        success
      }),
    );
  };

  const validationSchema = Yup.object().shape({
    promoName: Yup.string().required('Promo Name is required'),
    promoDescription: Yup.string().required('Promo Description is required'),
    promoStateIsOn: Yup.boolean().required('Promo State is required'),
    promoStartDate: Yup.date().required('Promo Start Date is required'),
    promoEndDate: Yup.date().required('Promo End Date is required'),
    maxPromoCodeUse: Yup.number().min(1, 'Max Promo Code Use must be at least 1').required('Max Promo Code Use is required'),
    initialTokensForPromo: Yup.number().required('Property token is required'),
    promoPurchaseProperties: Yup.array()
      .min(1, 'Select at least one Promo Purchase Property')
      .required('Promo Purchase Properties are required'),
    propertyId: Yup.string().required('Property ID is required'),
    promoTiers: Yup.array().of(
      Yup.object().shape({
        investAmount: Yup.number().required('Invest Amount is required'),
        numGiftTokens: Yup.number().required('Number of Gift Tokens is required'),
      })
    ).min(1, 'At least one Promo Tier is required')  
  });

  const getPromoUsers = () => {
    dispatch(
      getEarlyInvestor({
        list: `payment/promotions-admin`,
        field: 'promoDetails',
        query: `promoCode=${promoCode}`,
      }),
    );
  };

  useEffect(() => {
    if (property) setProperties(property?.dataObj?.resultData);
  }, [property]);

  useEffect(() => {
    setBreadcrumb([
      {
        name: 'Promotions',
        link: '/promotions',
      },
      { name: 'Promotion Details' },
    ]);

    getPromoUsers();

    dispatch(
      commonSaga({
        endPoint: `/property/onSaleProperties?limit=100`,
        type: 'get',
        stateObj: 'property',
      }),
    );
  }, [promoCode]);

  return (
    <div className="page-content">
     
      <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize>
        {({ values, handleChange, setFieldValue, dirty, isValid, errors, touched }) => (
          <>
            <div className="ps-2 d-flex justify-content-between">
              <Breadcrumb items={breadcrumb} />
              {dirty && (
                <Button
                  className="button-color save-btn"
                  onClick={() => handleUpdatePromo(values)}
                  disabled={!isValid || updatePromo?.isLoading}
                >
                  Save Changes
                </Button>
              )}
            </div>
            <div className="promotion_details">
            {loading ? <Loader/> : 
              <Form>
                <div className="row mb-4">
                  <div className="col-lg-6">
                    <div className="promo_label">Promo Code</div>
                    <Field
                      type="text"
                      id="promoCode"
                      name="promoCode"
                      className="form-control"
                      value={promoDetails?.data?.[0]?.promoCode}
                      onChange={handleChange}
                      disabled
                    />
                    <ErrorMessage name="promoCode" component="div" className="text-danger" />
                  </div>
                  <div className="col-lg-6">
                    <div className="promo_label">Promo Name</div>
                    <Field
                      type="text"
                      id="promoName"
                      name="promoName"
                      className="form-control"
                      value={values.promoName}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="promoName" component="div" className="text-danger" />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="promo_label">Promo Description</div>
                  <Field
                    as="textarea"
                    id="promoDescription"
                    name="promoDescription"
                    className="form-control description_box"
                  />
                  <ErrorMessage name="promoDescription" component="div" className="text-danger" />
                </div>

                <div className="d-flex mb-4">
                  <div className="promo_label promo_state">Promo State</div>

                  <SimpleToggleSwitch
                    status={values.promoStateIsOn}
                    handleToggle={() => setFieldValue('promoStateIsOn', !values.promoStateIsOn)}
                  />
                </div>

                <div className="row mb-4">
                  <div className="col-lg-6">
                    <div className="promo_label">Promo Start Date</div>
                    <DatePicker
                      id="promoStartDate"
                      name="promoStartDate"
                      selected={values.promoStartDate || new Date()}
                      onChange={date => setFieldValue('promoStartDate', date)}
                      // dateFormat="yyyy-MM-dd"
                      className="form-control w-100 promo_start_date"
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                      minDate={new Date()}
                    />
                    <ErrorMessage name="promoStartDate" component="div" className="text-danger" />
                  </div>

                  <div className="col-lg-6">
                    <div className="promo_label">Promo End Date</div>
                    <DatePicker
                      id="promoEndDate"
                      name="promoEndDate"
                      selected={values.promoEndDate || new Date()}
                      onChange={date => setFieldValue('promoEndDate', date)}
                      className="form-control w-100"
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                    />
                    <ErrorMessage name="promoEndDate" component="div" className="text-danger" />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-lg-6">
                    <div className="promo_label">Max Promo Code Use</div>
                    <Field
                      type="number"
                      id="maxPromoCodeUse"
                      name="maxPromoCodeUse"
                      className="form-control"
                      value={values.maxPromoCodeUse}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <ErrorMessage name="maxPromoCodeUse" component="div" className="text-danger" />
                  </div>
                  <div className="col-lg-6">
                  <div className="promo_label">Property Tokens For Promo</div>
                    <Field
                      type="number"
                      id="initialTokensForPromo"
                      name="initialTokensForPromo"
                      className="form-control "
                      value={values.initialTokensForPromo}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <ErrorMessage name="initialTokensForPromo" component="div" className="text-danger" />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="promo_label">Promo Purchase Properties</div>
                  <MultiSelectDropdown
                    options={properties}
                    selectedValues={values?.promoPurchaseProperties}
                    placeholder="Select Properties"
                    setFieldValue={setFieldValue}
                    disabled={property?.isLoading}
                    errors={errors?.promoPurchaseProperties}
                    fieldName="promoPurchaseProperties"
                  />
                </div>

                <div className="row mb-4">
                  <div className="promo_label">Select Promo Gift Property</div>
                  <DropDownMenu
                    options={properties}
                    setFieldValue={setFieldValue}
                    selectedValues={values?.propertyId}
                    className="description_box"
                    disabled={property?.isLoading}
                    errors={errors?.propertyId}  
                  />
                </div>

                <div className="promo_label">Promo Tiers</div>
                <AddPromoTier
                  setFieldValue={setFieldValue}
                  values={values?.promoTiers}
                  errors={errors?.promoTiers}
                  touched={touched?.promoTiers}
                />
              </Form>
            }
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default EditPromotion;
