import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Button, Col, Container, Media, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';

import { 
  currentManagedPropertyColumn, 
  TokensOwnedColumn, 
  AffiliatesDetailsColumn
} from 'constants/columnUtility';
import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import WhiteListModal from 'components/useraction/WhiteListModal';
import BlackListModal from 'components/useraction/BlackListModal';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import { commonSaga } from 'store/actions';
import avatar from '../../assets/images/avatar.jpg';

import './ViewUser.css';

const UserProfile = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { commonData } = useSelector((stateObj) => ({
    commonData: stateObj.common,
  }));
  const { userData } = useSelector(stateObj => stateObj.user);
  
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
    if(userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  useEffect(() => {
    if(via === "investor") {
      setBreadcrum([
        {
          name: 'Investors',
          link: '/investors',
        },
        { name: 'View User' },
      ]);
    } else {
      setBreadcrum([
        {
          name: 'Property Managers',
          link: '/property-managers',
        },
        { name: 'View User' },
      ]);
    }


    setTimeout(() => {
      dispatch(commonSaga({endPoint: `/admin/getInvestor/${id}`, type: "get", stateObj: "userDetailsObj"}));      
    }, 2000);
    return () => localStorage.removeItem('type');
  }, []);

  useEffect(() => {
    if(commonData?.refereeList?.dataObj?.result?.length) {
      commonData?.refereeList?.dataObj?.result?.forEach(ele => {
        const obj = ele;
        obj.registration = moment(new Date(obj?.createdAt)).format('lll');
        obj.investment = obj?.requiredInvestment?.toString() || 0;
        obj.firstDeposit = obj?.firstDeposit ? obj?.firstDeposit : "0";
        obj.depositBalance = (obj?.firstDeposit !== undefined && obj?.depositBalance !== undefined) ?  (obj?.firstDeposit - obj?.depositBalance) : "0";
      });
    }
  }, [commonData?.refereeList]);

  useEffect(() => {
    if(commonData?.userDetailsObj?.reqCompleted) {
      dispatch(commonSaga({endPoint: `/payment/balance?userId=${id}`, type: "get", stateObj: "investorBalance", baseEP: "PAYMENT"}));      
      if(via !== "pm") {
        setTimeout(() => {
          dispatch(commonSaga({endPoint: `/user/refereeList?userId=${id}`, type: "get", stateObj: "refereeList", baseEP: "USER"}));
        }, 2500);
      }
    }
  }, [commonData?.userDetailsObj]);

  const hadleWhiteList = () => setWhite(id);
  const handleBlackList = () => setBlack(id);

  const copyToCLipBoard = (value) => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);  
    } catch (err) { 
      console.error(err);
    }
  }
  const blacklist = state?.data?.isActiveUser || false;

  const getList = (query) => {
    if(via === "pm") {
      dispatch(commonSaga({endPoint: `/admin/managed-properties/${id}?${query}`, type: "get", stateObj: "propertiesManagedList"}));
    } else {
      dispatch(commonSaga({endPoint: `/admin/investor-tokens/${id}?${query}`, type: "get", stateObj: "investorTokensList"}));
    }
  }

  useEffect(() => {
    if(commonData?.propertiesManagedList?.dataObj?.length) {
      commonData?.propertiesManagedList?.dataObj?.forEach(ele => {
        const obj = ele;
        obj.sDate = moment(new Date(obj?.startDate)).format('lll');
      });
    }
  }, [commonData?.propertiesManagedList]);

  useEffect(() => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== "all")
      .map(item => `${item}=${filter[item]}`)
      .join('&');

      getList(query);
  }, [JSON.stringify(filter)]);

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
    if(commonData?.investorTokensList?.dataObj?.items?.length) {
      commonData?.investorTokensList?.dataObj?.items?.forEach((ele, index) => {
        const obj = ele;
        obj.srno = index+1; 
        obj.value = `$${obj?.value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}` || "-";
        obj.tokensOwned = obj.tokensOwned ? new Intl.NumberFormat().format(obj.tokensOwned) : "-";
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.investorTokensList?.dataObj?.totalItems / filter?.itemsPerPage),
        count,
        itemCount: commonData?.investorTokensList?.dataObj?.totalItems,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [commonData?.investorTokensList]);

  const exportHandler = (val) => {
    const flag = val === "CSV" ? "toCsv" : "toXls";
    setFilter(prev => ({ ...prev, sendData: flag }));
    toast.success("Statement has been sent to your linked email.");
  }

  return (
    <div className="page-content">
      <Row>
        <Col md={10} xs={10}>
          <Breadcrumb
            items={breadcrum}
          />
        </Col>
        {isSuperAdmin && <>
        {!blacklist ? (
          <Col md={2} xs={2}>
            <Button onClick={handleBlackList} className="text-center btn-danger btn mx-2">
              <i className="fas fa-user-slash" role="button" />
              <span className="mx-2 mt-3">Blacklist</span>
            </Button>
          </Col>
        ) : (
          <Col md={2} xs={2}>
            <Button onClick={hadleWhiteList} className="text-center btn-secondary btn mx-2">
              <i className="fas fa-user-check" role="button" />
              <span className="mx-2 mt-3">Whitelist</span>
            </Button>
          </Col>
        )}
        </>
        }
      </Row>
      <Container fluid>
        <Row>
          <Card>
            <CardBody className="d-flex flex-wrap">
              <Col lg="4" md="12">
                <Media className="d-flex">
                  <div className="ms-3">
                    <img src={avatar} alt="" className="avatar-md rounded-circle img-thumbnail" />
                  </div>
                  <Media body className="flex-1 align-self-center">
                    <div className="text-muted">
                      <div className="d-flex">
                        <h5 className="ml-2 view-user-title">
                          {commonData?.userDetailsObj?.dataObj?.user?.firstName} {commonData?.userDetailsObj?.dataObj?.user?.lastName || '-'}
                        </h5>
                      </div>
                    </div>
                  </Media>
                </Media>

                {commonData?.userDetailsObj?.dataObj?.user?.blockchainAddress && (
                  <div className="d-flex align-items-center view-user-block">
                    <p className="mb-0 mt-3 view-user-title" title={commonData?.userDetailsObj?.dataObj?.user?.blockchainAddress}>
                      {`${commonData?.userDetailsObj?.dataObj?.user?.blockchainAddress?.slice(0, 4)}......${commonData?.userDetailsObj?.dataObj?.user?.blockchainAddress?.slice(-4)}`}
                    </p>
                    {copied ? (
                      <div className="d-flex mt-3 color-green">
                        <i className="fas fa-check ms-3" />
                      </div>
                    ) : (
                      <i
                        className="fas fa-clone mb-0 mt-3 cursor-pointer ms-3"
                        onClick={() => copyToCLipBoard(commonData?.userDetailsObj?.dataObj?.user?.blockchainAddress)}
                      />
                    )}
                  </div>
                )}
              </Col>
              <Col lg="4" md="6">
                <div className="text-center">
                  <div className="d-flex">
                    <i className="fas fa-envelope mx-2 mt-3 view-user-copy" />
                    <h6 className="mx-2 mt-3">{commonData?.userDetailsObj?.dataObj?.user?.email}</h6>
                  </div>
                  <div className="d-flex">
                    <i className="fas fa-birthday-cake mx-2 mt-3 view-user-copy" />
                    <h6 className="mx-2 mt-3">{commonData?.userDetailsObj?.dataObj?.user?.dob ? new Date(commonData?.userDetailsObj?.dataObj?.user?.dob).toLocaleDateString() : '-'}</h6>
                  </div>
                  <div className="d-flex">
                    <i className="fas fa-mobile mx-2 mt-3 view-user-copy" />
                    <h6 className="mx-2 mt-3">{commonData?.userDetailsObj?.dataObj?.user?.countryCode} {commonData?.userDetailsObj?.dataObj?.user?.mobileNumber || '-'}</h6>
                  </div>
                  <div className="d-flex">
                    <i className="fas fa-calendar mx-2 mt-3 view-user-copy" />
                    <h6 className="mx-2 mt-3">
                      {commonData?.userDetailsObj?.dataObj?.user?.createdAt ? moment(new Date(commonData?.userDetailsObj?.dataObj?.user?.createdAt)).format('lll') : '-'}
                    </h6>
                  </div>
                </div>
              </Col>
              <Col lg="4" md="6">
                {/* <div className="d-flex">
                  <i className="fas fa-dollar-sign mx-2 mt-3 view-user-copy" />
                  <h6 className="mx-2 mt-3"> 
                    {`${commonData?.investorBalance?.dataObj?.balance?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}` || '-'}
                  </h6>
                </div> */}
                <div className="d-flex">
                  <i className="fas fa-map-pin mx-2 mt-3 view-user-copy" />
                  <h6 className="mx-2 mt-3">
                    {commonData?.userDetailsObj?.dataObj?.user?.city
                      ? commonData.userDetailsObj.dataObj.user.city.charAt(0).toUpperCase() + commonData.userDetailsObj.dataObj.user.city.slice(1)
                      : ''}
                    {commonData?.userDetailsObj?.dataObj?.user?.stateCode ? `, ${commonData?.userDetailsObj?.dataObj?.user?.stateCode}` : '-'}
                  </h6>
                </div>
                {via !== "pm" && 
                <>
                <div className="d-flex">
                  <i title="Referral Earnings" className="fas fa-money mx-2 mt-3 view-user-copy" />
                  <h6 className="mx-2 mt-3">{commonData?.userDetailsObj?.dataObj?.user?.referralEarnings || 0}</h6>
                </div>
                <div className="d-flex">
                  <i title="Referred By" className="fas fa-users mx-2 mt-3 view-user-copy" />
                  <h6 className="mx-2 mt-3">
                    {commonData?.userDetailsObj?.dataObj?.referredBy?.firstName || ''}
                    {` ${commonData?.userDetailsObj?.dataObj?.referredBy?.lastName || '-'}` }
                  </h6>
                </div>
                </>
                }
              </Col>
            </CardBody>
          </Card>
        </Row>

        <Container fluid>
          <Row>
            {via === "investor" && 
              <Card>
                <div className="flexCenter">
                  <h4 className="mx-4 mt-3">Token Owned</h4>
                  {commonData?.investorTokensList?.dataObj?.items?.length > 0 && 
                    <ButtonDropDown
                      title="Export"
                      options={['CSV', 'XLS']}
                      name="sendData"
                      onClick={exportHandler}
                      noAll
                    />
                  }
                </div>
                <CardBody>
                  <DatatableTables
                    striped
                    column={TokensOwnedColumn}
                    row={commonData?.investorTokensList?.dataObj?.items}
                    paging={false} 
                    paginationConfig={paginationConfig}
                  />
                </CardBody>

                  <h4 className="mx-4 mt-3">Affiliates/Referral Details List</h4>
                <div className="flexCenter">
                  <CardBody>
                    <DatatableTables
                      striped
                      column={AffiliatesDetailsColumn}
                      row={commonData?.refereeList?.isLoading ? 'loading' :  commonData?.refereeList?.dataObj?.result}
                      paging={false}
                      paginationConfig={paginationConfig}
                    />
                  </CardBody>
                </div>
              </Card>
            }
            {via === "pm" && 
              <Card>
                <h4 className="mx-4 mt-3">Currently Managed Properties</h4>
                <CardBody>
                  <DatatableTables
                    striped
                    column={currentManagedPropertyColumn}
                    row={commonData?.propertiesManagedList?.isLoading ? 'loading' :  commonData?.propertiesManagedList?.dataObj}
                    paging={false} 
                    paginationConfig={paginationConfig}
                  />
                </CardBody>
              </Card>
            }
            {/* {via !== "pm" && 
              <Card>
                  <h4 className="mx-4 mt-3">Referral Details List</h4>
                  <CardBody>
                    <DatatableTables
                      striped
                      column={ReferralListColumn}
                      row={commonData?.refereeList?.isLoading ? 'loading' :  commonData?.refereeList?.dataObj?.result}
                      paging={false}
                      paginationConfig={paginationConfig}
                    />
                  </CardBody>
              </Card>
            } */}
          </Row>
        </Container>
      </Container>
      {isWhite && <WhiteListModal id={isWhite} close={() => setWhite(false)} view />}
      {isBlack && <BlackListModal id={isBlack} close={() => setBlack(false)} view />}
    </div>
  );
};
export default UserProfile;
