/* eslint-disable no-underscore-dangle */
import { Container, TabContent, NavItem, Nav, TabPane, NavLink } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

import { NavigationLabel } from 'components/Table/tableComponents';
import { ReferralTxnsColumn, RewardTxnsColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';
import { commonSaga } from 'store/actions';

import '../viewcommon.css';

const ReferralTransactions = () => {
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
      commonData: state.common,
  }));

  const [filter, setFilter] = useState({ page: 1, limit: 10, startDate: '', endDate: '', status: '', search: '' });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');

  const [activeTab, setActiveTab] = useState("converted");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const getList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== "all")
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    if(activeTab === 'rewards') {
      dispatch(commonSaga({endPoint: `/user/rewards-history?${query}`, type: "get", stateObj: "rewardsList", baseEP: "USER"}));
    } else {
      dispatch(commonSaga({endPoint: `/payment/rewards-transactions?${query}`, type: "get", stateObj: "convertedReferralList", baseEP: "PAYMENT"}));
    }
  }

  useEffect(() => {
      getList();
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    const defaultFilter = { page: 1, limit: 10, startDate: '', endDate: '', propertyId: '', status: '' };
    if(JSON.stringify(filter) === JSON.stringify(defaultFilter)) {
      getList();
    } else {
      setFilter(defaultFilter);
    }
  }, [activeTab]);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page}));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };
  /* Pagination Config */

  const toggleTab = (flag) => {
      if (activeTab !== flag) {
        setActiveTab(flag);
      }
  }

  useEffect(() => {
    if(dateRange[0] && dateRange[1]) {
      setFilter(prev => ({ ...prev, startDate : moment(new Date(dateRange[0])).format('YYYY-MM-DD'), endDate: moment(new Date(dateRange[1])).format('YYYY-MM-DD')}));
    } else {
      setFilter(prev => ({ ...prev, startDate : '' , endDate: ''}));
    }
  }, [dateRange]);

  useEffect(() => {
    if(commonData?.convertedReferralList?.dataObj?.transactions?.length) {
      commonData?.convertedReferralList?.dataObj?.transactions?.forEach(ele => {
        const obj = ele;
        obj.quoteCurrencyAmount = obj?.quoteCurrencyAmount || "-";
        obj.createdAt = moment(new Date(obj?.createdAt)).format('YYYY-DD-MM');
        obj.transactionHash = typeof obj?.transactionHash==="string" && NavigationLabel({ 
          title: `${obj.transactionHash?.slice(0, 4)}......${obj.transactionHash?.slice(-4)}`, 
          link: `${process.env.REACT_APP_POLYGON_URL}${obj.transactionHash}`, external: true 
        });
      });
      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.convertedReferralList?.dataObj?.totalCount / filter?.limit),
        count,
        itemCount: commonData?.convertedReferralList?.dataObj?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }

  }, [commonData?.convertedReferralList]);

  useEffect(() => {
    if(commonData?.rewardsList?.dataObj?.data?.length) {
      commonData?.rewardsList?.dataObj?.data?.forEach(ele => {
        const obj = ele;
        obj.quoteCurrencyAmount = obj?.quoteCurrencyAmount || "-";
        if(obj?.referral) {
          obj.referraluser = `${obj?.referralUser} (Referral)`;
          obj.refereeuser = `${obj?.refereeUser} (Referee)`;
        } else {
          obj.referraluser = `${obj?.refereeUser} (Referee)`;
          obj.refereeuser = `${obj?.referralUser} (Referral)`;
        }        
        obj.createdAt = moment(new Date(obj?.createdAt)).format('YYYY-DD-MM');
        // obj.transactionHash = NavigationLabel({ 
        //   title: `${obj.transactionHash?.slice(0, 4)}......${obj.transactionHash?.slice(-4)}`, 
        //   link: `${process.env.REACT_APP_POLYGON_URL}${obj.transactionHas}`, external: true 
        // });
      });
    }

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(commonData?.rewardsList?.dataObj?.totalCount / filter?.limit),
      count,
      itemCount: commonData?.rewardsList?.dataObj?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);

  }, [commonData?.rewardsList]);

  // const payForRerral = (obj) => {
  //   console.log(obj);
  //   dispatch(commonSaga({endPoint: `/payment/transfer-rewards/${obj?.refereeId}/${obj?.referralId}`, type: "post", dataToPost:{}, stateObj: "payForReferral", baseEP: "PAYMENT"}));
  // }

  // useEffect(() => {
  //   if(commonData?.rewardsList?.dataObj?.data?.length) {
  //     commonData?.rewardsList?.dataObj?.data?.forEach(ele => {
  //       const obj = ele;
  //       obj.startDate = moment(new Date(obj?.updatedAt)).format('YYYY-DD-MM');
  //     });
  //   }

  //   const paginationConfigTemp = {
  //     currentPage,
  //     pageCount: Math.ceil(commonData?.rewardsList?.dataObj?.totalCount / filter?.limit),
  //     count,
  //     itemCount: commonData?.rewardsList?.dataObj?.totalCount,
  //     onPageChange,
  //     updateCurrentCountPage,
  //   };
  //   setPaginationConfig(paginationConfigTemp);

  // }, [commonData?.rewardsList]);

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
          <Breadcrumb name="Rewards Transactions" />
      </div>

      <Nav pills className="nav-justified bg-light p-2 portfolioNav">
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'converted' ? "active": ""}
            onClick={() => {toggleTab('converted');}}
          >
            <span className="d-sm-block">Rewards Converted</span>
          </NavLink>
        </NavItem>
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'rewards' ? "active": ""}
            onClick={() => {toggleTab('rewards');}}
          >
            <span className="d-sm-block">Rewards Transactions</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="p-3 text-muted">
        <TabPane tabId="rewards">
          <Container fluid>
            <div className="headerFilterBox">
              <SearchInput onChange={handleChange} />
            </div>
            <div className="investor-background">
              <DatatableTables 
                column={RewardTxnsColumn} 
                paginationConfig={paginationConfig}
                paging={false} 
                row={commonData?.rewardsList?.isLoading ? "loading" : commonData?.rewardsList?.dataObj?.data}
              />
            </div>
          </Container>
        </TabPane>
        <TabPane tabId="converted">
          <Container fluid>
            <div className="headerFilterBox">
                <DatePicker
                  selectsRange="true"
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Date Range Filter"
                  onChange={(update) => {setDateRange(update);}}
                  isClearable="false"
                />
                <SearchInput onChange={handleChange} />
            </div>
            <div className="investor-background">
              <DatatableTables 
                column={ReferralTxnsColumn} 
                row={commonData?.convertedReferralList?.isLoading ? "loading" : commonData?.convertedReferralList?.dataObj?.transactions}
                paginationConfig={paginationConfig}
                paging={false} 
              />
            </div>
          </Container>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ReferralTransactions;
