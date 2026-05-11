import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import { getMarket, createMarket, deleteMarket } from 'store/actions';
import AddMarketModal from 'components/UI/Model/AddMarketModal';
import { MarketDetailColumn } from 'constants/columnUtility';
import DeleteModal from 'components/UI/Model/DeleteModal';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import RenderIf from 'components/RenderIf';

import './DraftProperties.css';

const DraftProperties = () => {
  const { loading, marketList } = useSelector(state => state.market);
  const { userData } = useSelector(state => state.user);

  const [showAddMarket, setShowAddMarket] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(getMarket());
  }, []);
  const modalOpen = item => {
    setModal(item._id);
  };
  const modalClose = () => {
    setModal(!modal);
  };
  const handleView = item =>
    navigate('/market-detail', {state: { data: item, view: true } });
  const handleEdit = item => navigate('/market-detail', {state: { data: item } });
  useEffect(() => {
    const marketDetail = marketList.map(item => ({
      name: item.marketName,
      state: item.state,
      city: item.city,
      action: <ActionCell view={handleView} edit={handleEdit} remove={modalOpen} id={item} />,
    }));
    setData(marketDetail);
  }, [marketList]);
  const handleAddNew = () => {
    setShowAddMarket(prev => !prev);
  };
  const addMarket = (val) => {
    // add market and marketChart field
    const marketdata = { ...val, marketChart: [] };
    const success = id =>
      navigate('/market-detail',
        {state: { data: { ...marketdata, _id: id }, subtab: 2 },
      });
    dispatch(createMarket({ data: marketdata, success }));
    // handleAddNew();
  };
  const handleDelete = async () => {
    dispatch(
      deleteMarket({
        id: modal,
        success: () => {
          toast.success('market deleted successfully');
          modalClose();
        },
      }),
    );
  };
  const handleChange = e => {
    const val = e.trim().toLocaleLowerCase();
    const serachData = marketList.filter(item =>
      Object.values(item).join('').toLocaleLowerCase().includes(val),
    );
    const marketDetail = serachData.map(item => ({
      name: item.marketName,
      state: item.state,
      city: item.city,
      action: <ActionCell view={handleView} edit={handleEdit} remove={modalOpen} id={item} />
    }));

    setData(marketDetail);
  };
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
      <Breadcrumb name="Market Management" />
            <Card>
              <CardBody>
                <Row>
                  <Col className="d-flex justify-content-end p-4">
                    <div className="d-flex">
                      <SearchInput onChange={handleChange} placeholder="Search Market" />
                      {isSuperAdmin && <Button className="button-color ms-2" onClick={handleAddNew}>
                        Add Market
                      </Button>}
                    </div>
                  </Col>
                  <DatatableTables
                    striped
                    column={MarketDetailColumn}
                    paging={false}
                    row={loading ? 'loading' : data}
                  />
                  {modal && (
                    <DeleteModal
                      text="Are you sure you want to delete the market ?"
                      title="Delete market"
                      close={modalClose}
                      confirm={handleDelete}
                    />
                  )}
                  <RenderIf render={showAddMarket}>
                    <AddMarketModal close={handleAddNew} addMarket={addMarket} />
                  </RenderIf>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DraftProperties;
