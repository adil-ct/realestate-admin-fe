import React, { memo, useCallback, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import Switch from 'react-switch';
import { parseISO } from 'date-fns';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';

import RenderIf from 'components/RenderIf';
import * as Information from 'constants/DraftData';
import PDF from 'assets/images/PDF.png';
import DOC from 'assets/images/DOC.png';
import { setSavedItem } from 'store/actions';
import { axiosMain } from 'http/axios/axios_main';
import ProgressBar from 'components/ProgressBar';
import { AddVariable } from './AddVariable';

import "react-datepicker/dist/react-datepicker.css";

const Details = ({ data, info, view, heading, tab = 1, status }) => {
  const isDraft = status === 'Draft';
  const documentImage = { pdf: PDF, msword: DOC };
  const fieldInfo = Information[info];
  const [uploading, setUploading] = useState(0);
  const [addVar, setAddVar] = useState('');
  const [rental, setRental] = useState(false);

  const dispatch = useDispatch();

  const switchFields = ['propertyMgtFee', 'LLCAdministrationFee', 'HOAFee'];

  const initialValues = {
    apn: data?.apn || '',
    lotnum: data?.lotnum || '',
    lotsize1: data?.lotsize1 || '',
    lotsize2: data?.lotsize2 || '',
    area: data?.area || '',
    blockNumber: data?.blockNumber || '',
    locationType: data?.locationType || '',
    country: data?.country || '',
    state: data?.state || '',
    city: data?.city || '',
    areaTaxCode: data?.areaTaxCode || '',
    line1: data?.line1 || '',
    line2: data?.line2 || '',
    zipCode: data?.zipCode || '',
    latitude: data?.latitude || '',
    longitude: data?.longitude || '',
    propertyClass: data?.propertyClass || '',
    propertyType: data?.propertyType || '',
    yearBuilt: data?.yearBuilt || '',
    bathTotal: data?.bathTotal || '',
    bedrooms: data?.bedrooms || '',
    levels: data?.levels || '',
    avmlastmonthvalue: data?.avmlastmonthvalue || '',
    avmamountchange: data?.avmamountchange || '',
    avmpercentchange: data?.avmpercentchange || '',
    monthlyRent: data?.monthlyRent || '',
    principal: data?.principal || '',
    interest: data?.interest || '',
    taxes: data?.taxes || '',
    insurance: data?.insurance || '',
    annualRentGrowth: data?.annualRentGrowth || '',
    currentMaintenanceReserveBalance: data?.currentMaintenanceReserveBalance || '',
    currentVacancyReserveBalance: data?.currentVacancyReserveBalance || '',
    maxMaintenanceFee: data?.maxMaintenanceFee || '',
    maxVacancyFee: data?.maxVacancyFee || '',
    propertyMgtFee: data?.propertyMgtFee || '',
    LLCAdministrationFee: data?.LLCAdministrationFee || '',
    HOAFee: data?.HOAFee || '',
    assetValue: data?.assetValue || '',
    closingCost: data?.closingCost || '',
    maintenanceReserve: data?.maintenanceReserve || '',
    vacancyReserve: data?.vacancyReserve || '',
    mogulBuyerFee: data?.mogulBuyerFee || '',
    mogulSellerFee: data?.mogulSellerFee || '',
    currentEquity: data?.currentEquity || '',
    currentDebt: data?.currentDebt || '',
    sellerEquity: data?.sellerEquity || '',
    mogulEquityToBuy: data?.mogulEquityToBuy || '',
    mogulEquityToSell: data?.mogulEquityToSell || '',
    platformResaleFee: data?.platformResaleFee || '',
    yearlyInvReturn: data?.yearlyInvReturn || '',
    projectedInvGain: data?.projectedInvGain || '',
    defaultRentGrowth: data?.defaultRentGrowth || '',
    defaultAnnualAppreciation: data?.defaultAnnualAppreciation || '',
    defaultTokensPurchased: data?.defaultTokensPurchased || '',
    leveragedCashflowMargin: data?.leveragedCashflowMargin || '',
    defaultMonthlyRent: data?.defaultMonthlyRent || '',
    maintenanceReserveAccountId: data?.maintenanceReserveAccountId || '',
    vacancyReserveAccountId: data?.vacancyReserveAccountId || '',
    mercuryToken: data?.mercuryToken || '',
    brexPaymentInstrumentId: data?.brexPaymentInstrumentId || '',
    mercuryRentAccountUuid: data?.mercuryRentAccountUuid || '',
    brexRentAccountRecipientId: data?.brexRentAccountRecipientId || '',
    contingencyVar1: data?.contingencyVar1 || '',
    contingencyVar2: data?.contingencyVar2 || '',
    contingencyVar3: data?.contingencyVar3 || '',
    contingencyVar4: data?.contingencyVar4 || '',
    numberOfTokens: data?.numberOfTokens,
    tokensForSale: data?.tokensForSale,
    startDate: data?.startDate ? parseISO(new Date(data?.startDate).toISOString()) : '',
    stopDate: data?.stopDate ? parseISO(new Date(data?.stopDate).toISOString()) : '',
    pricePerToken: data?.pricePerToken,
    minInvestment: data?.minInvestment,
    isMogulEquityBought: data?.isMogulEquityBought,
  };

  const handleChange = (e, field, setFieldValue, values, isSwitch) => {
    if (switchFields.includes(field)) {
      const fieldName = e?.target?.name;
      setFieldValue(fieldName, {
        ...values[fieldName],
        value: e?.target?.value || data[fieldName].value,
        isEnabled: isSwitch ? e?.target?.checked : data[fieldName].isEnabled,
      });

      data[fieldName] = {
        ...data[fieldName],
        value: e?.target?.value,
        isEnabled: isSwitch ? e?.target?.checked : data[fieldName].isEnabled,
      };
    } else {
      if (setFieldValue) setFieldValue(field, e?.target?.value);
      data[field] = e?.target?.value;
    }
    const isUpdated = JSON.stringify(values) !== JSON.stringify(data);
    if (isUpdated) {
      dispatch(setSavedItem({ tab, changed: isUpdated }));
    }
  };

  const handleSubmit = (val) => {
    // data[addVar] = val;
    handleChange(
      {
        target: {
          value: { ...val, value: Number(val.value), applicable: JSON.parse(val.applicable) },
          name: addVar?.item || addVar,
        },
      },
      addVar?.item || addVar,
    );
    setAddVar('');
  };

  const handleSwitch = useCallback((e, name, setFieldValue, values) => {
    const isSwitch = true;
    handleChange(
      { target: { value: data[name].value, name, checked: e } },
      name,
      setFieldValue,
      values,
      isSwitch,
    );
  }, []);

  const handleSwitchText = (val, name) => {
    if (!data[name]) data[name] = {};
    data[name].value = val;
    handleChange({ target: { value: data[name], name } });
  };

  const handleAcceptedFiles = async files => {
    if (!files.length) return;
    const fd = new FormData();
    const docType = 'rentalDocument';
    try {
      files.forEach(item => fd.append(docType, item));
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
      data[docType] = response.data?.data?.[docType];
      setRental(data[docType]);
      dispatch(setSavedItem({ tab, changed: true }));
    } catch (err) {
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.max(0, Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k))));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  };

  const formatFileSize = item => {
    if (item?.sizeInMegaByte != null) {
      const mb = Number(item.sizeInMegaByte);
      if (mb < 1) return `${(mb * 1024).toFixed(2)} KB`;
      return `${mb.toFixed(2)} MB`;
    }
    return formatBytes(item?.size);
  };
  
  return (
    <>
      <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
      <RenderIf render={heading}>
        <div className="heading fw-bolder">{heading}</div>
      </RenderIf>
      <Formik initialValues={initialValues} enableReinitialize>
        {({ values, setFieldValue }) => (
          <Form>
            <Row className="mt-5 details-form-row">
              {Object.keys(fieldInfo).map(item =>
                item.startsWith('contingencyVar') ? (
                  data[item].name ? (
                    <>
                      <Col xs="12" md="6" lg={view ? '6' : '5'}>
                        <FormGroup className="mb-3 details-field">
                          <div className="details-label-row">
                            <Label className="details-label" title={data[item].name}>
                              {data[item].name}
                            </Label>
                            <Switch
                              disabled={view}
                              onColor="#00FF00"
                              onChange={e => handleSwitch(e, item, setFieldValue, values)}
                              checked={data[item].applicable}
                              className="details-switch"
                            />
                          </div>
                          <Field
                            name={data[item].name}
                            className="form-control"
                            value={data[item].value}
                            type="number"
                            onChange={e => handleSwitchText(e.target.value.trim(), item)}
                            disabled={view}
                          />
                        </FormGroup>
                      </Col>
                      {!view && (
                        <Col xs="12" md="6" lg="1" className="d-flex align-items-end mb-3">
                          <Button
                            className="button-color w-100"
                            onClick={() => setAddVar({ ...data[item], item })}
                          >
                            <i className="fas fa-edit" role="button" />
                          </Button>
                        </Col>
                      )}
                    </>
                  ) : null
                ) : fieldInfo[item].switch ? (
                  <Col xs="12" md="6">
                    <FormGroup className="mb-3 details-field">
                      <div className="details-label-row">
                        <Label className="details-label" title={fieldInfo[item].label}>
                          {fieldInfo[item].label}
                        </Label>
                        <Switch
                          onColor="#00FF00"
                          disabled={view || (!fieldInfo[item].update && !isDraft)}
                          onChange={e => handleSwitch(e, item, setFieldValue, values, 'isEnabled')}
                          checked={values[item]?.isEnabled}
                          className="details-switch"
                        />
                      </div>
                      <Field
                        name={item}
                        className="form-control"
                        value={values[item]?.value}
                        type="number"
                        label={fieldInfo[item].label}
                        disabled={view || (!fieldInfo[item].update && !isDraft)}
                        onChange={e => handleChange(e, item, setFieldValue, values)}
                      />
                    </FormGroup>
                  </Col>
                ) : (
                  <Col xs="12" md="6">
                    <FormGroup className="mb-3 details-field">
                      <Label className="d-block details-label" title={fieldInfo[item].label}>
                        {fieldInfo[item].label}
                      </Label>
                      {fieldInfo[item].type === 'datetime-local' ? (
                        <DatePicker
                          name={item}
                          selected={values[item]}
                          onChange={date => handleChange({ target: { value: date }}, item, setFieldValue)}
                          className="form-control w-100"
                          timeInputLabel="Time:"
                          dateFormat="MM/dd/yyyy h:mm aa"
                          showTimeInput
                          disabled={
                            view ||
                            (!fieldInfo[item].update && !isDraft)
                          }
                        />
                      ) : (
                        <Field
                          name={item}
                          className="form-control"
                          disabled={
                            view ||
                            (!fieldInfo[item].update && !isDraft)
                          }
                          {...fieldInfo[item]}
                          value={values[item]}
                          onChange={e => handleChange(e, item, setFieldValue, values)}
                        />
                      )}
                    </FormGroup>
                  </Col>
                ),
              )}
            </Row>
            {addVar && (
              <AddVariable
                handleSubmit={handleSubmit}
                close={() => setAddVar('')}
                model={typeof addVar === 'string' ? {} : addVar}
              />
            )}
            {heading === 'Cashflow' && !view && (
              <div className="mt-4">
                <Label>Rental Document</Label>
                {rental ? (
                  <Row className="document-container">
                    <Col>
                      <a href={rental.location || rental.url} target="_blank" rel="noreferrer">
                        <img
                          src={documentImage[rental.contentType.split('/').pop()]}
                          alt={rental.key}
                          height="50"
                          width="50"
                        />
                      </a>
                    </Col>
                    <Col>{rental.key}</Col>
                    <Col>{formatFileSize(rental)}</Col>
                    {!view && (
                      <Col>
                        <div
                          className="cross"
                          onClick={() => {
                            data.rentalDocument = undefined;
                            setRental(false);
                          }}
                        >
                          X
                        </div>
                      </Col>
                    )}
                  </Row>
                ) : (
                  <Dropzone
                    onDrop={acceptedFiles => {
                      handleAcceptedFiles(acceptedFiles, 'main');
                    }}
                    accept=".pdf,.doc"
                    multiple={false}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone">
                        <div className="dz-message needsclick" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <div className="mb-3">
                            <i className="display-4 text-muted uil uil-cloud-upload" />
                          </div>
                          <h4>Upload rental document</h4>
                          <h5>Drop files here or click to upload.</h5>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                )}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default memo(Details);
