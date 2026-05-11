import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import 'jodit';

import { editorConfig } from 'constants/EditorConfig';
import { setSavedItem } from 'store/actions';

import 'jodit/build/jodit.min.css';

const Rationale = ({ data, view }) => {
  if (!data?.rationale) {
    data.rationale = {};
  }
  const dispatch = useDispatch();
  const [changed, setChanged] = useState(false);
  const [initialData] = useState(JSON.parse(JSON.stringify(data)));

  const initialValues = {
    description: initialData?.rationale?.description || '',
    heading: initialData?.rationale?.heading || '',
  };

  const handleChange = (e, setFieldValue, type) => {
    const value = e?.target?.value;
    const field = e?.target?.name;

    if (type === 'editor') {    
      data.rationale.description = e;
      setFieldValue('description', e);
    }
    setFieldValue(field, value);
    data.rationale[field] = value;
    const changedAgain = JSON.stringify(data) !== JSON.stringify(initialData);
    if (changedAgain !== changed) {
      setChanged(changedAgain);
      dispatch(setSavedItem({ tab: 11, changed: changedAgain }));
    }
  };

  return (
    <>
      <div className="heading fw-bolder">Rationale</div>
      <Formik initialValues={initialValues} enableReinitialize>
        {({values, setFieldValue}) => (
          <Form>
            <Row className="mb-3">
              <Col lg="12">
                <FormGroup className="mb-3">
                  <Label>Description Heading</Label>
                  <Field
                    name="heading"
                    className="form-control"
                    disabled={view}
                    // value={data?.rationale?.heading}
                    value={values?.heading}
                    onChange={e => handleChange(e, setFieldValue, 'textbox')}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Label>Description</Label>
            <div>
              {!view && (
                <JoditEditor
                  value={values.description}
                  config={editorConfig}
                  onChange={(value) => {
                    handleChange(value, setFieldValue , 'editor')
                  }}
                />
              )}            
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Rationale;
