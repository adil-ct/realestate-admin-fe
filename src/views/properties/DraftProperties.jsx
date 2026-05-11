/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';

import { getPropertyList, createProperty, getEarlyInvestor, deleteProperty } from 'store/actions';
import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import DeleteGenericModal from 'components/UI/Model/DeleteGenericModal';
import { PropertyManagementColumn } from 'constants/columnUtility';
import AttomIdModal from 'components/UI/Model/AttomIdModal';
import DeleteModal from 'components/UI/Model/DeleteModal';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import RenderIf from 'components/RenderIf';

import './DraftProperties.css';

const DraftProperties = () => {
  const { propertyList, loading, propertyDeleted } = useSelector(state => state.property);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({ itemsPerPage: 100, status: location.state || 'Draft' });
  const { userList, loading: userLoading } = useSelector(state => state.user);
  const { userData } = useSelector(state => state.user);

  const [duplicateModelState, setDuplicateModelState] = useState({ show: false, data: {} });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAttomId, setShowAttomId] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  const modalOpen = (item) => {
    setSelectedItem(item);
    setModal(true);
  };

  const modalClose = () => {
    setModal(!modal);
  };

  const dateOffsetConverter = (date) => {
    if (date) {
      const getDate = date && new Date(date);
      const offSetTimeZone = getDate?.getTimezoneOffset() * 60000;
      const modifiedDate = getDate && new Date(getDate?.getTime() + offSetTimeZone).toISOString();
      return modifiedDate;
    }
    return '';
  }

  const dateDataModification = (item) => {
    const startDate = dateOffsetConverter(item?.crowdSale?.startDate);
    const stopDate = dateOffsetConverter(item?.crowdSale?.stopDate);
    const crowdSaleObj = { ...item?.crowdSale, startDate, stopDate };

    const purchaseDate = dateOffsetConverter(item?.otherInfo?.purchaseDate);
    const firstDividendsDate = dateOffsetConverter(item?.otherInfo?.firstDividendsDate);
    const otherInfoObj = { ...item?.otherInfo, purchaseDate, firstDividendsDate };

    const payload = { ...item, crowdSale: crowdSaleObj, otherInfo: otherInfoObj };
    return payload;
  }

  const handleView = useCallback((item) => {
    navigate(`/edit-property/${item?._id}`, { state: { data: dateDataModification(item), view: true } });
  }, [navigate]);

  const handleEdit = useCallback((item) => {
    navigate(`/edit-property/${item?._id}`, { state: { data: dateDataModification(item) } });
  }, [navigate]);

  const duplicate = useCallback((item) => {
    setDuplicateModelState({ show: true, data: item });
  }, []);

  useEffect(() => {
    dispatch(getEarlyInvestor({ list: 'user/listUsers', field: 'userList' }));
  }, [dispatch]);

  useEffect(() => {
    if (!propertyList || !Array.isArray(propertyList) || propertyList.length === 0) {
      setData([]);
      return;
    }
    
    const propertyDetails = propertyList.filter(item => item).map(item => ({
      title: item.otherInfo?.title ?? '-',
      owner:
        (userLoading && 'Loading...') ||
        (Array.isArray(userList) && userList.length > 0 ?
          `${userList.find(usr => usr._id === item.otherInfo?._owner)?.firstName || ''} ${userList.find(usr => usr._id === item.otherInfo?._owner)?.lastName || ''}`
          : ''),
      state: item.attom?.city && item.attom?.state 
        ? `${item.attom.city}, ${item.attom.state}` 
        : item.attom?.city || item.attom?.state || '-',
      // city: item.attom.city,
      email:
        (userLoading && 'Loading...') || (Array.isArray(userList) && userList.length > 0 ?
          userList?.find(usr => usr._id === item.otherInfo?._owner)?.email || '-' : '-'),
      // propertyType: item.attom?.locationType,
      updated: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-',
      action: <ActionCell view={handleView} duplicate={duplicate} edit={handleEdit} remove={modalOpen} id={item} />,
    }));
    setData(propertyDetails);
  }, [propertyList, userList, userLoading, handleView, handleEdit, duplicate]);

  const getFilters = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item])
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    return query;
  }
  useEffect(() => {
    dispatch(getPropertyList(getFilters()));
  }, [JSON.stringify(filter)]);

  const handleAddNew = () => {
    setShowAttomId(prev => !prev);
  };
  const handleCreate = val => {
    dispatch(
      createProperty({
        data: { attomId: val },
        success: item => {
          navigate(`/edit-property/${item?._id}`, { state: { data: item } });
        },
      }),
    );
  };
  let timeout = '';
  const handleSearch = e => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setFilter(prev => ({ ...prev, title: e.target.value.trim() || undefined }));
    }, 700);
  };
  const handleFilter = (val, name) => {
    setFilter(prev => ({ ...prev, [name]: val }));
  };

  const confirmDelete = () => {
    if (selectedItem?._id) {
      dispatch(deleteProperty({ _id: selectedItem?._id }));
    }
  }

  const confirmDuplicate = () => {
    setDuplicateModelState({ show: false, data: {} });
  }

  useEffect(() => {
    if (propertyDeleted) {
      setModal(false);
      dispatch(getPropertyList(getFilters()));
    }
  }, [propertyDeleted])

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Breadcrumb name="Draft Properties" />
            <Card>
              <CardBody>
                <Row>
                  {/* <Col xl={6}>
                    <Breadcrumb name="Property Management" items={breadcrumbData} />
                  </Col>
                  <Col
                    xl={6}
                    className="d-flex justify-content-between align-items-center property-cards"
                  > */}
                  {/* <PropertiesManagementCard name="Drafted" score="1000" img={image} />
                    <PropertiesManagementCard name="published" score="999" img={image} /> */}
                  {/* </Col> */}
                  <Col className="d-flex justify-content-between p-4">
                    {/* <ButtonDropDown title="Location" options={['bombay', 'mumbai']} noAll/> */}
                    <ButtonDropDown
                      title={filter.status}
                      options={['Draft', 'Minted']}
                      name="status"
                      onClick={handleFilter}
                      noAll
                    />
                    <div className="d-flex">
                      <div className="search-box me-2 ">
                        <div className="position-relative">
                          <input
                            className="form-control mr-sm-2"
                            type="text"
                            placeholder="Search Property"
                            onChange={handleSearch}
                          />
                          <i className="mdi mdi-magnify search-icon" />
                        </div>
                      </div>
                      {isSuperAdmin && <Button className="button-color ms-2" onClick={handleAddNew}>
                        Add Property
                      </Button>}
                      {/* <button className="ms-2 button-color" type="button">Add New</button> */}
                    </div>
                  </Col>
                  <DatatableTables
                    column={PropertyManagementColumn}
                    row={loading ? 'loading' : data}
                  />
                  {modal && (
                    <DeleteModal
                      text="Are you sure you want to delete the property details?"
                      title="Delete Draft Proposal"
                      close={modalClose}
                      confirm={confirmDelete}
                    />
                  )}
                  <RenderIf render={showAttomId}>
                    <AttomIdModal close={handleAddNew} confirm={handleCreate} />
                  </RenderIf>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <DeleteGenericModal
        isOpen={duplicateModelState?.show}
        onClose={() => setDuplicateModelState({ show: false, data: {} })}
        title="Are you sure to duplicate the property?"
        header="Confirmation"
        confirm={confirmDuplicate}
      />
    </div>
  );
};

export default DraftProperties;
