/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import { promotionDetailsColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';
import { getEarlyInvestor } from 'store/actions';

import '../viewcommon.css';

const PromoDetails = () => {
  const dispatch = useDispatch();
  const {promoCode} = useParams();

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    promoCode: '',
  });

  const navigate = useNavigate();

  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [promotionList, setPromotionList] = useState([]);
  const [breadcrum, setBreadcrum] = useState([]);
  
  const { promoUserDetails, loading } = useSelector(state => state.user); 

  const handleView = (item) => {  
    navigate(`/promotions/${promoCode}/${item?.userId}`, {state: `${item.firstName || '-'} ${item?.lastName}` });
  }
  
  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  /* Pagination Config */

  useEffect(() => {
    if (promoUserDetails?.data?.length) {
    const detail = promoUserDetails?.data?.map(item => ({
      name: `${item.firstName || '-'} ${item?.lastName}`,
      email: item.email,
      amountInvested: item.amountInvested.toFixed(2), 
      tokenGifted: item?.amountGifted,
      tokenGiftPending: item?.amountGiftPending,
      amountPending: item?.amountPending.toFixed(2),
      amountPosted: item?.amountPosted.toFixed(2),
      action: <ActionCell view={handleView} id={item} />,
    }));

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(promoUserDetails?.totalCount / 10),
      count,
      itemCount: promoUserDetails?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp); 
    setPromotionList(detail);
    }else setPromotionList([])
  }, [promoUserDetails]);
 
  const getPromoUsers = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(getEarlyInvestor({ list: `payment/promotions-users`, field: 'promoUserDetails',  query:`promoCode=${promoCode}&${query}` }));
  }

  useEffect(() => {
    setBreadcrum([
      {
        name: 'Promotions',
        link: '/promotions',
      },
      { name: 'Promotion Details' },
    ])

    getPromoUsers();
  }, [JSON.stringify(filter)]);

  return (
    <div className="page-content">
      <div className="ps-2">
        <Breadcrumb items={breadcrum} />
      </div>

      <Container fluid>
        <div className="investor-background">
          <div className="investor-maincontainer">         
            <div className="d-flex">
              <SearchInput onChange={handleChange} />
            </div>
          </div>
          <DatatableTables
            column={promotionDetailsColumn}
            row={loading ? 'loading' : promotionList}
            paginationConfig={paginationConfig}
            paging={false}
          />
        </div>
      </Container>
    </div>
  );
};

export default PromoDetails;
