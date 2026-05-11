import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import CreatePropertyManagerModel from 'components/UI/Model/CreatePropertyManagerModel';
import { NavigationLabel } from 'components/Table/tableComponents';
import { propertyManagersColumn } from 'constants/columnUtility';
import BlockUserModel from 'components/UI/Model/BlockUserModel';
import { commonSaga, commonSuccess } from 'store/actions';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import DeleteModal from 'components/UI/Model/DeleteModal';

const ProppertyManagers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { commonData } = useSelector((state) => ({
      commonData: state.common,
  }));
  const { userData } = useSelector(state => state.user);

  const [filter, setFilter] = useState({ page: 1, limit: 10, search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [paginationConfig, setPaginationConfig] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [addNewModal, setaddNewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState();

  useEffect(() => {
    if(userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  const handleDelete = (item) => {
    if(item?.status === "Not Active")
    toast.error("user is already deactivated")
    else {
    setDeleteModal(true);
    setSelectedAdmin(item?._id);}
  };

  const getList = () => {
    const query = Object.keys(filter)
    .filter(item => filter[item] !== undefined && filter[item] !== '')
    .map(item => `${item}=${filter[item]}`)
    .join('&');
    
    dispatch(commonSaga({endPoint: `/propertyManager/getPropertyManagerList?${query}`, type: "get", stateObj: "pmList"}));
  }
  
  const handleDeleteConfirm = () => {
    dispatch(
      commonSaga({
        endPoint: `/propertyManager/deletePropertyManager/${selectedAdmin}`,
        type: 'delete',
        showAlert: true,
        success: getList
      }),
    );
    setDeleteModal(false);
  };

  useEffect(() => {
      getList();
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

  const handleView = item => {
    navigate(`/view-user/${item?._id}?via=pm`,{state : {search: '?via=pm' }});
  }

  useEffect(() => {
    if(commonData?.blockPM?.dataSaved) {
      getList();
      dispatch(commonSuccess({stateObj: "blockPM", dataSaved: false}));
    }
  }, [commonData?.blockPM]);

  useEffect(() => {
    if(commonData?.pmList?.dataObj?.data?.length) {
      commonData?.pmList?.dataObj?.data?.forEach(ele => {
        const obj = ele;
        obj.company_name = obj.companyName || "-";
        obj.emailId = obj.email || "-";
        obj.contact_person = (obj?.personName || obj?.firstName) ? <NavigationLabel title={obj?.personName || obj?.firstName} link={`/view-user/${obj?._id}?via=pm`} />: '-';
        obj.status = obj.isActiveUser ? "Active" : "Not Active";
        obj.action = <div className="d-flex justify-content-evenly align-items-center" key={obj?._id}>
            <ActionCell view={() => handleView(obj)} id={obj?._id} remove={() => handleDelete(obj)}/>
            <BlockUserModel userState={obj?.isActiveUser} user={obj?._id} />
          </div>;
      });
    }

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(commonData?.pmList?.dataObj?.totalCount / filter?.limit),
      count,
      itemCount: commonData?.pmList?.dataObj?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.pmList]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb name="Property Managers" />
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-end">
                      <SearchInput onChange={handleChange} />
                      {isSuperAdmin && <Button className="ms-2 button-color me-3" color="primary" onClick={() => setaddNewModal(true)}>
                        Add New
                      </Button>}
                    </div>
                  </Col>
                </Row>
                {addNewModal && (
                  <CreatePropertyManagerModel isOpen={addNewModal} onClose={setaddNewModal} />
                )}
                {/* {deleteModal && <DeleteUserModel isOpen={deleteModal} onClose={setDeleteModal} />} */}
                {deleteModal && (
                  <DeleteModal
                    title="Are you sure you want to deactivate ?"
                    close={setDeleteModal}
                    confirm={handleDeleteConfirm}
                  />
                )}
                <DatatableTables
                  column={propertyManagersColumn}
                  row={commonData?.pmList?.isLoading ? "loading" : commonData?.pmList?.dataObj?.data}
                  striped
                  paging={false} 
                  paginationConfig={paginationConfig}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default ProppertyManagers;
