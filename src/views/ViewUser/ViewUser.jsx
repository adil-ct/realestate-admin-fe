/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';

import {
  currentManagedPropertyColumn,
  TokensOwnedColumn,
  AffiliatesDetailsColumn,
} from 'constants/columnUtility';
import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import WhiteListModal from 'components/useraction/WhiteListModal';
import BlackListModal from 'components/useraction/BlackListModal';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import { commonSaga } from 'store/actions';

import './ViewUser.css';

const getInitials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?';

const InfoItem = ({ icon, label, value }) => (
  <div className="vu-info-item">
    <span className="vu-info-label">{label}</span>
    <span className="vu-info-value">
      {icon && <i className={icon} />}
      {value || '-'}
    </span>
  </div>
);

const UserProfile = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { commonData } = useSelector((stateObj) => ({ commonData: stateObj.common }));
  const { userData } = useSelector((stateObj) => stateObj.user);

  const [filter, setFilter] = useState({ startIndex: 1, itemsPerPage: 10, startDate: '', endDate: '', propertyId: '', sendData: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [paginationConfig, setPaginationConfig] = useState({});

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isWhite, setWhite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBlack, setBlack] = useState(false);
  const [breadcrum, setBreadcrum] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const via = urlParams.get('via');
  const { id } = useParams();

  useEffect(() => {
    if (userData?.isSuperAdmin) setIsSuperAdmin(true);
  }, [userData]);

  useEffect(() => {
    if (via === 'investor') {
      setBreadcrum([{ name: 'Investors', link: '/investors' }, { name: 'View User' }]);
    } else {
      setBreadcrum([{ name: 'Property Managers', link: '/property-managers' }, { name: 'View User' }]);
    }
    setTimeout(() => {
      dispatch(commonSaga({ endPoint: `/admin/getInvestor/${id}`, type: 'get', stateObj: 'userDetailsObj' }));
    }, 2000);
    return () => localStorage.removeItem('type');
  }, []);

  useEffect(() => {
    if (commonData?.refereeList?.dataObj?.result?.length) {
      commonData.refereeList.dataObj.result.forEach((ele) => {
        const obj = ele;
        obj.registration = moment(new Date(obj?.createdAt)).format('lll');
        obj.investment = obj?.requiredInvestment?.toString() || 0;
        obj.firstDeposit = obj?.firstDeposit ?? '0';
        obj.depositBalance =
          obj?.firstDeposit !== undefined && obj?.depositBalance !== undefined
            ? obj.firstDeposit - obj.depositBalance
            : '0';
      });
    }
  }, [commonData?.refereeList]);

  useEffect(() => {
    if (commonData?.userDetailsObj?.reqCompleted) {
      dispatch(commonSaga({ endPoint: `/payment/balance?userId=${id}`, type: 'get', stateObj: 'investorBalance', baseEP: 'PAYMENT' }));
      if (via !== 'pm') {
        setTimeout(() => {
          dispatch(commonSaga({ endPoint: `/user/refereeList?userId=${id}`, type: 'get', stateObj: 'refereeList', baseEP: 'USER' }));
        }, 2500);
      }
    }
  }, [commonData?.userDetailsObj]);

  const copyToClipboard = (value) => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const blacklist = state?.data?.isActiveUser || false;

  const getList = (query) => {
    if (via === 'pm') {
      dispatch(commonSaga({ endPoint: `/admin/managed-properties/${id}?${query}`, type: 'get', stateObj: 'propertiesManagedList' }));
    } else {
      dispatch(commonSaga({ endPoint: `/admin/investor-tokens/${id}?${query}`, type: 'get', stateObj: 'investorTokensList' }));
    }
  };

  useEffect(() => {
    if (commonData?.propertiesManagedList?.dataObj?.length) {
      commonData.propertiesManagedList.dataObj.forEach((ele) => {
        const obj = ele;
        obj.sDate = moment(new Date(obj?.startDate)).format('lll');
      });
    }
  }, [commonData?.propertiesManagedList]);

  useEffect(() => {
    const query = Object.keys(filter)
      .filter((item) => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map((item) => `${item}=${filter[item]}`)
      .join('&');
    getList(query);
  }, [JSON.stringify(filter)]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    setFilter((prev) => ({ ...prev, page }));
  };
  const updateCurrentCountPage = (page) => setCount(page);

  useEffect(() => {
    if (commonData?.investorTokensList?.dataObj?.items?.length) {
      commonData.investorTokensList.dataObj.items.forEach((ele, index) => {
        const obj = ele;
        obj.srno = index + 1;
        obj.value = `$${obj?.value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` || '-';
        obj.tokensOwned = obj.tokensOwned ? new Intl.NumberFormat().format(obj.tokensOwned) : '-';
      });
      setPaginationConfig({
        currentPage,
        pageCount: Math.ceil(commonData.investorTokensList.dataObj.totalItems / filter.itemsPerPage),
        count,
        itemCount: commonData.investorTokensList.dataObj.totalItems,
        onPageChange,
        updateCurrentCountPage,
      });
    }
  }, [commonData?.investorTokensList]);

  const exportHandler = (val) => {
    const flag = val === 'CSV' ? 'toCsv' : 'toXls';
    setFilter((prev) => ({ ...prev, sendData: flag }));
    toast.success('Statement has been sent to your linked email.');
  };

  const user = commonData?.userDetailsObj?.dataObj?.user || {};
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const walletAddress = user.blockchainAddress || '';
  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null;

  const cityState = [
    user.city ? user.city.charAt(0).toUpperCase() + user.city.slice(1) : '',
    user.stateCode || '',
  ]
    .filter(Boolean)
    .join(', ') || '-';

  return (
    <div className="page-content">
      <Container fluid>
        {/* Breadcrumb + action button row */}
        <Row className="align-items-center mb-3">
          <Col>
            <Breadcrumb items={breadcrum} />
          </Col>
          {isSuperAdmin && (
            <Col xs="auto">
              {!blacklist ? (
                <button className="vu-action-btn vu-btn-blacklist" onClick={() => setBlack(id)}>
                  <i className="fas fa-user-slash" />
                  Blacklist User
                </button>
              ) : (
                <button className="vu-action-btn vu-btn-whitelist" onClick={() => setWhite(id)}>
                  <i className="fas fa-user-check" />
                  Whitelist User
                </button>
              )}
            </Col>
          )}
        </Row>

        {/* Profile card */}
        <div className="vu-profile-card">
          <div className="vu-profile-header">
            <div className="d-flex align-items-center" style={{ gap: '16px' }}>
              <div className="vu-avatar">{getInitials(firstName, lastName)}</div>
              <div>
                <h2 className="vu-name">{firstName} {lastName || '-'}</h2>
                {shortWallet && (
                  <div className="vu-id">
                    <span title={walletAddress}>{shortWallet}</span>
                    {copied ? (
                      <span className="vu-copied"><i className="fas fa-check" /> Copied</span>
                    ) : (
                      <i
                        className="fas fa-clone vu-id-copy"
                        title="Copy wallet address"
                        onClick={() => copyToClipboard(walletAddress)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="vu-info-body">
            <div className="vu-info-grid">
              <InfoItem icon="fas fa-envelope" label="Email" value={user.email} />
              <InfoItem icon="fas fa-mobile-alt" label="Phone"
                value={[user.countryCode, user.mobileNumber].filter(Boolean).join(' ') || '-'} />
              <InfoItem icon="fas fa-birthday-cake" label="Date of Birth"
                value={user.dob ? new Date(user.dob).toLocaleDateString() : '-'} />
              <InfoItem icon="fas fa-calendar-alt" label="Joined"
                value={user.createdAt ? moment(new Date(user.createdAt)).format('lll') : '-'} />
              <InfoItem icon="fas fa-map-marker-alt" label="Location" value={cityState} />
              {via !== 'pm' && (
                <>
                  <InfoItem icon="fas fa-coins" label="Referral Earnings"
                    value={user.referralEarnings ?? 0} />
                  <InfoItem icon="fas fa-users" label="Referred By"
                    value={[
                      commonData?.userDetailsObj?.dataObj?.referredBy?.firstName,
                      commonData?.userDetailsObj?.dataObj?.referredBy?.lastName,
                    ].filter(Boolean).join(' ') || '-'} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Token Owned table */}
        {via === 'investor' && (
          <div className="vu-section">
            <div className="vu-section-header">
              <h4 className="vu-section-title">Tokens Owned</h4>
              {commonData?.investorTokensList?.dataObj?.items?.length > 0 && (
                <ButtonDropDown
                  title="Export"
                  options={['CSV', 'XLS']}
                  name="sendData"
                  onClick={exportHandler}
                  noAll
                />
              )}
            </div>
            <div className="vu-section-body">
              <DatatableTables
                striped
                column={TokensOwnedColumn}
                row={commonData?.investorTokensList?.dataObj?.items}
                paging={false}
                paginationConfig={paginationConfig}
              />
            </div>

            <div className="vu-section-header" style={{ borderTop: '1px solid #E2E8F0' }}>
              <h4 className="vu-section-title">Affiliates / Referral Details</h4>
            </div>
            <div className="vu-section-body">
              <DatatableTables
                striped
                column={AffiliatesDetailsColumn}
                row={commonData?.refereeList?.isLoading ? 'loading' : commonData?.refereeList?.dataObj?.result}
                paging={false}
                paginationConfig={paginationConfig}
              />
            </div>
          </div>
        )}

        {/* Managed properties table */}
        {via === 'pm' && (
          <div className="vu-section">
            <div className="vu-section-header">
              <h4 className="vu-section-title">Currently Managed Properties</h4>
            </div>
            <div className="vu-section-body">
              <DatatableTables
                striped
                column={currentManagedPropertyColumn}
                row={commonData?.propertiesManagedList?.isLoading ? 'loading' : commonData?.propertiesManagedList?.dataObj}
                paging={false}
                paginationConfig={paginationConfig}
              />
            </div>
          </div>
        )}
      </Container>

      {isWhite && <WhiteListModal id={isWhite} close={() => setWhite(false)} view />}
      {isBlack && <BlackListModal id={isBlack} close={() => setBlack(false)} view />}
    </div>
  );
};

export default UserProfile;
