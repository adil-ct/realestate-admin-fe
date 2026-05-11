/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import {Container } from 'reactstrap';

import { PropertyFinancialsColumns } from 'constants/tableColumn';
import { commonSaga, commonSuccess } from 'store/actions';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';

import "react-datepicker/dist/react-datepicker.css";
import '../viewcommon.css';
import { NavigationLabel, ClickToCopy } from 'components/Table/tableComponents';
import CurrencyFormat from 'components/CurrencyFormat';
import TransferFinancials from 'components/UI/Model/TransferFinancials';
import PropertyInvestors from 'components/UI/Model/PropertyInvestors';

const PropertyFinancials = () => {
    const dispatch = useDispatch();
    const { commonData } = useSelector((state) => ({
      commonData: state.common,
    }));

    const [paginationConfig, setPaginationConfig] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10, search: ''});
    const [cfModal, setCfModal] = useState({show: false, data: {}});
    const [PIListModal, setPIListModal] = useState({show: false, data: {}});

    const _getList = () => {
      const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

      dispatch(commonSaga({endPoint: `/property/onSaleProperties?${query}`, type: "get", stateObj: "propertyFinancialsList"}));
    }

    useEffect(() => {
      _getList();
    }, [JSON.stringify(filter)]);

    useEffect(() => {
      if(commonData?.createPaymentMethod?.dataSaved || commonData?.updatePaymentMethod?.dataUpdated) {

          if(commonData?.createPaymentMethod?.dataSaved) {
            dispatch(commonSuccess({stateObj: "createPaymentMethod", dataSaved: false}));
          }
          if(commonData?.updatePaymentMethod?.dataUpdated) {
            dispatch(commonSuccess({stateObj: "updatePaymentMethod", dataUpdated: false}));
          }
          _getList();
      }
    }, [commonData?.createPaymentMethod, commonData?.updatePaymentMethod]);
    
    const onPageChange = page => setFilter(prev => ({ ...prev, page }));
  
    const transfer = (flag, walletAddress) => {
      setCfModal({show: true, data: {flag, walletAddress}});
    }

    const fetchPropertyInvestors = (ele) => {
      dispatch(commonSaga({endPoint: `/admin/propertyInvestors/${ele}`, type: "get", stateObj: "propertyInvestorList"}));
    }

    useEffect(() => {
      if(commonData?.propertyInvestorList?.dataObj?.investors?.length) {
        commonData?.propertyInvestorList?.dataObj?.investors?.forEach(ele => {
          const obj = ele;
          obj.name = `${obj?.firstName || '-'} ${obj?.lastName || '-'}`;
        });

        setPIListModal({show: true, data: commonData?.propertyInvestorList?.dataObj?.investors});
      }
    }, [commonData?.propertyInvestorList?.dataObj]);

    useEffect(() => {
      if(commonData?.propertyFinancialsList?.dataObj?.resultData?.length) {
        commonData?.propertyFinancialsList?.dataObj?.resultData?.forEach(ele => {
          const obj = ele;
          const displayText = obj?.walletAddress ? `${obj?.walletAddress?.slice(0, 4)}......${obj?.walletAddress?.slice(-4)}` : "- -";
          obj.customWalletAddress = <ClickToCopy copyText={obj?.walletAddress} displayText={displayText} />;
          obj.customWalletBalance = CurrencyFormat({value: (obj?.walletBalance), prefix: "$"})
          obj.totalTokens = obj?.tokenLeft + obj?.tokenSold;
          obj.tokensOnHold = obj?.tokensOnHold ? obj?.tokensOnHold : 0;
          obj.customTitle = <span className='link_btn' onClick={() => fetchPropertyInvestors(obj?._id)}>{obj?.title}</span>;
          obj.customOwner =<NavigationLabel title={obj?.owner} link={`/view-user/${obj?.ownerId}?via=investor`} />;
          obj.customPropertyManager =<NavigationLabel title={obj?.propertyManager} link={`/view-user/${obj?.propertyManagerId}?via=pm`} />;
          obj.transfer = <div>
            <button type="button" onClick={() => transfer('deposit', obj?._id)} className='link_btn'>Deposit</button>
            <button type="button" onClick={() => transfer('withdraw', obj?._id)} className='link_btn'>Withdraw</button>
          </div>;
        });
      }
      const paginationConfigTemp = {
        currentPage: filter.page,
        pageCount: Math.ceil(commonData?.propertyFinancialsList?.dataObj?.totalCount / filter?.limit),
        itemCount: commonData?.propertyFinancialsList?.dataObj?.totalCount,
        onPageChange,
      };
      setPaginationConfig(paginationConfigTemp);
    }, [commonData?.propertyFinancialsList?.dataObj]);

    const handelSort = (sortObj) =>  {
      if(sortObj?.column === "amount") {
        setFilter(prev => ({ ...prev, sortBy: "price", "sortKey" : sortObj?.direction === "desc" ? '-1' : '1' }));
      }
    }

    const handleChange = val => {
      setFilter(prev => ({ ...prev, search: val }));
    };

  return (
    <div className="page-content">
        <div className="breadcrumb_btn">
            <Breadcrumb name="Property Financials" />
            <div className="dflex">
              <SearchInput onChange={handleChange} />
            </div>
        </div>

      <Container fluid>
          <div className="investor-background">
            <DatatableTables
              paginationConfig={paginationConfig} 
              paging={false} 
              column={PropertyFinancialsColumns} 
              handelSort={handelSort}
              row={commonData?.propertyFinancialsList?.isLoading ? "loading" :  commonData?.propertyFinancialsList?.dataObj?.resultData} 
            />
          </div>
      </Container>
      <TransferFinancials
        onClose={setCfModal}
        isOpen={cfModal?.show}
        data={cfModal?.data}
      />
      <PropertyInvestors 
        onClose={setPIListModal}
        isOpen={PIListModal?.show}
        data={PIListModal?.data}
      />
    </div>
  );
};

export default PropertyFinancials;
