import React from 'react';
import { Col, Label, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import 'jodit';

import { marketDetailInfo } from 'constants/DraftData';
import { editorConfig } from 'constants/EditorConfig';
import { setSavedItem } from 'store/actions';

import './financials.css';
import 'jodit/build/jodit.min.css';

const MarketBasicDetail = ({ details, view }) => {
  const initialData = JSON.parse(JSON.stringify(details));
  let changed = false;
  const dispatch = useDispatch();

  const initialValues = {
    marketName: details?.marketName || '',
    state: details?.state || '',
    city: details?.city || '',
    propertyGrowth: details?.propertyGrowth || '',
    rentGrowth: details?.rentGrowth || '',
    marketRating: details?.marketRating || '',
    description: details?.description || '',
    marketChart: details?.marketChart || [],
  };

  const validationSchema = Yup.object().shape({
    marketName: Yup.string().required('Market Name is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    propertyGrowth: Yup.number()
      .typeError('Property Growth must be a number')
      .required('Property Growth is required'),
    rentGrowth: Yup.number()
      .typeError('Rent Growth must be a number')
      .required('Rent Growth is required'),
    marketRating: Yup.string().required('Market Rating is required'),
    description: Yup.string().required('Description is required'),
  });
 

  const handleChange = (e, setFieldValue, item, errors, values) => {    
    if (item === 'description') {
      // Handle changes for editor
      setFieldValue(item, e); 
      details[item] = e;
    } else {
      // Handle changes for other fields
      setFieldValue(item, e?.target?.value);
      details[item] = e?.target?.value;
    }
    const isUpdated = JSON.stringify(values) !== JSON.stringify(initialData);
    if (isUpdated && !Object.keys(errors).length) {
      changed = isUpdated;
      dispatch(setSavedItem({ tab: 10, changed }));
    }
  }
  

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize>
      {({ values, errors, setFieldValue}) => (
        <>   
          <Form>
            <Row>
              {Object.keys(marketDetailInfo).map(item => (
                <>
                  {item !== 'description' && (
                    <Col lg="6" className="px-3 py-2 ">
                      <Label>{marketDetailInfo[item].label}</Label>
                      <Field
                        type="text"
                        name={item}
                        className="form-control"
                        value={values[item]}
                        disabled={view}
                        onChange={e => handleChange(e, setFieldValue, item, errors, values)}
                        // onChange={e => handleChange(e, marketDetailInfo[item].type)}
                      />                      
                      {errors[item] && <div className="text-danger">{errors[item]}</div>}
                    </Col>
                  )}
                  {item === 'description' && (
                    <div>
                      {!view && (
                        <>
                        <JoditEditor
                          value={initialData?.description}
                          config={editorConfig}
                          onChange={e => handleChange(e, setFieldValue, 'description', errors, values)}                    
                        />
                        <ErrorMessage name="description" component="div" className="text-danger" />
                        </>
                      )}
                      {view && (
                        <div
                          className="descriptionBox"
                          dangerouslySetInnerHTML={{ __html: initialData?.description }}
                        />
                      )}
                    </div>
                  )}
                </>
              ))}
            </Row>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default MarketBasicDetail;
