import React, { useState } from 'react';
import { Col, FormGroup, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { Field, Form, Formik } from 'formik';
import { underwritingInfo } from 'constants/DraftData';
import { setSavedItem } from 'store/actions';

import './financials.css';

const Underwriting = ({ data = {}, view }) => {
  const [initialData] = useState(JSON.parse(JSON.stringify(data || {}))); 
  const dispatch = useDispatch();
  let changed = false;

  const handleChange = (e,setFieldValue) => {
    let val = e.target.value;
    val = Number(val);
    setFieldValue(e.target.name,val)
    data[e.target.name] = val;
    const changedAgain = JSON.stringify(data) !== JSON.stringify(initialData);
    if (changedAgain !== changed) {
      changed = changedAgain;
      dispatch(setSavedItem({ tab: 2, changed }));
    }
  };

  const initialValues = {
    monthlyRentalIncomeBase: initialData.monthlyRentalIncomeBase || '',
    monthlyRentalIncomeBear: initialData.monthlyRentalIncomeBear || '',
    monthlyRentalIncomeBull: initialData.monthlyRentalIncomeBull || '',
    rentalIncomeGrowthRateBase: initialData.rentalIncomeGrowthRateBase || '',
    rentalIncomeGrowthRateBear: initialData.rentalIncomeGrowthRateBear || '',
    rentalIncomeGrowthRateBull: initialData.rentalIncomeGrowthRateBull || '',
    yearlyPropertyTaxesBase: initialData.yearlyPropertyTaxesBase || '',
    hoaDuesBase: initialData.hoaDuesBase || '',
    homeownersInsuranceBase: initialData.homeownersInsuranceBase || '',
    propertyManagementBase: initialData.propertyManagementBase || '',
    miscCostsBase: initialData.miscCostsBase || '',
    expensesGrowthRateBase: initialData.expensesGrowthRateBase || '',
    expensesGrowthRateBear: initialData.expensesGrowthRateBear || '',
    expensesGrowthRateBull: initialData.expensesGrowthRateBull || '',
    valueGrowthRateBase: initialData.valueGrowthRateBase || '',
    valueGrowthRateBear: initialData.valueGrowthRateBear || '',
    valueGrowthRateBull: initialData.valueGrowthRateBull || '',
    yearsBase: initialData.yearsBase || '',
    yearsBear: initialData.yearsBear || '',
    yearsBull: initialData.yearsBull || '',
  };
  

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize     
    >
      {({ values, setFieldValue }) => (
        <Form> 
          <Row className="uwHeading">
            <Col lg="3" />
            <Col lg="3">Base</Col>
            <Col lg="3">Bull</Col>
            <Col lg="3">Bear</Col>
          </Row>
          <Row>
            {underwritingInfo.map(item => (
              <> 
                <Col lg="3" key={item?.label}>
                  {item?.label}
                </Col>
                <Col lg="3" key={`base-${item?.label}`}>
                  {item?.base && (
                    <FormGroup className="mb-3">
                      <Field
                        name={item?.base?.key}
                        type="number"
                        disabled={view}
                        className="form-control"
                        id="basicpill-pancard-input5"
                        value={values[item?.base?.key]}
                        onChange={e => handleChange(e,setFieldValue)}
                      />
                    </FormGroup>
                  )}
                </Col>
                <Col lg="3" key={`bull-${item?.label}`}>
                  {item?.bull && (
                    <FormGroup className="mb-3">
                      <Field
                        name={item?.bull?.key}
                        type="number"
                        disabled={view}
                        className="form-control"
                        id="basicpill-pancard-input5"
                        value={values[item?.bull?.key]}
                        onChange={e => handleChange(e,setFieldValue)}
                      />
                    </FormGroup>
                  )}
                </Col>
                <Col lg="3" key={`bear-${item?.label}`}>
                  {item?.bear && (
                    <FormGroup className="mb-3">
                      <Field
                        name={item?.bear?.key}
                        type="number"
                        disabled={view}
                        className="form-control"
                        id="basicpill-pancard-input5"
                        value={values[item?.bear?.key]}
                        onChange={e => handleChange(e,setFieldValue)}
                      />
                    </FormGroup>
                  )}
                </Col>
              </>
            ))}
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default Underwriting;
