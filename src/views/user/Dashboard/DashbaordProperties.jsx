/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DashboardPropertiesColumn } from 'constants/columnUtility';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import { getPropertyList } from 'store/actions';

// import './DraftProperties.css';
import '../../viewcommon.css';

const DashboardProperties = () => {
  const [data, setData] = useState([]);

  const { propertyList, loading } = useSelector(state => state.property);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dateOffsetConverter = (date) => {
    if (date) {
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
    const crowdSaleObj = { ...item?.crowdSale, startDate, stopDate };

    const purchaseDate = dateOffsetConverter(item?.otherInfo?.purchaseDate);
    const firstDividendsDate = dateOffsetConverter(item?.otherInfo?.firstDividendsDate);
    const otherInfoObj = { ...item?.otherInfo, purchaseDate, firstDividendsDate };

    const payload = { ...item, crowdSale: crowdSaleObj, otherInfo: otherInfoObj };
    return payload;
  }

  const handleView = useCallback((item) => {
    navigate(`/edit-property/${item?._id}`, { state: { data: dateDataModification(item), view: true, published: true } });
  }, [navigate]);


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

      status:
        item.crowdSale?.status ||
        (item.crowdSale?.startDate && new Date(item.crowdSale.startDate) < new Date() ? 'Sale Ongoing' : 'Upcoming') ||
        '-',
      start: item.crowdSale?.startDate ? new Date(item.crowdSale.startDate).toLocaleString() : '-',
      action: <ActionCell view={handleView} id={item} />,
    }));
    setData(propertyDetails);
  }, [propertyList, handleView]);
  
  useEffect(() => {
    dispatch(getPropertyList('status=OnSale&itemsPerPage=5'));
  }, [dispatch]);


  return (
    <div className="mt-0">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <div className="breadcrumb_btn p-0 m-0">
              <Breadcrumb name="Published Properties" />
              {/* <div>
                <ButtonDropDown
                  title="Export"
                  options={['CSV', 'XLS']}
                  name="sendData"
                  onClick={exportHandler}
                  noAll
                />
              </div> */}
            </div>
            <Card>
              <CardBody className='p-0'>
                <Row>
                  <DatatableTables
                    column={DashboardPropertiesColumn}
                    row={loading ? 'loading' : data}
                    paging={false}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardProperties;
