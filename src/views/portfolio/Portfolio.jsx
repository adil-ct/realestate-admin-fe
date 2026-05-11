/* eslint-disable no-underscore-dangle */
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

import { Card, CardBody, Col, Container, Row } from 'reactstrap';

import { getPortfolioSummery, getWalletBalance, commonSaga } from 'store/actions';
import PropertiesManagementCard from 'components/card/PropertiesManagementCard';
import { NavigationLabel } from 'components/Table/tableComponents';
import { portfolioColumn } from 'constants/tableColumn';
import CurrencyFormat from 'components/CurrencyFormat';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';
import '../viewcommon.css';

const Portfolio = () => {
  const dispatch = useDispatch();
  const {portfolioSummery} = useSelector(state => state.portfolio);
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));
  const { walletBalance } = useSelector(state => state.account);

  const [filter, setFilter] = useState({ page: 1, limit: 10, search: '' });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [count, setCount] = useState('');
 
  const action = ind => <ActionCell vote id={ind} />;

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  useEffect(() => {
    dispatch(getPortfolioSummery());
    dispatch(getWalletBalance());
  }, []);
  
  const getList = (query) => {
    dispatch(commonSaga({endPoint: `/admin/list-assets?${query}`, type: "get", stateObj: "portfolioList"}));
  }

  useEffect(() => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== "all")
      .map(item => `${item}=${filter[item]}`)
      .join('&');

      getList(query);
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    const reportsData = [
      {
        id: 1,
        title: 'Rental Income',
        value: portfolioSummery?.rentalIncome || '-',
      },
      /* {
        id: 2,
        title: 'Appreciation',
        value: portfolioSummery?.growthPercentage || '-',
      }, */
      {
        id: 3,
        title: 'Total Return',
        value: portfolioSummery?.totalReturn || '-',
      },
      {
        id: 4,
        title: 'Next Payout',
        value: portfolioSummery?.nextPayout || 'N/A',
        icon:' uil-clock-three fa-3x'
      },
    ];
    setReports(reportsData);
  }, [portfolioSummery]);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page}));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };
  /* Pagination Config */

  useEffect(() => {
    if (commonData?.portfolioList?.dataObj?.items?.length) {
      commonData?.portfolioList?.dataObj?.items?.forEach(ele => {
        const obj = ele;
        obj.action = action(ele?._property);
        obj.title = NavigationLabel({title: ele?.title, link: `/portfolio-property/${ele?._property}`});
        obj.balance = CurrencyFormat({value: (ele?.currentPrice*ele?.tokens), prefix: "$"});
        obj.tokensSoldPercentage = `${Number(((ele?.tokens * ele?.currentPrice) / portfolioSummery?.portfolioValue)*100).toFixed(2)} %`
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.portfolioList?.dataObj?.totalItems / filter?.limit),
        count,
        itemCount: commonData?.portfolioList?.dataObj?.totalItems,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [commonData?.portfolioList, portfolioSummery?.portfolioValue]);

  return (
    <div className="page-content">
      <div className="walletBalanceBox">
        <Breadcrumb name="My Portfolio" />
        {walletBalance?.balance && <span>Wallet Balance: {CurrencyFormat({value: walletBalance?.balance, prefix: "$"})}</span>}
      </div>
      <Container fluid>
        <Row>
          <Col xl={3}>
            <PropertiesManagementCard name="Portfolio Value" score={CurrencyFormat({value: portfolioSummery?.portfolioValue, prefix: "$"})} />
          </Col>
          <Col xl={9}>
              <Card >
                <CardBody className="card-body-card">
                  {reports?.map((item,ind) => (
                    <div key={ind} className="property-management-card">
                      <div className="property-management-card-details mright-1">
                        <h5 className="text-muted">{item.title}</h5>
                        <h4>{item.value}</h4>
                      </div>
                      {/* <i className={item.icon || " uil-usd-circle fa-3x"} /> */}
                    </div>
                  ))}
                </CardBody>
              </Card>
          </Col>
        </Row>
        <div className="investor-background">
          <div className="investor-maincontainer">
            <div />
            <div className="d-flex">
              <SearchInput onChange={handleChange} />
            </div>
          </div>
          <DatatableTables  
            row={commonData?.portfolioList?.isLoading ? "loading" : commonData?.portfolioList?.dataObj?.items}
            column={portfolioColumn}
            paginationConfig={paginationConfig}
            paging={false} 
          />
        </div>
      </Container>
    </div>
  );
};

export default Portfolio;
