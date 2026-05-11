// import Table from 'components/UI/tables/Table';
import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
// import moment from 'moment';
import { EarlyInvestorsColumn } from 'constants/columnUtility';
import './EarlyInvestors.css';
import MultipleSelctModal from 'components/UI/Model/multipleSelect/multipleSelectModal';
import RenderIf from 'components/RenderIf';
import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';

import DatatableTables from 'components/Table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { getEarlyInvestor, sendPassword, addInvestor } from 'store/actions';
import ActionCell from 'components/ActionButton';
import ToggleSwitch from 'components/Switch/ToggleSwitch';
import { axiosMain } from 'http/axios/axios_main';
import MultipleAddModal from 'components/UI/Model/multipleSelect/multipleAddModal';
import DeleteModal from 'components/UI/Model/DeleteModal';
import { toast } from 'react-toastify';
import Breadcrumb from 'components/UI/Common/Breadcrumb';

const EarlyInvestors = () => {
  const dispatch = useDispatch();

  const { investorList, loading, status } = useSelector(state => state.user);
  const { userData } = useSelector(stateObj => stateObj.user);

  const [sendPasswordModal, setSendPassword] = useState(false);
  const [getEarlyAccess, setEarlyAccess] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [usersData, setUserData] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState({});

  const handelSort = () => {};
  
  useEffect(() => {
    if(userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(getEarlyInvestor({ list: 'user/early-access-list', field: 'investorList' }));
    // dispatch(getEarlyInvestor({ list: 'listUsers', field: 'userList' }));
  }, []);
  const handleDelete = id => {
    setModal(id);
  };
  const getDetails = list => {
    const sdetail = list?.map(item => ({
      id: item.id,
      _id: item._id,
      email: item.email,
      registration_date: item.createdAt ? new Date(item.createdAt).toLocaleString() : '-',
      status: item.registered ? 'Registered' : 'Not registered',
      registered: item.registered,
      granted: item.earlyAccess ? 'Granted' : 'Not granted',
      passwordsent: item.temporaryPasswordSent === undefined || item.temporaryPasswordSent,
      resend: item.resend,
      action: <ActionCell remove={handleDelete} id={item.email} />,
    }));
    return sdetail;
  };
  const handleChange = e => {
    const val = e.target.value.trim();
    setFilter(prev => ({ ...prev, email: val }));
    // const data = investorList.filter(item => item.email.includes(val));
    // const sdetail = getDetails(data);
    // setUserData(sdetail);
  };

  useEffect(() => {
    setEarlyAccess(status);
  }, [status]);
  useEffect(() => {
    if(investorList?.emails) {
      const sdetail = getDetails(investorList?.emails);
      setUserData(sdetail);
    }
  }, [investorList]);
  const handleSendPassword = () => {
    setSendPassword(prev => !prev);
  };
  const handleAddUser = () => {
    setAddUser(prev => !prev);
  };
  const handleAddNew = () => {
    setAddNew(prev => !prev);
  };
  const handlePasswordSubmit = ids => {
    dispatch(
      sendPassword({
        ids,
        success: () => {
          setSendPassword(false);
        },
      }),
    );
  };
  const handleAddUserSubmit = emails => {
    dispatch(
      addInvestor({
        emails,
        successHandler: () => {
          setAddUser(prev => !prev);
          toast.success('Early access granted successfully');
          dispatch(getEarlyInvestor({ list: 'user/early-access-list', field: 'investorList' }));
        },
      }),
    );
  };
  const handleToggleChange = async () => {
    try {
      await axiosMain.put(`/user/early-access-status/${!getEarlyAccess}`);
      setEarlyAccess(prev => !prev);
    } catch (err) {
      console.log(err);
    }
  };
  const addNewUsers = async emails => {
    try {
      setNewLoading(true);
      await axiosMain.post('/user/add-to-early-access', { emails });
      // dispatch(getEarlyInvestor());
      toast.success('Investor will be add to early access waitlist in a while');
      setNewLoading(false);
      handleAddNew();
    } catch (err) {
      setNewLoading(false);
      toast.error(err.response?.data?.msg);
    }
  };
  const handleDeleteModal = () => setModal(prev => !prev);
  const handleDeleteConfirm = async () => {
    try {
      await axiosMain.delete(`/user/remove-from-early-access/${modal}`);
      handleDeleteModal();
      dispatch(getEarlyInvestor({ list: 'user/early-access-list', field: 'investorList' }));
      toast.success('Investor will be deleted in a while');
    } catch (err) {
      console.log(err);
    }
  };
  const handleDropdown = (val, name) => {
    const isRegistered = val === 'Registered';
    setFilter(prev => ({ ...prev, [name]: val ? isRegistered : undefined }));
    // const data = val ? investorList.filter(item => item.registered === isRegistered) : investorList;
    // const sdetail = getDetails(data);
    // setUserData(sdetail);
  };
  useEffect(() => {
    let data = investorList?.emails;
    if (filter.registered !== undefined) {
      data = data.filter(item => item.registered === filter.registered);
    }
    if (filter.email) {
      data = data.filter(item => item.email.includes(filter.email));
    }
    const sdetail = getDetails(data);
    setUserData(sdetail);
  }, [filter]);
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Breadcrumb name="Early Investors" />

            <Card>
              <CardBody>
                <Row>
                  <div className="d-flex justify-content-between early-invesrtors-header">
                    <div className="d-flex align-items-center ms-4">
                      <ButtonDropDown
                        title="Status"
                        options={['Registered', 'Not registered']}
                        name="registered"
                        onClick={handleDropdown}
                      />
                      {isSuperAdmin && <div className="d-flex ms-2 header-switch align-items-center">
                        <span className="mright-1">Early Access</span>
                        <ToggleSwitch
                          className="ms-2 toggle-early-access"
                          title="Disable Early Access Status"
                          subtext="Are you sure you want to disable the early access?"
                          text="If you deactivate early access, admin will not able to add user or grant early access"
                          status={getEarlyAccess}
                          onChange={handleToggleChange}
                        />
                      </div>}
                    </div>
                    <div className="d-flex send-password-header">
                      {isSuperAdmin && 
                        <>
                        <Button
                          className="button-color"
                          onClick={handleAddNew}
                          disabled={!getEarlyAccess}
                        >
                          Add User
                        </Button>
                        <Button
                          className="ms-2 button-color"
                          onClick={handleAddUser}
                          disabled={!getEarlyAccess}
                        >
                          Give Early Access
                        </Button>
                        </>
                      }
                      <div className="search-box search-box-header ms-2">
                        <div className="position-relative">
                          <input
                            className="form-control mr-sm-2"
                            type="text"
                            placeholder="Search Users"
                            // value={query}
                            onChange={handleChange}
                          />
                          <i className="mdi mdi-magnify search-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
                <RenderIf render={sendPasswordModal && !loading}>
                  <MultipleSelctModal
                    investors={usersData?.filter(item => item.registered && !item.passwordsent)}
                    isOpen
                    select="_id"
                    show="email"
                    title="Select investors"
                    buttonText="Send"
                    close={handleSendPassword}
                    handleSubmit={handlePasswordSubmit}
                  />
                </RenderIf>
                <RenderIf render={addUser && !loading}>
                  <MultipleSelctModal
                    investors={usersData?.filter(
                      item => item.granted === 'Not granted' || item.resend,
                    )}
                    isOpen
                    select="email"
                    show="email"
                    title="Select investors"
                    close={handleAddUser}
                    handleSubmit={handleAddUserSubmit}
                    addUser
                  />
                </RenderIf>
                <RenderIf render={addNew && !loading}>
                  <MultipleAddModal
                    isOpen
                    title="Add User"
                    buttonText="Add user"
                    close={handleAddNew}
                    handleSubmit={addNewUsers}
                    loading={newLoading}
                  />
                </RenderIf>
                {modal && (
                  <DeleteModal
                    title="Are you sure you want to remove investor ?"
                    close={handleDeleteModal}
                    confirm={handleDeleteConfirm}
                  />
                )}
                <div className="mt-4">
                  <DatatableTables
                    column={EarlyInvestorsColumn}
                    row={loading ? 'loading' : usersData}
                    hidePaging
                    handelSort={handelSort}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EarlyInvestors;
