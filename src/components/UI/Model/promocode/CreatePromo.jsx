import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AddPromoTier from 'components/addPromoTier/AddPromoTier';
import MultiSelectDropdown from 'components/multiSelectDropdown/MultiSelectDropdown';
import SimpleToggleSwitch from 'components/Switch/SimpleToggleSwitch';
import DropDownMenu from 'components/Dropdowncomponent/DropDownMenu';
import { commonSaga } from 'store/actions';

import 'react-datepicker/dist/react-datepicker.css';
import './createPromo.css';

const CreatePromo = ({ isOpen, close, getPromoList }) => {

  const dispatch = useDispatch();
  
  const tier = {
    investAmount: '',
    numGiftTokens: '',
  };

  const initialValues = {
    promoCode: '',
    promoName: '',
    promoDescription: '',
    promoStateIsOn: false,
    promoStartDate: '',
    promoEndDate: '',
    maxPromoCodeUse: 0,
    propertyId: '',
    promoTiers: [tier],
    promoPurchaseProperties: [],
  };

  const { property, updatePromo } = useSelector(state => state.common);
  const [properties, setProperties] = useState([]);

  const createPromo = (values) => {
    const data = {
      promoCode: values?.promoCode,
      promoDescription: values?.promoDescription,
      promoName: values?.promoName,
      promoStateIsOn: values?.promoStateIsOn,
      promoStartDate: values?.promoStartDate,
      promoEndDate: values?.promoEndDate,
      maxPromoCodeUse: values?.maxPromoCodeUse,
      promoPurchaseProperties: values?.promoPurchaseProperties,
      promoGiftProperty: {
        propertyId: values?.propertyId,
        promoTiers: values?.promoTiers,
        initialTokensForPromo: values?.initialTokensForPromo,
        tokensUsedForPromo: 0,
      },
    };

    const success = () => {
      toast.success(`Promotion ${values?.promoCode} successfully created`);
      close(false);
      getPromoList();
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
    promoCode: Yup.string().required('Promo Code is required'),
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

  useEffect(()=>{
    dispatch(
      commonSaga({
        endPoint: `/property/onSaleProperties?limit=100`,
        type: 'get',
        stateObj: 'property',
      }),
    );
  },[])

  useEffect(() => {
    if (property) setProperties(property?.dataObj?.resultData);
  }, [property]);

  return (
    <>
      <div>
        <div>
          <Modal centered isOpen={!!isOpen}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModaldiv">
                Create Promo
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
                onSubmit={values => createPromo(values)}
              >
                {({ values, handleChange, setFieldValue, errors, touched, handleBlur }) => (
                  <> 
                      <Form>
                        <div className="row mb-4">
                          <div className="col-lg-6">
                            <div className="promo_label">Promo Code</div>
                            <Field
                              type="text"
                              id="promoCode"
                              name="promoCode"
                              className="form-control"
                              value={values.promoCode}
                              onChange={(e) => {
                                const uppercaseCode = e.target.value.toUpperCase();
                                const codeWithoutSpaces = uppercaseCode.replace(/\s/g, ''); 
                                setFieldValue('promoCode', codeWithoutSpaces);
                              }}
                              onBlur={handleBlur}
                            />

                            <ErrorMessage
                              name="promoCode"
                              component="div"
                              className="text-danger"
                            />
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
                            <ErrorMessage
                              name="promoName"
                              component="div"
                              className="text-danger"
                            />
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
                          <ErrorMessage
                            name="promoDescription"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="d-flex mb-4">
                          <div className="promo_label promo_state">Promo State</div>

                          <SimpleToggleSwitch
                            status={values.promoStateIsOn}
                            handleToggle={() =>
                              setFieldValue('promoStateIsOn', !values.promoStateIsOn)
                            }
                          />
                        </div>

                        <div className="row mb-4">
                          <div className="col-lg-6">
                            <div className="promo_label">Promo Start Date</div>
                            <DatePicker
                              id="promoStartDate"
                              name="promoStartDate"
                              selected={values.promoStartDate}
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
                              selected={values.promoEndDate}
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
                            <ErrorMessage
                              name="maxPromoCodeUse"
                              component="div"
                              className="text-danger"
                            />
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
                            className="description_box"
                            errors={errors?.propertyId}
                            disabled={property?.isLoading}  
                          />
                        </div>

                        <div className="promo_label">Promo Tiers</div>
                        <AddPromoTier
                          setFieldValue={setFieldValue}
                          values={values?.promoTiers}
                          errors={errors?.promoTiers}
                          touched={touched?.promoTiers}
                        />
                        <Button
                          className="button-color create_promo_btn"
                          type="submit"
                          disabled={updatePromo?.isLoading}
                        >
                          Create Promocode
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

export default CreatePromo;
