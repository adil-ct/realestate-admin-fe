import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';

import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import {refreeTransactionColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import Breadcrumb from 'components/BreadCrumb';
import { getEarlyInvestor } from 'store/actions';

import '../viewcommon.css';

const TransactionDetail = () => {
  const { refreeTransactions, loading } = useSelector(state => state.user);
  const [filter, setFilter] = useState({
    startIndex: 1,
    itemsPerPage: 10,
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [refreeTransaction, setRefreeTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [breadcrum, setBreadcrum] = useState([]);

  const dispatch = useDispatch();
  const { referralId, refreeId } = useParams();

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, startIndex: page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  useEffect(() => {
    if (refreeTransactions?.transactions?.length) {
      const detail = refreeTransactions?.transactions?.map(item => ({
        propertyName: item?.propertyName || '--',
        createdAt: moment(item?.createdAt).format("lll") || '--',
        amount: `$ ${Number(item?.amount?.amount - item?.fees?.amount).toFixed(2)}` || '--',
      }));

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(refreeTransactions?.totalItems / 10),
        count,
        itemCount: refreeTransactions?.totalItems,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
      setRefreeTransaction(detail);      
    } else setRefreeTransaction([]);
  }, [refreeTransactions]);

  const getRefreeTransaction = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(
      getEarlyInvestor({
        list: `user/referee-transactions/${refreeId}`,
        field: 'refreeTransactions',
        query: `referralId=${referralId}&${query}`,
      }),
    );
  };

  useEffect(() => {
    getRefreeTransaction();
  }, [filter]);

  const exportHandler = val => {
    const flag = val === 'CSV' ? 'toCsv' : 'toXls';
    setFilter(prev => ({ ...prev, sendData: flag }));
    toast.success('Statement has been sent to your linked email.');
  };
  
  useEffect(() => {
    setBreadcrum([
      {
        name: 'Investor Relations',
        link: '/investor-relations',
      },
      {
        name: 'View User',
        link: `/investor-relations/${referralId}`,
      },    
      { name: "Referee Transactions" },
    ]);
  }, []);

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb items={breadcrum} />
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

      <Container fluid>
        <Row>
          <Card>
            <h4 className="mx-4 mt-3">Referee Transactions</h4>
            <div className="flexCenter">
              <CardBody>
                <DatatableTables
                  paginationConfig={paginationConfig}
                  paging={false}
                  column={refreeTransactionColumn}
                  row={loading ? 'loading' : refreeTransaction}
                />
              </CardBody>
            </div>
          </Card>
        </Row>
      </Container>
    </div>
  );
};

export default TransactionDetail;
