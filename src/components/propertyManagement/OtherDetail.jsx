import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import Dropzone from 'react-dropzone';
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import TagsInput from 'react-tagsinput';
import 'jodit';

import { otherDetailInfo } from 'constants/DraftData';
import { axiosMain } from 'http/axios/axios_main';
import ProgressBar from 'components/ProgressBar';
import { setSavedItem } from 'store/actions';
import { editorConfig } from 'constants/EditorConfig';

import 'react-tagsinput/react-tagsinput.css';
import 'jodit/build/jodit.min.css';

const OtherDetail = ({ data, view, status }) => {
  const isDraft = status === 'Draft';
  const [uploading, setUploading] = useState(0);
  const { marketList, loading } = useSelector(state => state.market);
  const { userList, loading: userLoading } = useSelector(state => state.user);
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));

  const dropDownData = {
    _manager: commonData?.pmList?.dataObj?.data?.map(item => ({ name: `${item?.firstName} ${item?.lastName || ""} (${item?.email})`, id: item._id })),
    _market: marketList.map(item => ({ name: item.marketName, id: item._id })),
    _owner: userList.map(item => ({ name: `${item.firstName} ${item?.lastName} (${item?.email})`, id: item._id })),
  };
  const load = {
    _manager: commonData?.pmList?.dataObj?.isLoading,
    _market: loading,
    _owner: userLoading,
  };

  const [initialData] = useState(data);
  const [tags, setTags] = useState(data?.tags || []);
  const dispatch = useDispatch();

  const handleChange = (e, type, bool) => {
    let val = e?.target?.value;
    let field = e?.target?.name;
    if (type === 'number') {
      val = Number(val);
    }
    if (type === 'tags') {
      field = type;
      val = e;
      setTags(e);
    }
    if (bool) {
      val = JSON.parse(val);
    }
    if (type === 'editor') {
      data.description = e;
      val = e;
      field = 'description';
    }
    if (initialData[field] === undefined && !val) {
      val = undefined;
    }
    data[field] = val;
    const changedAgain = JSON.stringify(data) !== JSON.stringify(initialData);  
    if (changedAgain) {
      dispatch(setSavedItem({ tab: 9, changed: changedAgain }));
    }
  };

  const handleAcceptedFiles = async (files, docType) => {
    if (!files.length) return;
    const fd = new FormData();
    try {
      files.forEach(item => fd.append('images', item));
      const response = await axiosMain({
        method: 'post',
        url: '/property/file.upload',
        data: fd,
        onUploadProgress: progress => {
          const { total, loaded } = progress;
          const totalSizeInMB = total / 1000000;
          const loadedSizeInMB = loaded / 1000000;
          const uploadPercentage = Math.floor((loadedSizeInMB / totalSizeInMB) * 100);
          setUploading(uploadPercentage);
        },
      });
      data[docType] = response.data?.data?.images?.[0];
      dispatch(setSavedItem({ tab: 9, changed: true }));
    } catch (err) {
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };

  return (
    <div className="mt-5">
      <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
      <Formik enableReinitialize>
        <Form>
          <Row className="mb-3">
            {Object.keys(otherDetailInfo).map(item => (
              <Col lg="6" key={item}>
                <FormGroup className="mb-3">
                  <Label for="horizontal-firstname-Input" className="col-form-Label">
                    {otherDetailInfo[item]?.label}
                  </Label>
                  {otherDetailInfo[item].type === 'select' ? (
                    <Field
                      name={item}
                      as="select"
                      type="select"
                      className="form-control form-select"
                      disabled={view || (!otherDetailInfo[item].update && !isDraft)}
                      value={String(data[item])}
                      onChange={e =>
                        handleChange(
                          e,
                          otherDetailInfo[item].type,
                          otherDetailInfo[item].bool ? 'bool' : '',
                        )
                      }
                    >
                      {load[item] ? (
                        <option>Loading...</option>
                      ) : dropDownData[item] ? (
                        <>
                          <option value="">Select {otherDetailInfo[item].label}</option>
                          {dropDownData[item].map(opt => (
                            <option value={opt.id} key={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          {' '}
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </>
                      )}
                    </Field>
                  ) : otherDetailInfo[item].type === 'tags' ? (
                    <>
                      <Label>Tags</Label>
                      <TagsInput
                        value={tags}
                        onChange={tag => handleChange(tag, 'tags')}
                        disabled={view}
                      />
                    </>
                  ) : otherDetailInfo[item].type === 'upload' ? (
                    <>
                    
                      {view ? (
                        <Row>
                          <Col>
                          { data[item]?.url &&
                            <a href={data[item]?.url} target="_blank" rel="noreferrer">
                              <img
                                src={data[item]?.url}
                                alt={data[item]?.url}
                                height="100"
                                width="150"
                              />
                            </a>
                          }
                          </Col>
                        </Row>
                      ) : (
                        <>
                          <Dropzone
                            accept="image/*"
                            multiple={false}
                            onDrop={acceptedFiles => {
                              handleAcceptedFiles(acceptedFiles, item);
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone">
                                <div className="dz-message needsclick" {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <div className="mb-3">
                                    <i className="display-4 text-muted uil uil-cloud-upload" />
                                  </div>
                                  <h5>Drop files here or click to upload.</h5>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          <small>{data[item]?.url}</small>
                        </>
                      )}
                    </>
                  ) : (
                    <Field
                      name={item}
                      value={
                        otherDetailInfo[item].type === 'datetime-local'
                          ? data[item]
                            ? data[item].substring(0, 16)
                            : ''
                          : data?.[item]
                      }
                      className="form-control"
                      disabled={view || (!otherDetailInfo[item].update && !isDraft)}
                      {...otherDetailInfo[item]}
                      onChange={e => handleChange(e, otherDetailInfo[item].type)}
                    />
                  )}
                </FormGroup>
              </Col>
            ))}
          </Row>
          <Label>Description</Label>
          <div>
            {!view && (
              <JoditEditor
                value={data.description}
                config={editorConfig}
                onChange={value => {
                  handleChange(value, 'editor');
                }}
              />
            )}
            {view && <div dangerouslySetInnerHTML={{ __html: data.description }} />}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default OtherDetail;
