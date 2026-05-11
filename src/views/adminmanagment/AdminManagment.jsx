import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Button, Container } from 'reactstrap';
import { toast } from 'react-toastify';

import {
  adminList,
  deleteAdmin,
  updateAdmin,
  generateTempPassword,
  GetUserProfile,
  commonSaga,
} from 'store/actions';

import '../viewcommon.css';
import MultipleSelctModal from 'components/UI/Model/multipleSelect/multipleSelectModal';
import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import CreateModal from 'components/UI/Model/adminModals/CreateAdmin';
import SimpleToggleSwitch from 'components/Switch/SimpleToggleSwitch';
import LogoLoader from 'components/UI/Spinner/LogoSpinner';
import DeleteModal from 'components/UI/Model/DeleteModal';
import DatatableTables from 'components/Table/Table';
import { adminColumn } from 'constants/tableColumn';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';
import RenderIf from 'components/RenderIf';
import { Tooltip } from '@mui/material';
import { updateAdminStatus } from 'store/actions';

const AdminManagement = () => {
  const dispatch = useDispatch();
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));
  const {
    adminsList,
    isLoading,
    adminDetails,
    isAdminDeleted,
    isAdminUpdated,
    errorMsg,
    isTempPWDGenerated,
    isAdminStatusChanged,
  } = useSelector(state => state.admins);

  const [filter, setFilter] = useState({ startIndex: 1, itemsPerPage: 10, name: '', status: '' });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [tempPassword, setTempPassword] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [event, setEvent] = useState(false);

  const getList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(adminList(query));
  };

  useEffect(() => {
    dispatch(GetUserProfile());
  }, []);

  useEffect(() => {
    getList();
  }, [JSON.stringify(filter)]);

  const handleView = id => {
    const selectedAdminObj = adminsList?.items.find(ele => ele._id === id);
    setSelectedAdmin(selectedAdminObj);
    setEvent('view');
  };

  const handleEdit = id => {
    const selectedAdminObj = adminsList?.items.find(ele => ele._id === id);
    setSelectedAdmin(selectedAdminObj);
    setEvent('edit');
  };

  const handleDelete = id => {
    const isSuperAdmin = localStorage.getItem('isSuperAdmin');
    if (isSuperAdmin) {
      setSelectedAdmin(id);
      setEvent('remove');
    } else {
      toast.error(`Sorry! You don't have permission to delete Admin.`);
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteAdmin({ id: selectedAdmin }));
  };
  const handleStatusUpdate = id => {
    dispatch(updateAdminStatus({ id, handleSuccess: () => getList() }));
  };
  const action = id => (
    <ActionCell view={handleView} edit={handleEdit} remove={handleDelete} id={id} />
  );

  const handleSendPassword = () => setTempPassword(prev => !prev);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, startIndex: page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  useEffect(() => {
    if (adminsList?.items) {
      adminsList?.items?.forEach(ele => {
        const obj = ele;
        obj.adminName =
          ele.name.length > 20 ? (
            <Tooltip className="cursor-pointer" enterTouchDelay={0} title={ele.name}>
              {' '}
              {ele.name.substring(0, 20)}....
            </Tooltip>
          ) : (
            ele.name
          );
        obj.action = ele.isSuperAdmin ? (
          <ActionCell view={handleView} id={ele?._id} />
        ) : (
          action(ele?._id)
        );
        obj.lastLogin = ele.lastLogin ? new Date(ele.lastLogin).toLocaleString() : '-';
        obj.role = ele.isSuperAdmin ? 'Super Admin' : 'Admin';
        obj.status = (
          <SimpleToggleSwitch
            status={obj.status === 'Active'}
            handleToggle={() => handleStatusUpdate(ele._id)}
            key={ele._id}
          />
        );
      });
    }
    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(adminsList?.totalItems / filter?.itemsPerPage),
      count,
      itemCount: adminsList?.totalItems,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [adminsList]);

  useEffect(() => {
    if (commonData?.addAdminState?.dataSaved) {
      setEvent(false);
      getList();
    }
  }, [commonData?.addAdminState]);

  useEffect(() => {
    if (isAdminDeleted || isAdminUpdated || isTempPWDGenerated) {
      setEvent(false);
      
      getList();

      if (isAdminUpdated) {
        toast.success('Admin updated successfully');
      } else if (isAdminDeleted) {
        toast.success('Admin deleted successfully');
      }
    }
  }, [isAdminDeleted, isAdminUpdated, errorMsg, isTempPWDGenerated,isAdminStatusChanged]);

  useEffect(() => {
    if (Object.keys(adminDetails).length) {
      setEvent('view');
    }
  }, [adminDetails]);

  const onAddAdmin = data => {
    if (event === 'edit') {
      const obj = data;
      obj.id = selectedAdmin._id;
      dispatch(updateAdmin(obj));
      // dispatch(commonSaga({endPoint: '/admin/blacklist', type: "put", stateObj: "userFlagUpdate", dataToPost: { userId: id, blacklistType: type, reason: ''}, 'msg': `Investor Successfully Blacklisted!`, showAlert: true}));
    } else {
      dispatch(
        commonSaga({
          endPoint: `/admin/create-admin`,
          type: 'post',
          stateObj: 'addAdminState',
          dataToPost: data,
          msg: 'Admin Added Successfully!',
          showAlert: true,
        }),
      );
    }
  };

  const handleDropdown = val => setFilter(prev => ({ ...prev, status: val }));

  const onSearchCB = val => {
    if (val?.length > 2) {
      setFilter(prev => ({ ...prev, name: val }));
    } else {
      setFilter(prev => ({ ...prev, name: '' }));
    }
  };

  const generateTempPasswordCB = () => {
    dispatch(
      generateTempPassword({
        id: selectedAdmin._id,
      }),
    );
  };

  return (
    <div className="page-content">
      <Breadcrumb name="Admins" />
      <RenderIf>
        <LogoLoader />
      </RenderIf>
      <RenderIf render>
        <Container fluid>
          <div style={{ background: 'white', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
              <div className="btn-group me-1">
                <ButtonDropDown
                  title="Status"
                  onClick={handleDropdown}
                  options={['Active', 'Deactive']}
                />
              </div>
              <div className="d-flex">
                <SearchInput onChange={onSearchCB} placeholder="Search Admin" />
                <div className="mx-4">
                  <Button
                    type="button"
                    className="button-color"
                    data-toggle="modal"
                    data-target="#myModal"
                    onClick={() => setEvent('create')}
                  >
                    Create Admin
                  </Button>
                </div>
              </div>
            </div>
            <DatatableTables
              column={adminColumn}
              row={isLoading ? 'loading' : adminsList?.items}
              paging={false}
              paginationConfig={paginationConfig}
            />
          </div>
        </Container>
        <RenderIf render={tempPassword}>
          <MultipleSelctModal
            title="Send temporary password"
            search={false}
            showAll={false}
            endPoint="/admin/forgotPasswordList"
            close={handleSendPassword}
            handleSubmit={handleSendPassword}
            isOpen
            send
          />
        </RenderIf>
        <RenderIf render={event === 'edit' || event === 'view' || event === 'create'}>
          <CreateModal
            isOpen={event === 'remove' ? '' : event}
            close={() => setEvent(false)}
            disable={event === 'view' || event === 'edit'}
            onSubmit={onAddAdmin}
            adminDetails={selectedAdmin}
            generateTempPassword={generateTempPasswordCB}
          />
        </RenderIf>
        <RenderIf render={event === 'remove'}>
          <DeleteModal
            close={() => setEvent(false)}
            text="If you delete the admin all ongoing work will be lost and the admin account cannot be recovered."
            title="Are you sure you want to delete the admin?"
            confirm={handleDeleteConfirm}
          />
        </RenderIf>
      </RenderIf>
    </div>
  );
};

export default AdminManagement;
