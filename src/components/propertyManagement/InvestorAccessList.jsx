import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from 'reactstrap';

import SimpleToggleSwitch from 'components/Switch/SimpleToggleSwitch';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import { InvestorAccessListColumn } from 'constants/columnUtility';
import DeleteModal from 'components/UI/Model/DeleteModal';
import { commonSaga } from 'store/actions';

import './propertymanagement.css';

const InvestorAccessList = ({ view }) => {
  const [investorAccessList, setInvestorAccessList] = useState([]);
  const [investorStatus, setInvestorStatus] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [removeUser, setRemoveUser] = useState(null);

  const { searchResult, propertyDetail, investorAccessListStatus } = useSelector(
    state => state.common,
  );
  const { propertyId } = useParams();
  const dispatch = useDispatch();

  const handleRemoveUser = item => {
    setModal(true);
    setRemoveUser(item);
  };

  const handleCloseDeleteModal = () => setModal(false);

  const handleSearchInput = useCallback(
    searchValue => {
      dispatch(
        commonSaga({
          endPoint: `/user/investors/access-list/${propertyId}?search=${searchValue}`,
          type: 'get',
          stateObj: 'searchResult',
        }),
      );
    },
    [inputValue],
  );

  const updateProperty = (payload, state) => {
    dispatch(
      commonSaga({
        endPoint: `/property/${propertyId}/updateMintedProperty`,
        type: 'patch',
        stateObj: state,
        dataToPost: payload,
      }),
    );
  };

  const addInvestor = selectedData => {
    const updatedAccessList = {
      investorAccessList: [
        ...selectedData,
        {
          email: selectedUser.email,
          id: selectedUser.id,
          name: `${selectedUser?.firstName} ${selectedUser?.lastName}`,
        },
      ],
    };
    updateProperty(updatedAccessList, 'propertyDetail');
  };

  const updateInvestorStatus = status => {
    const investorAccessStatus = {
      investorAccessStatus: status,
    };
    updateProperty(investorAccessStatus, 'investorAccessListStatus');
  };

  const removeInvestor = selectedData => {
    const newInvestorList = selectedData.filter(user => user?.email !== removeUser?.email);
    const updatedAccessList = {
      investorAccessList: newInvestorList,
    };
    updateProperty(updatedAccessList, 'propertyDetail');
    handleCloseDeleteModal();
  };

  const handleAddUserClick = () => {
    addInvestor(propertyDetail?.dataObj?.investorAccessList);
    setSelectedUser(null);
    setInputValue('');
  };

  useEffect(() => {
    setInvestorStatus(propertyDetail?.dataObj?.investorAccessStatus);
    if (propertyDetail?.dataObj?.investorAccessList?.length) {
      const userData = propertyDetail?.dataObj?.investorAccessList?.map(item => ({
        name: item.name || '-',
        email: item.email || '--',
        action: <ActionCell remove={handleRemoveUser} id={item} />,
      }));
      setInvestorAccessList(userData);
    } else setInvestorAccessList([]);
  }, [propertyDetail]);


  return (
    <>
      <div className="heading fw-bolder">Investor Access List</div>
      <div className="text-end px-4 py-2">
        <SimpleToggleSwitch
          status={investorStatus}          
          handleToggle={() => updateInvestorStatus(!investorStatus)}
          disabled={view || investorAccessListStatus?.isLoading}
        />

        {!view && (
          <div className="d-flex mt-2">
            <Autocomplete             
              options={searchResult?.res || []}
              getOptionLabel={user => user && user?.email}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                handleSearchInput(newInputValue);
              }}
              value={selectedUser}
              onChange={(event, newValue) => {
                setSelectedUser(newValue);
              }}
              isOptionEqualToValue={(option, value) => option?.email === value?.email}
              renderInput={params => (
                <TextField {...params} label="Search for a user" variant="outlined" />
              )}
              className="search_user"
              noOptionsText="No user found"
              open={open}
              inputValue={inputValue}
              onOpen={() => {
                if (inputValue) {
                  setOpen(true);
                }
              }}
              onClose={() => setOpen(false)}
            />
            <Button className="button-color" onClick={handleAddUserClick} disabled={propertyDetail?.isLoading || !selectedUser}>
              Add User
            </Button>
          </div>
        )}
      </div>
      <DatatableTables        
        column={
          view
            ? InvestorAccessListColumn.filter(item => item.field !== 'action')
            : InvestorAccessListColumn
        }
        row={propertyDetail?.isLoading ? 'loading' : investorAccessList}
        paging={false}
      />
      {modal && (
        <DeleteModal
          title="Are you sure you want to remove investor ?"
          close={handleCloseDeleteModal}
          confirm={() => removeInvestor(propertyDetail?.dataObj?.investorAccessList)}
        />
      )}
    </>
  );
};

export default InvestorAccessList;
