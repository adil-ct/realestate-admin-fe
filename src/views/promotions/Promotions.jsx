/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Container, Button } from 'reactstrap';
import { useNavigate } from "react-router-dom"
import moment from 'moment';
import Switch from 'react-switch';

import { promotionColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';
import { getEarlyInvestor, commonSaga } from 'store/actions';
import CreatePromo from '../../components/UI/Model/promocode/CreatePromo';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';

const Promotions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    promoStartDate: '',
    promoEndDate: '',
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [startDate, endDate] = dateRange;
  const [promotionList, setPromotionList] = useState([]);
  const [open, setOpen] = useState(false);

  const { promotionDetails, loading } = useSelector(state => state.user);

  const Offsymbol = () => <div className="uncheckedicon" />;
  const OnSymbol = () => <div className="checkedicon" />;
  
  const getPromotionList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(getEarlyInvestor({ list: 'payment/promotions-admin', field: 'promotionDetails', query }));
  }

  const onSwitchChange = (values) => {    
    /* eslint-disable no-unused-vars */ 
    const newPromoTier = values?.promoGiftProperty?.promoTiers.map(({ _id, ...rest }) => rest);  // Remove _id from the promoTier
      const data = {
        promoCode: values?.promoCode,
        promoDescription: values?.promoDescription,
        promoName: values?.promoName,    
        promoStartDate: values?.promoStartDate,
        promoEndDate: values?.promoEndDate,
        maxPromoCodeUse: values?.maxPromoCodeUse,
        promoPurchaseProperties: values?.promoPurchaseProperties,
        promoStateIsOn: !values?.promoStateIsOn,
        promoGiftProperty: {
          ...values?.promoGiftProperty,          
          promoTiers: newPromoTier,     
        }            
      };
  
      dispatch(
        commonSaga({
          endPoint: `payment/promotion-update`,
          type: 'post',
          stateObj: 'updatePromo',
          dataToPost: data,
          baseEP: 'PAYMENT',
          success: getPromotionList
        }),
      );
  }

  const handleView = item =>
    navigate(`/promotions/${item?.promoCode}`);

  const handleEdit = item =>
    navigate(`/edit-promotion/${item?.promoCode}`);


  const handleCreatePromo = () => setOpen(true);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      setFilter(prev => ({
        ...prev,
        promoStartDate: moment(new Date(dateRange[0])).format('YYYY-MM-DD'),
        promoEndDate: moment(new Date(dateRange[1])).format('YYYY-MM-DD'),
      }));
    } else {
      setFilter(prev => ({ ...prev, promoStartDate: '', promoEndDate: '' }));
    }
  }, [dateRange]);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };


  useEffect(() => {
    if(promotionDetails?.data?.length){
    const detail = promotionDetails?.data?.map(item => ({
      promoCode: item.promoCode,
      name: item.promoName,
      description: item.promoDescription,
      state: <Switch id={item?._id} key={item?._id} uncheckedIcon={<Offsymbol />} checkedIcon={<OnSymbol />}
          onColor="#00FF00" onChange={() => onSwitchChange(item)} checked={item?.promoStateIsOn} />,
      tokenRemaining: item?.promoGiftProperty?.initialTokensForPromo - item?.promoGiftProperty?.tokensUsedForPromo,
      tokenGifted: item?.promoGiftProperty?.tokensUsedForPromo,
      action: <ActionCell view={handleView} edit={handleEdit} id={item} />,
    }));

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(promotionDetails?.totalCount / 10),
      count,
      itemCount: promotionDetails?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp); 
    setPromotionList(detail);
    }else setPromotionList([]);
  }, [promotionDetails]); 


  useEffect(() => {
    getPromotionList();
  }, [JSON.stringify(filter)]);

  return (
    <div className="page-content">
      <div className="ps-2">
        <Breadcrumb name="Promotions" />
      </div>

      <Container fluid>
        <div className="investor-background">
          <div className="investor-maincontainer">
            <div className="dflex">
              <DatePicker
                selectsRange="true"
                startDate={startDate}
                endDate={endDate}
                placeholderText="Date Range Filter"
                onChange={update => {
                  setDateRange(update);
                }}
                isClearable="false"
              />
            </div>
            <Button className="button-color" onClick={handleCreatePromo}>
              Create Promo
            </Button>
          </div>
          <DatatableTables
            column={promotionColumn}
            row={loading ? 'loading' : promotionList}
            paginationConfig={paginationConfig}
            paging={false}
          />
        </div>
      </Container>

      <CreatePromo
        isOpen={open}
        close={() => setOpen(false)}   
        getPromoList={getPromotionList}
      />
    </div>
  );
};

export default Promotions;
