import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, Container, Row, TabContent, TabPane } from 'reactstrap';

import DocumentUpload from 'components/propertyManagement/DocumentUpload';
import PropertySideBar from 'components/propertySidebar/propertySidebar';
import FinancialsTab from 'components/propertyManagement/FinancialsTab';
import { marketDetailInfo } from 'constants/DraftData';
import AttomDetail from 'components/propertyManagement/AttomDetail';
import ImageUpload from 'components/propertyManagement/imageUpload';
import VideoUpload from 'components/propertyManagement/VideoUpload';
import BuyProcess from 'components/propertyManagement/BuyProcess';
import MarketTabs from 'components/propertyManagement/MarketTabs';
import Rationale from 'components/propertyManagement/Rationale';
import SavePropertyButton from 'components/SavePropertyButton';
import Details from 'components/propertyManagement/Details';
import LogoLoader from 'components/UI/Spinner/LogoSpinner';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import RenderIf from 'components/RenderIf';

import './DraftProperties.css';

import {
  editMarket,
  setSavedItem,
  createProperty,
  getMarket,
  commonSaga,
  getEarlyInvestor,
} from 'store/actions';
import BuyEquityModal from 'components/UI/Model/BuyEquity';
import InvestorAccessList from 'components/propertyManagement/InvestorAccessList';
import { propertyData } from 'constants/DraftData';

const EditProperty = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const showMarket = location.pathname === '/market-detail';

  const { createLoading, minting } = useSelector(state => state.property);
  const { createLoader } = useSelector(state => state.market);
  const { userData } = useSelector(state => state.user);
  const { propertyDetail } = useSelector(state => state.common);

  const [currentTab, setCurrentTab] = useState(showMarket ? 10 : 1);
  const [initialMktData, setInitialMktData] = useState({});
  const [published] = useState(location.state?.published);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [openEquityModal, setOpenEquityModal] = useState(false);
  const [view, setView] = useState(location.state?.view);
  const [data, setData] = useState(propertyData)
  const [datalisted, setdatalisted] = useState(false)
  let marketData = {};

  const renderTab = (tab) => {
    switch (tab) {
      case 1:
        return <AttomDetail data={data} view={view} status={data.status} />;
      case 2:
        return <FinancialsTab data={data} view={view} status={data.status} />;
      case 3:
        return (
          <DocumentUpload
            data={data.documents}
            view={view}
            rental={
              data.cashflow?.rentalDocument
                ? [data.cashflow?.rentalDocument]
                : data.cashflow?.rentalDocuments?.map(item => item.value)
            }
            status={data.status}
          />
        );
      case 4:
        return <ImageUpload data={data?.images} view={view} />;
      case 5:
        return <VideoUpload data={data} view={view} />;
      case 6:
        return (
          <Details
            info="crowdSaleInfo"
            data={data.crowdSale}
            view={view}
            tab={6}
            heading="Crowdsale"
            status={data.status}
          />
        );
      case 7:
        return (
          <Details
            info="cashflowInfo"
            data={data.cashflow}
            view={view}
            tab={7}
            heading="Cashflow"
            status={data.status}
          />
        );
      case 8:
        return <BuyProcess detail={data.buyProcess || []} data={data} view={view} />;
      case 11:
        return <Rationale data={data || {}} view={view} />;
      case 12:
        return <InvestorAccessList view={view} />;
      default:
        return null;
    }
  }

  useEffect(() => {
    if (userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);


  if (showMarket) {

    marketData = JSON.parse(JSON.stringify(location.state.data));
  }


  useEffect(() => {
    dispatch(getMarket());
    dispatch(getEarlyInvestor({ list: 'user/listUsers', field: 'userList' }));
    dispatch(commonSaga({ endPoint: `/propertyManager/getPropertyManagerList?page=1&limit=100`, type: "get", stateObj: "pmList" }));
    if (showMarket) {
      const objMarkektData = JSON.parse(JSON.stringify(location.state.data));
      setInitialMktData(objMarkektData);
    }
  }, []);

  useEffect(() => {
    if (!propertyDetail?.isLoading && propertyDetail?.dataObj) {
      dispatch(setSavedItem());
      setData(propertyDetail?.dataObj)
      setdatalisted(true)
    }
  }, [propertyDetail])

  const handleSave = () => {
    if (showMarket) {
      const changed = JSON.stringify(location.state.data) !== JSON.stringify(initialMktData);
      const marketDetail = {};
      Object.keys(marketDetailInfo).forEach(item => {
        marketDetail[item] = location.state.data[item] ? String(location.state.data[item]) : '';
      });
      marketDetail.marketChart =
        location.state.data?.marketChart?.map(item => ({
          year: item.year,
          rent: item.rent,
          appreciation: item.appreciation,
        })) || [];
      if (changed) {
        dispatch(
          editMarket({
            id: location.state.data._id,
            success: () => navigate('/market-management'),
            marketDetail,
          }),
        );
      }
    } else {
      delete data.attom.attomId;
      dispatch(createProperty(data));
    }
  };

  const handleView = () => setView(prev => !prev);

  useEffect(() => {
    if (propertyId) {
      dispatch(
        commonSaga({
          endPoint: `/property/${propertyId}`,
          type: 'get',
          stateObj: 'propertyDetail',
        }),
      )
    }
  }, [propertyId]);

  return (
    <div className="page-content">
      {(createLoader || createLoading || minting) && <LogoLoader backdrop />}
      <RenderIf render>
        <div className="w-100 d-flex justify-content-between align-items-center pb-3 px-3">
          <Breadcrumb
            nopadding
            items={[
              {
                name: showMarket ? "Market" : published ? 'Published Properties' : 'Draft Properties',
                link: showMarket ? "/market-management" : published ? '/published-properties' : '/draft-properties',
                state: data.status,
              },
              { name: view ? 'View detail' : 'Edit detail', link: '/edit-properties' },
            ]}
          />
          {view && isSuperAdmin ? (
            <Button className="button-color" onClick={handleView}>
              Edit Details <i className="fas fa-edit mx-2" role="button" />
            </Button>
          ) : (
            <div>
              {' '}
              {isSuperAdmin && <SavePropertyButton handleSave={handleSave} data={data} showMarket={showMarket} openBuyModal={setOpenEquityModal} />}
            </div>
          )}
        </div>
        <Container fluid>
          <Row>
            <Col xl={3}>
              <Card className="sidebar-card">
                <CardBody>
                  <PropertySideBar
                    setCurrentTab={setCurrentTab}
                    currentTab={currentTab}
                    data={
                      showMarket
                        ? {
                          title: marketData?.marketName,
                          location: `${marketData?.city}, ${marketData?.state}`,
                          blockchainAddress: marketData?.blockchainAddress
                        }
                        : {
                          title: data.otherInfo?.title,
                          location: `${data?.attom?.city}, ${data?.attom?.state}`,
                          blockchainAddress: data?.blockchainAddress
                        }
                    }
                    tabs={showMarket ? 'showOnmarket' : 'propertyTab'}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col xl={9}>
              <Card className="detail-card">
                <CardBody>
                  <TabContent activeTab={currentTab}>
                    <RenderIf render={!showMarket || datalisted}>
                      {renderTab(currentTab)}

                    </RenderIf>
                    <RenderIf render={showMarket}>
                      <TabPane tabId={10}>
                        <MarketTabs data={location.state} view={view} />
                      </TabPane>
                    </RenderIf>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </RenderIf>
      {openEquityModal && <BuyEquityModal data={data} isOpen={openEquityModal} onClose={setOpenEquityModal} />}
    </div>
  );
};

export default EditProperty;
