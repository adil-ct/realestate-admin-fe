import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardBody, Container, Row } from 'reactstrap';
import moment from 'moment';

import { promotionTransactionColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import Breadcrumb from 'components/BreadCrumb';
import { getEarlyInvestor } from 'store/actions';

import '../viewcommon.css';

const UserPromotionTransaction = () => {
  const dispatch = useDispatch();
  const { promoCode, userId } = useParams();
  const location = useLocation();
  const { promotionTransaction, loading } = useSelector(state => state.user);

  const [filter, setFilter] = useState({
    startIndex: 1,
    itemsPerPage: 10,
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [refreeTransaction, setRefreeTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [breadcrumb, setBreadcrumb] = useState([]);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, startIndex: page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  useEffect(() => {
    if (promotionTransaction?.data?.length) {
      const detail = promotionTransaction?.data?.map(item => ({
        createdAt: moment(item?.createdAt).format('lll') || '--',
        propertyName: item?.propertyName || '--',
        amount: `$ ${Number(item?.amount?.amount - item?.fees?.amount).toFixed(2)}` || '--',
        token: item?.holdTokens || '--',
        status: item?.status || '--',
      }));

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(promotionTransaction?.totalCount / 10),
        count,
        itemCount: promotionTransaction?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
      setRefreeTransaction(detail);
    } else setRefreeTransaction([]);
  }, [promotionTransaction]);

  const getRefreeTransaction = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(
      dispatch(
        getEarlyInvestor({
          list: `payment/promotion-user-transactions`,
          field: 'promotionTransaction',
          query: `userId=${userId}&promoCode=${promoCode}&${query}`,
        }),
      ),
    );
  };

  useEffect(() => {
    getRefreeTransaction();
  }, [filter]);

  useEffect(() => {
    setBreadcrumb([
      {
        name: 'Promotions',
        link: '/promotions',
      },
      {
        name: 'Promotion Details',
        link: `/promotions/TESTPROMO1`,
      },
      { name: 'Promotion Transactions' },
    ]);
  }, []);

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb items={breadcrumb} />
      </div>

      <Container fluid>
        <Row>
          <Card>
            <h4 className="mx-4 mt-3">{location?.state} Promotion Transactions</h4>
            <div className="flexCenter">
              <CardBody>
                <DatatableTables
                  paginationConfig={paginationConfig}
                  paging={false}
                  column={promotionTransactionColumn}
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

export default UserPromotionTransaction;
