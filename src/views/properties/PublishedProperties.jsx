/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import SimpleToggleSwitch from 'components/Switch/SimpleToggleSwitch';
import { PublishedPropertiesColumn } from 'constants/columnUtility';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import { getPropertyList } from 'store/actions';

import './DraftProperties.css';
import '../viewcommon.css';

const DraftProperties = () => {
  const [data, setData] = useState([]);
  const location = useLocation();

  const [filter, setFilter] = useState({ itemsPerPage: 100, status: location.state || 'OnSale', sendData: '' });
  const { propertyList, loading } = useSelector(state => state.property);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dateOffsetConverter = (date) => {
    if(date) {
      const getDate = date && new Date(date);
      const offSetTimeZone = getDate?.getTimezoneOffset() * 60000;
      const modifiedDate = getDate && new Date(getDate?.getTime() + offSetTimeZone).toISOString();
      return modifiedDate;
    }
    return '';
  }

  const dateDataModification = (item) => {
    const startDate = dateOffsetConverter(item?.crowdSale?.startDate);
    const stopDate = dateOffsetConverter(item?.crowdSale?.stopDate);
    const crowdSaleObj = {...item?.crowdSale, startDate, stopDate};
    
    const purchaseDate = dateOffsetConverter(item?.otherInfo?.purchaseDate);
    const firstDividendsDate = dateOffsetConverter(item?.otherInfo?.firstDividendsDate);
    const otherInfoObj = {...item?.otherInfo, purchaseDate, firstDividendsDate};

    const payload = {...item, crowdSale: crowdSaleObj, otherInfo: otherInfoObj};
    return payload;
  }

  const handleView = useCallback((item) => {
    navigate(`/edit-property/${item?._id}`, {state: { data: dateDataModification(item), view: true, published: true } });
  }, [navigate]);

  const handleEdit = useCallback((item) => {
    navigate(`/edit-property/${item?._id}`, {state: { data: dateDataModification(item), published: true } });
  }, [navigate]);

  useEffect(() => {
    // dispatch(getEarlyInvestor({ list: 'user/listUsers', field: 'userList' }));
    // dispatch(getPropertyList());
  }, []);

  useEffect(() => {
    if (!propertyList || !Array.isArray(propertyList) || propertyList.length === 0) {
      setData([]);
      return;
    }
    
    const propertyDetails = propertyList.filter(item => item).map(item => ({
      title: item.otherInfo?.title ?? '-',
      state: item.attom?.city && item.attom?.state 
        ? `${item.attom.city}, ${item.attom.state}` 
        : item.attom?.city || item.attom?.state || '-',
      tokens: item.crowdSale?.tokensForSale,
      price: (() => {
        const { currentDebt, propertyValues } = item.financials || {};
        const { numberOfTokens } = item.crowdSale || {};
        
        if (!propertyValues || !Array.isArray(propertyValues) || propertyValues.length === 0 || !numberOfTokens) {
          return '-';
        }

        const lastValue = propertyValues[propertyValues.length - 1]?.value;
        if (!lastValue || !currentDebt) {
          return '-';
        }

        return (
          (lastValue - currentDebt) /
          numberOfTokens
        ).toFixed(2);
      })(),
      switch: (
        <SimpleToggleSwitch status={!item.otherInfo?.isHidden} id={item._id} key={item._id} />
      ),
      status:
        item.crowdSale?.status ||
        (item.crowdSale?.startDate && new Date(item.crowdSale.startDate) < new Date() ? 'Sale Ongoing' : 'Upcoming') ||
        '-',
      start: item.crowdSale?.startDate ? new Date(item.crowdSale.startDate).toLocaleString() : '-',
      action: <ActionCell view={handleView} edit={handleEdit} id={item} />,
    }));
    setData(propertyDetails);
  }, [propertyList, handleView, handleEdit]);
  useEffect(() => {
    const query = Object.keys(filter)
      .filter(item => filter[item])
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(getPropertyList(query));
  }, [JSON.stringify(filter), dispatch]);

  let timeout = '';
  const handleSearch = e => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setFilter(prev => ({ ...prev, title: e.target.value.trim() || undefined }));
    }, 700);
  };
  // const handleFilter = (val, name) => {
  //   setFilter(prev => ({ ...prev, [name]: val }));
  // };

  const exportHandler = (val) => {
    const flag = val === "CSV" ? "toCsv" : "toXls";
    setFilter(prev => ({ ...prev, sendData: flag }));
    toast.success("Statement has been sent to your linked email.");
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <div className="breadcrumb_btn">
              <Breadcrumb name="Published Properties" />
              <div>
                <ButtonDropDown
                  title="Export"
                  options={['CSV', 'XLS']}
                  name="sendData"
                  onClick={exportHandler}
                  noAll
                />
              </div>
            </div>
            <Card>
              <CardBody>
                <Row>
                  {/* <Col xl={6}>
                    <Breadcrumb name="Property Management" items={breadcrumbData} />
                  </Col>
                  <Col
                    xl={6}
                    className="d-flex justify-content-between align-items-center property-cards"
                  > */}
                  {/* <PropertiesManagementCard name="Drafted" score="1000" img={image} />
                    <PropertiesManagementCard name="published" score="999" img={image} /> */}
                  {/* </Col> */}
                  <Col className="d-flex justify-content-between p-4">
                    {/* <ButtonDropDown title="Location" options={['bombay', 'mumbai']} noAll/> */}
                    {/* <ButtonDropDown
                      title="On sale"
                      options={[{ 'On sale': 'OnSale' }]}
                      name="status"
                      onClick={handleFilter}
                      noAll
                    /> */}
                    <div className="d-flex">
                      <div className="search-box me-2 ">
                        <div className="position-relative">
                          <input
                            className="form-control mr-sm-2"
                            type="text"
                            placeholder="Search Property"
                            onChange={handleSearch}
                          />
                          <i className="mdi mdi-magnify search-icon" />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <DatatableTables
                    column={PublishedPropertiesColumn}
                    row={loading ? 'loading' : data}
                  />
                  {/* {modal && (
                    <DeleteModal
                      text="Are you sure you want to delete the property details ?"
                      title="Delete Draft Proposal"
                      close={modalClose}
                    />
                  )} */}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DraftProperties;
