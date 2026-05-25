/* eslint-disable react/self-closing-comp */
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

import { RefereeDetailsColumn } from 'constants/columnUtility';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import { commonSaga, getEarlyInvestor } from 'store/actions';
import ActionCell from 'components/ActionButton';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { Copy } from 'assets/images';

import './investorRelation.css';

const InvestorRelationDetail = () => {
  const dispatch = useDispatch();

  const { userDetailsObj } = useSelector(state => state.common);
  const { investorRelationDetail, loading } = useSelector(state => state.user);

  const [breadcrum, setBreadcrum] = useState([]);
  const [filter, setFilter] = useState({
    startIndex: 1,
    itemsPerPage: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [paginationConfig, setPaginationConfig] = useState({});
  const [refreeDetails, setRefreeDetails] = useState({});

  const { referralId } = useParams();
  const navigate = useNavigate();

  const { copy: referralIDCopy, tooltipText: referralIDText } = useCopyToClipboard();
  const { copy: referralLinkCopy, tooltipText: referralLinkText } = useCopyToClipboard();

  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  const handleView = item => navigate(`/referrals-transactions/${item?.refereeId}/${referralId}`);

  useEffect(() => {
    if (investorRelationDetail?.result.length) {
      const refreeDetail = investorRelationDetail?.result?.map(item => ({
        name: item?.name || '--',
        email: item?.email || '--',
        mobileNumber: item?.mobileNumber || '--',
        kycStatus: item?.kycStatus || '--',
        amountSettled: `$ ${item?.amountSettled?.toFixed(2) || '0.00'}` || '--',
        action: <ActionCell view={handleView} id={item} />,
      }));

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(investorRelationDetail?.totalCount / filter?.itemsPerPage),
        count,
        itemCount: investorRelationDetail?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
      setRefreeDetails(refreeDetail);
    } else setRefreeDetails([]);
  }, [investorRelationDetail]);

  useEffect(() => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(
      getEarlyInvestor({
        list: `user/refereeList`,
        field: 'investorRelationDetail',
        query: `userId=${referralId}&${query}`,
        baseEP: 'USER',
      }),
    );
  }, [filter]);

  useEffect(() => {
    setBreadcrum([
      {
        name: 'Investor Relations',
        link: '/investor-relations',
      },
      { name: 'View User' },
    ]);

    dispatch(
      commonSaga({
        endPoint: `/admin/getInvestor/${referralId}`,
        type: 'get',
        stateObj: 'userDetailsObj',
      }),
    );
  }, []);

  const userFirstName = userDetailsObj?.dataObj?.user?.firstName || '-';
  const userLastName = userDetailsObj?.dataObj?.user?.lastName || '-';

  const dashboardTitle =
    userDetailsObj && userDetailsObj?.isLoading
      ? 'Loading IR Dashboard...'
      : `${userFirstName} ${userLastName}'s IR Dashboard`;

  return (
    <div className="page-content">
      <Row>
        <Col md={10} xs={10}>
          <Breadcrumb items={breadcrum} />
        </Col>
      </Row>
      <Container fluid>
        <Row>
          <Card>
            <h4 className="mx-4 mt-3">{dashboardTitle}</h4>
            <div className="flexCenter dashboard_body">
              <CardBody className="d-flex flex-wrap">
                <div className="flex-20">
                  <div className="dashboard_head">Bricklane IR Code</div>
                  {loading ? (
                    <div className="skeleton-loader"></div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Tooltip
                        className="cursor-pointer"
                        enterTouchDelay={0}
                        title={referralIDText === 'Copy' ? '' : referralIDText}
                      >
                        <img
                          src={Copy}
                          onClick={() =>
                            referralIDCopy(
                              investorRelationDetail?.referralCodeDetails?.referralCode,
                            )
                          }
                          alt="copy"
                        />
                      </Tooltip>
                      <div>{investorRelationDetail?.referralCodeDetails?.referralCode}</div>
                    </div>
                  )}
                </div>
                <div className="flex-20">
                  <div className="dashboard_head">Bricklane IR Link</div>
                  {loading ? (
                    <div className="skeleton-loader"></div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Tooltip
                        className="cursor-pointer"
                        enterTouchDelay={0}
                        title={referralLinkText === 'Copy' ? '' : referralLinkText}
                      >
                        <img
                          src={Copy}
                          onClick={() =>
                            referralLinkCopy(userDetailsObj?.dataObj?.user?.referralSharingLink)
                          }
                          alt="copy"
                        />
                      </Tooltip>
                      <div>
                        {userDetailsObj?.dataObj?.user?.referralSharingLink?.length > 15
                          ? `${userDetailsObj?.dataObj?.user?.referralSharingLink?.slice(0, 15)}.....${userDetailsObj?.dataObj?.user?.referralSharingLink?.slice(-4)}`
                          : userDetailsObj?.dataObj?.user?.referralSharingLink}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </div>
            <div className="flexCenter dashboard_body">
              <CardBody className="d-flex flex-wrap">
                <div className="flex-20">
                  <div className="dashboard_head">Dollars Raised</div>
                  {loading ? (
                    <div className="skeleton-loader"></div>
                  ) : (
                    <div>$ {investorRelationDetail?.referralCodeDetails?.dollarsInvested}</div>
                  )}
                </div>
                <div className="flex-20">
                  <div className="dashboard_head">Dollars Earned</div>
                  {loading ? (
                    <div className="skeleton-loader"></div>
                  ) : (
                    <div>$ {investorRelationDetail?.referralCodeDetails?.referralEarnings}</div>
                  )}
                </div>
                <div className="flex-20">
                  <div className="dashboard_head"> moguls Registered</div>
                  {loading ? (
                    <div className="skeleton-loader"></div>
                  ) : (
                    <div> {investorRelationDetail?.referralCodeDetails?.totalReferee ?? 0}</div>
                  )}
                </div>
                <div className="flex-20">
                  <div className="dashboard_head">moguls Invested</div>
                  {loading ? (
                    <div className="skeleton-loader"></div>
                  ) : (
                    <div>
                      {' '}
                      {investorRelationDetail?.referralCodeDetails?.totalRefereeInvested ?? 0}
                    </div>
                  )}
                </div>
              </CardBody>
            </div>
          </Card>
        </Row>

        <Container fluid>
          <Row>
            <Card>
              <h4 className="mx-4 mt-3">Affiliates/Referral Details List</h4>
              <div className="flexCenter">
                <CardBody>
                  <DatatableTables
                    column={RefereeDetailsColumn}
                    row={loading ? 'loading' : refreeDetails}
                    paging={false}
                    paginationConfig={paginationConfig}
                  />
                </CardBody>
              </div>
            </Card>
          </Row>
        </Container>
      </Container>
    </div>
  );
};
export default InvestorRelationDetail;
