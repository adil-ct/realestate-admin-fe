import React, { useState, useEffect } from 'react';
import { Container, Button, TabContent, NavItem, Nav, TabPane, NavLink, Input, FormGroup} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { cashflowColumn, cashflowTxnColumn, cashflowTxnHistoryColumn } from 'constants/tableColumn';
import CashflowTxnDetails from 'components/UI/Model/cashflowTxnDetails';
import AddCashFlowCycle from 'components/UI/Model/addCashFlowCycle';
import { getPropertyList, commonSaga } from 'store/actions';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';

import '../viewcommon.css';
import 'react-datepicker/dist/react-datepicker.css';

const Cashflow = () => {
  const dispatch = useDispatch();
  const { propertyList } = useSelector(state => state.property);
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    propertyId: '',
    status: '',
    search: '',
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');

  const [cfModal, setCfModal] = useState({ show: false, data: {} });
  const [cfTxnModalData, setCfTxnModalData] = useState({ show: false, data: {} });
  const [modalType, setModalType] = useState(true);
  const [activeTab, setActiveTab] = useState('cycle');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (commonData?.createRental?.dataSaved || commonData?.updateRental?.dataUpdated) {
      setCfModal({ show: false, data: {} });
      setModalType('create');
    }
  }, [commonData?.createRental, commonData?.updateRental]);

  const getList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    if (activeTab === 'cycle') {
      dispatch(
        commonSaga({
          endPoint: `/cashflow/rental-period?${query}`,
          type: 'get',
          stateObj: 'rentalPeriodList',
        }),
      );
    } else if (activeTab === 'history') {
      dispatch(
        commonSaga({
          endPoint: `/cashflow/rent-transactions?${query}`,
          type: 'get',
          stateObj: 'cashflowRentHistoryList',
        }),
      );
    } else if (activeTab === 'txn') {
      dispatch(
        commonSaga({
          endPoint: `/cashflow/cashflow-transaction?${query}`,
          type: 'get',
          stateObj: 'rentalTxnsList',
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(getPropertyList('itemsPerPage=100&status=OnSale'));
  }, []);

  useEffect(() => {
    getList();
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    const defaultFilter = {
      page: 1,
      limit: 10,
      startDate: '',
      endDate: '',
      propertyId: '',
      status: '',
    };
    if (JSON.stringify(filter) === JSON.stringify(defaultFilter)) {
      getList();
    } else {
      setFilter(defaultFilter);
    }
  }, [activeTab,cfModal.show]);

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

  const handleView = item => {
    setCfTxnModalData({ show: true, data: item });
  };

  const cfCycleDetails = (item, flag) => {
    setModalType(flag);
    setCfModal({ show: true, data: item });
  };

  const initiateTransfer = () => {
    setModalType('create');
    setCfModal({ show: true, data: {} });
  };

  const toggleTab = flag => {
    if (activeTab !== flag) {
      setActiveTab(flag);
    }
  };

  const onPropertyChange = e => {
    setFilter(prev => ({ ...prev, propertyId: e.target.value }));
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      setFilter(prev => ({
        ...prev,
        startDate: moment(new Date(dateRange[0])).format('YYYY-MM-DD'),
        endDate: moment(new Date(dateRange[1])).format('YYYY-MM-DD'),
      }));
    } else {
      setFilter(prev => ({ ...prev, startDate: '', endDate: '' }));
    }
  }, [dateRange]);

  useEffect(() => {
    if (commonData?.rentalPeriodList?.dataObj?.data?.length) {
      commonData?.rentalPeriodList?.dataObj?.data?.forEach(ele => {
        const obj = ele;
        obj.endDate = moment(new Date(obj?.nextPayout)).format('lll');
        obj.propertyManager = obj?.propertyManager || '-';
        obj.alterMonthlyRentAmount =
          `$${Number(obj?.monthlyRentAmount)
            ?.toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` || '-';
        obj.action = (
          <ActionCell
            view={() => cfCycleDetails(obj, 'view')}
            edit={() => cfCycleDetails(obj, 'edit')}
            id={obj?._id}
          />
        );
      });
    }

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(commonData?.rentalPeriodList?.dataObj?.totalCount / filter?.limit),
      count,
      itemCount: commonData?.rentalPeriodList?.dataObj?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.rentalPeriodList]);

  useEffect(() => {
    if (commonData?.rentalTxnsList?.dataObj?.data?.length) {
      commonData?.rentalTxnsList?.dataObj?.data?.forEach(ele => {
        const obj = ele;
        obj.endDate = moment(new Date(obj?.endDate)).format('lll');
        obj.rentAmount =
          `$${obj?.rentAmount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` || '-';
        obj.action = <ActionCell view={() => handleView(obj)} id={obj?._id} />;
      });
    }

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(commonData?.rentalTxnsList?.dataObj?.totalCount / filter?.limit),
      count,
      itemCount: commonData?.rentalTxnsList?.dataObj?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.rentalTxnsList]);

  useEffect(() => {
    if (commonData?.cashflowRentHistoryList?.dataObj?.data?.length) {
      commonData?.cashflowRentHistoryList?.dataObj?.data?.forEach(ele => {
        const obj = ele;
        obj.timestamp = moment(new Date(obj?.updatedAt)).format('lll');
        obj.action = <ActionCell view={() => handleView(obj)} id={obj?._id} />;
      });
    }
    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(
        commonData?.cashflowRentHistoryList?.dataObj?.totalCount / filter?.limit,
      ),
      count,
      itemCount: commonData?.cashflowRentHistoryList?.dataObj?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.cashflowRentHistoryList]);

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="Cashflow" />
        <Button className="button-color mx-2" onClick={initiateTransfer}>
          Add Cashflow Cycle
        </Button>
      </div>

      <Nav pills className="nav-justified bg-light p-2 portfolioNav">
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'txn' ? 'active' : ''}
            onClick={() => {
              toggleTab('txn');
            }}
          >
            <span className="d-sm-block">Cashflow Transactions</span>
          </NavLink>
        </NavItem>
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'cycle' ? 'active' : ''}
            onClick={() => {
              toggleTab('cycle');
            }}
          >
            <span className="d-sm-block">Cashflow Cycle</span>
          </NavLink>
        </NavItem>
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => {
              toggleTab('history');
            }}
          >
            <span className="d-sm-block">Rent Transactions History</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="p-3 text-muted">
        <TabPane tabId="cycle">
          <Container fluid>
            <div className="headerFilterBox">
              <div>
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
              <div>             
                <FormGroup>
                  <Input
                    type="select"
                    name="propertyId"
                    id="propertyId"
                    className="form-select filterDD"
                    onChange={e => onPropertyChange(e)}
                  >
                    <option value="all">All</option>
                    {propertyList?.map(option => (
                      <option key={option?._id} value={option?._id}>
                        {option?.otherInfo?.title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>
            <div className="investor-background">
              <DatatableTables
                column={cashflowColumn}
                paginationConfig={paginationConfig}
                paging={false}
                row={
                  commonData?.rentalPeriodList?.isLoading
                    ? 'loading'
                    : commonData?.rentalPeriodList?.dataObj?.data
                }
              />
            </div>
          </Container>
        </TabPane>
        <TabPane tabId="txn">
          <Container fluid>
            <div className="headerFilterBox">
              <div>
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
              <div>               
                <FormGroup className="headerFilterBox m0">
                  <Input
                    type="select"
                    name="flag"
                    className="filterDD"
                    onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">Status</option>
                    <option value="pending">Pending</option>
                    <option value="done">Done</option>
                  </Input>
                  <Input
                    type="select"
                    name="propertyId"
                    className="filterDD"
                    onChange={e => setFilter(prev => ({ ...prev, propertyId: e.target.value }))}
                  >
                    <option value="all">All</option>
                    {propertyList?.map((option,ind) => (
                      <option key={ind} value={option?._id}>{option?.otherInfo?.title}</option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>
            <div className="investor-background">
              <DatatableTables
                column={cashflowTxnColumn}
                row={
                  commonData?.rentalTxnsList?.isLoading
                    ? 'loading'
                    : commonData?.rentalTxnsList?.dataObj?.data
                }
                paginationConfig={paginationConfig}
                paging={false}
              />
            </div>
          </Container>
        </TabPane>
        <TabPane tabId="history">
          <Container fluid>
            <div className="headerFilterBox">
              <SearchInput onChange={handleChange} />
            </div>
            <div className="investor-background">
              <DatatableTables
                column={cashflowTxnHistoryColumn}
                row={
                  commonData?.cashflowRentHistoryList?.isLoading
                    ? 'loading'
                    : commonData?.cashflowRentHistoryList?.dataObj?.data
                }
                paginationConfig={paginationConfig}
                paging={false}
              />
            </div>
          </Container>
        </TabPane>
      </TabContent>
      <AddCashFlowCycle
        modalType={modalType}
        setModalType={setModalType}
        isOpen={cfModal?.show}
        onClose={setCfModal}
        data={cfModal?.data}
      />
      <CashflowTxnDetails
        isOpen={cfTxnModalData?.show}
        onClose={setCfTxnModalData}
        data={cfTxnModalData?.data}
      />
    </div>
  );
};

export default Cashflow;
