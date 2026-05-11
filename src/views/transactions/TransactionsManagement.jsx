/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import moment from 'moment';

import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import InitiateTransfer from 'components/UI/Model/InitiateTransfer';
import { TxnsManagementColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import MultiSelect from 'components/MultiSelect';
import Breadcrumb from 'components/BreadCrumb';
import { commonSaga } from 'store/actions';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';

const TransactionsManagement = () => {
  const dispatch = useDispatch();
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));
  // const { userData } = useSelector(state => state.user);
  const [transactionRow, setTransactionRow] = useState([]);

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    status: 'Status',
    txnType: 'Transaction Type',
    startDate: '',
    endDate: '',
    search: '',
    sendData: '',
    sortBy: '',
    sortKey: '',
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  // const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [iFModal, setIFModal] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // useEffect(() => {
  //   if (userData?.isSuperAdmin) {
  //     setIsSuperAdmin(true);
  //   }
  // }, [userData]);

  const _getTxnList = () => {
    const query = Object.keys(filter)
      .filter(
        item =>
          filter[item] !== undefined &&
          filter[item] !== '' &&
          filter[item] !== 'Transaction Type' &&
          filter[item] !== 'Status',
      )
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(
      commonSaga({
        endPoint: `/payment/platform-transactions?${query}`,
        type: 'get',
        stateObj: 'transactionsList',
        baseEP: 'PAYMENT',
      }),
    );
  };

  useEffect(() => {
    _getTxnList();
  }, [JSON.stringify(filter)]);

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

  const onPageChange = page => setFilter(prev => ({ ...prev, page }));

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  useEffect(() => {
    if (commonData?.transactionsList?.dataObj?.data?.length) {
      const rows = commonData?.transactionsList?.dataObj?.data?.map(ele => {
        const obj = ele;
        obj.updatedAt = moment(new Date(obj.updatedAt)).format('lll');
        obj.amount =
          `$${Number(obj?.amount)
            ?.toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` || '-';
        obj.transactionHash =
          obj.transactionType === 'marketplace' && typeof obj?.transactionHash === 'string' ? (
            <a
              rel="noreferrer"
              href={`${process.env.REACT_APP_POLYGON_URL}${obj?.transactionHash}`}
              target="_blank"
            >
              {`${obj?.transactionHash?.slice(0, 4)}......${obj?.transactionHash?.slice(-4)}`}
            </a>
          ) : (
            <span title={obj?._id}>{`${obj?._id?.slice(0, 4)}......${obj?._id?.slice(-4)}`}</span>
          );
        return obj;
      });
      setTransactionRow(rows);
    }else{
      setTransactionRow([])
    }
    const paginationConfigTemp = {
      currentPage: filter.page,
      pageCount: Math.ceil(commonData?.transactionsList?.dataObj?.totalCount / filter?.limit),
      itemCount: commonData?.transactionsList?.dataObj?.totalCount,
      onPageChange,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.transactionsList?.dataObj]);

  useEffect(() => {
    if (commonData?.createTransferState?.dataObj?.status === 'pending') {
      _getTxnList();
    }
  }, [commonData?.createTransferState]);

  // const initiateTransfer = () => {
  //   setIFModal(true);
  // };

  const handleFilter = (val, name) => {
    setFilter(prev => ({ ...prev, [name]: val }));
  };

  const exportHandler = val => {
    const flag = val === 'CSV' ? 'toCsv' : 'toXls';
    setFilter(prev => ({ ...prev, sendData: flag }));
    toast.success('Statement has been sent to your linked email.');
  };

  const handelSort = sortObj => {
    if (sortObj?.column === 'amount') {
      setFilter(prev => ({
        ...prev,
        sortBy: 'price',
        sortKey: sortObj?.direction === 'desc' ? '-1' : '1',
      }));
    }
  };

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="All Transactions" />
        <div className="dflex">
          {/*           
          {isSuperAdmin && (
            <Button className="button-color mx-2" onClick={initiateTransfer}>
              Initiate Transfer
            </Button>
          )}  */}
          <ButtonDropDown
            className="mx-1"
            title="Export"
            options={['CSV', 'XLS']}
            name="sendData"
            onClick={exportHandler}
            noAll
            staticTitle={true}
          />
        </div>
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
              <MultiSelect
                title="Status"
                selectAll="true"
                options={['completed', 'failed', 'processing', 'pending']}
                name="status"
                className="ml15"
                onSelect={handleFilter}
              />
              {/* <MultiSelect
                title="Transaction Type"
                selectAll="true"
                options={[
                  // 'marketplace',
                  // 'transfers',
                  // 'Deposit',
                  // 'crowdsale_success',
                  // 'Withdrawal',
                  // 'cashflow',
                  // 'rent',
                  'Checkout',
                  'marketplace',
                ]}
                name="txnType"
                className="ml15"
                onSelect={handleFilter}
              /> */}
            </div>
            <SearchInput onChange={handleChange} />
          </div>
          <DatatableTables
            paginationConfig={paginationConfig}
            paging={false}
            column={TxnsManagementColumn}
            handelSort={handelSort}
            row={commonData?.transactionsList?.isLoading ? 'loading' : transactionRow}
          />
        </div>
      </Container>
      <InitiateTransfer isOpen={iFModal} onClose={setIFModal} />
    </div>
  );
};

export default TransactionsManagement;
