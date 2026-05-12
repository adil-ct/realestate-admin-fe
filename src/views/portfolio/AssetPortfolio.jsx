import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  NavItem,
  TabPane,
  TabContent,
  Nav,
  NavLink,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import Breadcrumb from 'components/BreadCrumb';
import { AssetPortfolioColumn, RentTxnsColumn, PropertyTxnsColumn } from 'constants/tableColumn';
import PropertiesManagementCard from 'components/card/PropertiesManagementCard';
import { getAssetsSummery, getPropertyTxns, commonSaga } from 'store/actions';
import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import CashflowTxnDetails from 'components/UI/Model/cashflowTxnDetails';
import { NavigationLabel } from 'components/Table/tableComponents';
import CurrencyFormat from 'components/CurrencyFormat';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import ActionCell from 'components/ActionButton';
import avatar from 'assets/images/avatar.jpg';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';

const AssetPortfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    txnType: '',
    startDate: '',
    endDate: '',
  });
  const [cfTxnModalData, setCfTxnModalData] = useState({ show: false, data: {} });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [activeTab, setActiveTab] = useState('token');
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [count, setCount] = useState('');
  const [startDate, endDate] = dateRange;

  const { assetsSummery, propertyTxns, isLoading } = useSelector(state => state.portfolio);
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  useEffect(() => {
    dispatch(getAssetsSummery({ id }));
  }, []);

  const getRentTxnList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(
      commonSaga({
        endPoint: `/cashflow/rent-transaction/${id}?${query}`,
        type: 'get',
        stateObj: 'rentTxnsList',
      }),
    );
  };

  const getReserveTxnsList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(
      commonSaga({
        endPoint: `/marketplace/reserves-transactions/${id}?${query}`,
        type: 'get',
        stateObj: 'reserveTxnsList',
        baseEP: 'MARKETPLACE',
      }),
    );
  };

  useEffect(() => {
    if (activeTab === 'rent') {
      getRentTxnList();
    } else if (activeTab === 'property') {
      getReserveTxnsList();
    }
  }, [activeTab]);

  const getList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(getPropertyTxns({ id: `${id}?${query}` }));
  };

  const handleSearch = val => {
    setFilter(prev => ({ ...prev, search: val, page: 1 }));
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      setFilter(prev => ({
        ...prev,
        startDate: new Date(dateRange[0]).toISOString(),
        endDate: new Date(dateRange[1]).toISOString(),
      }));
    } else {
      setFilter(prev => ({ ...prev, startDate: '', endDate: '' }));
    }
  }, [dateRange]);

  useEffect(() => {
    if (activeTab === 'rent') {
      getRentTxnList();
    } else if (activeTab === 'property') {
      getReserveTxnsList();
    } else {
      getList();
    }
  }, [JSON.stringify(filter)]);

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
    const reportsData = [
      {
        id: 2,
        title: 'Appreciation',
        value: assetsSummery?.appreciation || '-',
      },
      {
        id: 3,
        title: 'Total Rental Income',
        value: assetsSummery?.rentalIncome || '-',
      },
      {
        id: 4,
        title: 'Next Payout',
        value: moment(new Date(assetsSummery?.nextPayout)).format('lll') || 'N/A',
        icon: ' uil-clock-three fa-3x',
      },
    ];
    setReports(reportsData);
  }, [assetsSummery]);

  useEffect(() => {
    if (propertyTxns?.items?.length) {
      propertyTxns?.items?.forEach(ele => {
        const obj = ele;
        const txnHash =
          obj?.transactionHash &&
          typeof obj?.transactionHash === 'string' &&
          `${obj?.transactionHash?.substr(0, 6)}......
        ${obj?.transactionHash?.substr(obj?.transactionHash?.length - 4, obj?.transactionHash?.length)}`;

        obj.createdAt = moment(new Date(obj?.createdAt)).format('lll');
        obj.transactionHash = NavigationLabel({
          title: txnHash,
          link: `${process.env.REACT_APP_POLYGON_URL}${ele?.transactionHash}`,
          external: true,
        });
        const priceTemp = Number(obj?.tokens) * Number(obj?.price);
        obj.alterPrice = `$${Number(priceTemp)}`;

        obj.tokens =
          `${obj?.tokens?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ($${Number(obj?.price).toFixed(2)})` ||
          '-';
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(propertyTxns?.totalItems / filter?.limit),
        count,
        itemCount: propertyTxns?.totalItems,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [propertyTxns]);

  const rentTxnDeatils = item => {
    setCfTxnModalData({ show: true, data: item });
  };

  useEffect(() => {
    if (commonData?.rentTxnsList?.dataObj?.data) {
      commonData?.rentTxnsList?.dataObj?.data?.forEach(ele => {
        const obj = ele;
        obj.createdAt = moment(new Date(obj?.updatedAt)).format('lll');
        obj.action = <ActionCell view={() => rentTxnDeatils(obj)} id={obj?._id} />;
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.rentTxnsList?.dataObj?.totalCount / filter?.limit),
        count,
        itemCount: commonData?.rentTxnsList?.dataObj?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [commonData?.rentTxnsList?.dataObj?.data]);

  useEffect(() => {
    if (commonData?.reserveTxnsList?.dataObj) {
      commonData?.reserveTxnsList?.dataObj?.forEach(ele => {
        const obj = ele;
        obj.price =
          `${Number(obj?.amount)
            ?.toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` || '-';
        obj.date = moment(new Date(obj?.updatedAt)).format('lll');
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.reserveTxnsList?.dataObj?.totalCount / filter?.limit),
        count,
        itemCount: commonData?.reserveTxnsList?.dataObj?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [commonData?.reserveTxnsList?.dataObj]);

  const viewProposals = () => navigate(`/property-proposals/${id}`);

  const viewProperties = () => {
    window.open(
      `https://dev-mvp-investor-react.investwithmogul.com/property-profile/${id}`,
      '_blank',
    );
  };

  const handleTxnType = val => {
    setFilter(prev => ({ ...prev, txnType: val }));
  };

  const toggleTab = flag => {
    if (activeTab !== flag) {
      setActiveTab(flag);
    }
  };

  return (
    <div className="page-content">
      <Breadcrumb items={[{ name: 'My Portfolio', link: '/portfolio' }, { name: 'Property' }]} />

      <Container fluid>
        {/* <Row> */}
        <Card>
          <CardBody className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div>
                <img
                  src={assetsSummery?.property?.mainImage?.url || avatar}
                  alt=""
                  className="avatar-md rounded-circle img-thumbnail me-3"
                />
              </div>
              <div>
                <div>
                  <h5>{assetsSummery?.property?.title}</h5>
                  <i>
                    {assetsSummery?.property?.city}, {assetsSummery?.property?.state}
                  </i>
                  <div>
                    <span>
                      Blockchain address :
                      <a
                        rel="noreferrer"
                        href={`https://amoy.polygonscan.com/tx/${assetsSummery?.tokenContractAddress}`}
                        target="_blank"
                      >
                        {' '}
                        {assetsSummery?.tokenContractAddress}
                      </a>
                    </span>
                    <span>
                      {' '}
                      | Token Id :
                      <a
                        rel="noreferrer"
                        href={`https://amoy.polygonscan.com/token/${assetsSummery?.tokenContractAddress}?a=${assetsSummery?.property?.tokenId}`}
                        target="_blank"
                      >
                        {' '}
                        {assetsSummery?.property?.tokenId}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex button-header">
              <Button className="button-color w-100">Sell</Button>
              <Button className="button-color ms-2 w-100" onClick={viewProperties}>
                View Property
              </Button>
              <Button className="ms-2 button-color w-100" onClick={viewProposals}>
                View Proposals
              </Button>
            </div>
          </CardBody>
        </Card>
        {/* </Row> */}
        <Row>
          <Col xl="2">
            <PropertiesManagementCard
              name="Asset Value"
              score={CurrencyFormat({ value: assetsSummery?.property?.assetValue, prefix: '$' })}
            />
          </Col>
          <Col xl="2">
            <PropertiesManagementCard
              name="My Holdings"
              score={CurrencyFormat({ value: assetsSummery?.assetValue, prefix: '$' })}
            />
          </Col>
          <Col xl={8}>
            <Card>
              <CardBody className="card-body-card">
                {reports.map(item => (
                  <div className="property-management-card" key={item.title}>
                    <div className="property-management-card-details mright-1">
                      <h5 className="text-muted">{item.title}</h5>
                      <h4>{item.value}</h4>
                    </div>
                    {/* <i className={item.icon || ' uil-usd-circle fa-3x'} /> */}
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Nav pills className="nav-justified bg-light p-2 portfolioNav">
          <NavItem className="waves-effect waves-light">
            <NavLink
              className={activeTab === 'token' ? 'active' : ''}
              onClick={() => {
                toggleTab('token');
              }}
            >
              <span className="d-sm-block">Token Transactions</span>
            </NavLink>
          </NavItem>
          <NavItem className="waves-effect waves-light">
            <NavLink
              className={activeTab === 'rent' ? 'active' : ''}
              onClick={() => {
                toggleTab('rent');
              }}
            >
              <span className="d-sm-block">Rent Transactions</span>
            </NavLink>
          </NavItem>
          <NavItem className="waves-effect waves-light">
            <NavLink
              className={activeTab === 'property' ? 'active' : ''}
              onClick={() => {
                toggleTab('property');
              }}
            >
              <span className="d-sm-block">Property Transactions</span>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} className="p-3 text-muted">
          <TabPane tabId="token">
            <div className="investor-background">
              <div className="investor-maincontainer align-items-center">
                <div className="d-flex">
                  <ButtonDropDown
                    title="Txn Type"
                    options={['Buy', 'Sell']}
                    name="txnType"
                    onClick={handleTxnType}
                    className="mright-1"
                  />
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
                <div className="d-flex justify-content-between">
                  <SearchInput onChange={handleSearch} />
                </div>
              </div>

              <DatatableTables
                row={isLoading ? 'loading' : propertyTxns?.items}
                column={AssetPortfolioColumn}
                paging={false}
                paginationConfig={paginationConfig}
              />
            </div>
          </TabPane>
          <TabPane tabId="rent">
            <div className="investor-background">
              <DatatableTables
                row={
                  commonData?.rentTxnsList?.isLoading
                    ? 'loading'
                    : commonData?.rentTxnsList?.dataObj?.data
                }
                column={RentTxnsColumn}
                paging={false}
                paginationConfig={paginationConfig}
              />
            </div>
          </TabPane>
          <TabPane tabId="property">
            <div className="investor-background">
              <DatatableTables
                row={
                  commonData?.reserveTxnsList?.isLoading
                    ? 'loading'
                    : commonData?.reserveTxnsList?.dataObj
                }
                column={PropertyTxnsColumn}
                paging={false}
                paginationConfig={paginationConfig}
              />
            </div>
          </TabPane>
        </TabContent>
        <CashflowTxnDetails
          isOpen={cfTxnModalData?.show}
          onClose={setCfTxnModalData}
          data={cfTxnModalData?.data}
        />
      </Container>
    </div>
  );
};

export default AssetPortfolio;
