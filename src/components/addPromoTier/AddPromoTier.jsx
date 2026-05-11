import React from 'react';
import { Field, FieldArray } from 'formik';
import { Button } from 'reactstrap';

const AddPromoTier = ({ values = [], setFieldValue = () => null, errors = {} }) => {
  const tier = {
    investAmount: '',
    numGiftTokens: '',
  };
  const onInputChange = (e, index) =>
    setFieldValue(`promoTiers.${index}.${e.target.name}`, e.target.value);

  return (
    <div>
      {values && (
        <FieldArray
          name="promoTiers"
          render={arrayHelpers => (
            <div>
              {values?.map((formItem, index) => (
                <div className="d-flex promo_tier" key={formItem?.name}>
                  <div className="flex-35">
                    <Field
                      type="number"
                      id="investAmount"
                      name="investAmount"
                      className="form-control"
                      placeholder="ADD INVEST AMOUNT"
                      value={values[index].investAmount}
                      onChange={e => onInputChange(e, index)}
                    />

                    {errors?.length > 0 && errors[index]?.investAmount && (
                      <div className="text-danger">{errors[index]?.investAmount}</div>
                    )}
                  </div>
                  <div className="flex-65 margin-left-10">
                    <Field
                      type="number"
                      id="numGiftTokens"
                      name="numGiftTokens"
                      className="form-control"
                      placeholder="ADD TOKEN AMOUNT"
                      value={values[index].numGiftTokens}
                      onChange={e => onInputChange(e, index)}
                    />

                    {errors?.length > 0 && errors[index]?.numGiftTokens && (
                      <div className="text-danger">{errors[index]?.numGiftTokens}</div>
                    )}
                  </div>
                  {values?.length > 1 && (
                    <div
                      className="d-flex justify-content-center align-items-center cursor-pointer margin-left-20"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      Remove
                    </div>
                  )}
                </div>
              ))}

              <div className="add-another-postn">
                <Button
                  className="button-color save-btn cursor-pointer"
                  onClick={() => arrayHelpers.push(tier)}
                >
                  Add Promo Tier +
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default AddPromoTier;
