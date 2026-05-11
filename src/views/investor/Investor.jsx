/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import Switch from 'react-switch';

import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import { NavigationLabel } from 'components/Table/tableComponents';
import WhiteListModal from 'components/useraction/WhiteListModal';
import BlackListModal from 'components/useraction/BlackListModal';
import { getEarlyInvestor, commonSaga } from 'store/actions';
import { investorColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';

import '../viewcommon.css';

const InvestorManagement = () => {
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));
  const { userList, loading } = useSelector(state => state.user);
  
  const [filter, setFilter] = useState({ startIndex: 1, itemsPerPage: 10, kycStatus: '', sendData: '' });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [investorData, setInvestorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isWhite, setWhite] = useState(false);
  const [isBlack, setBlack] = useState(false);
  const [count, setCount] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleView = item => navigate(`/view-user/${item?._id}?via=investor`,{ state:{search: '?via=investor'}});
  const hadleWhiteList = item => {
    setWhite(item?._id);
  };
  const handleBlackList = item => {
    setBlack(item?._id);
  };

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, startIndex: page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };
  /* Pagination Config */
  const Offsymbol = () => <div className="uncheckedicon" />;
  const OnSymbol = () => <div className="checkedicon" />;

  const onSwitchChange = (obj) => {
    const alterObj = {affiliate: !obj?.affiliate};
    obj.isProcessing = true;
    dispatch(commonSaga({endPoint: `/user/affiliate/${obj?._id}`, type: "put", stateObj: "updateAffiliateState", dataToPost: alterObj, 'msg': 'Affiliate Status Updated Successfully!', showAlert: true}));
  }

  useEffect(() => {
    const detail = userList?.items?.map(item => ({
      name: <NavigationLabel title={`${item.firstName || ''} ${item.lastName || '-'}`} link={`/view-user/${item?._id}?via=investor`} />,
      email: item.email,
      kyc: item.kycStatus,
      affiliate: <Switch id={item?._id} key={item?._id} uncheckedIcon={<Offsymbol />} checkedIcon={<OnSymbol />}
          onColor="#00FF00" onChange={() => onSwitchChange(item)} checked={item?.affiliate} disabled={item?.isProcessing} />,
      deposite: '-',
      date: item.lastLoggedIn ? new Date(item.lastLoggedIn).toLocaleString() : '-',
      action: (
        <ActionCell
          view={handleView}
          id={item}
          whitelist={["frominvestments", "investment", "complete"].indexOf(item.blacklilstType?.toLowerCase()) !== -1 ? hadleWhiteList : false}
          blacklist={!item.blacklilstType || item.blacklilstType === 'none' ? handleBlackList : false}
        />
      ),
    }));

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(userList?.totalItems / 10),
      count,
      itemCount: userList?.totalItems,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
 
    setInvestorData(detail);
  }, [userList]);

  const getInvestorList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(getEarlyInvestor({ list: 'admin/getInvestorList', field: 'userList', query }));
  }

  useEffect(() => {
    getInvestorList();
  }, [JSON.stringify(filter)]);

  const handleSearch = val => {
    setFilter(prev => ({ ...prev, search: val || undefined, startIndex: 1 }));
  };

  const handleFilter = (val, name) => {
    setFilter(prev => ({ ...prev, [name]: val }));
  };

  useEffect(() => {
    if(commonData?.userFlagUpdate?.dataUpdated || commonData?.updateAffiliateState?.dataUpdated) {
      getInvestorList();
    }
  }, [commonData?.userFlagUpdate, commonData?.updateAffiliateState]);

  const exportHandler = (val) => {
    const flag = val === "CSV" ? "toCsv" : "toXls";
    setFilter(prev => ({ ...prev, sendData: flag }));
    toast.success("Statement has been sent to your linked email.");
  }

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="Investors" />
        <div>
          <ButtonDropDown
            title="Export"
            options={['CSV', 'XLS']}
            name="sendData"
            onClick={exportHandler}
            noAll
          />
        </div>
      </div>

      <Container fluid>
        <div className="investor-background">
          <div className="investor-maincontainer">
            <ButtonDropDown
              title="KYC Status"
              options={['created', 'approved', 'pending', 'declined']}
              name="kycStatus"
              onClick={handleFilter}
            />
            <div className="d-flex">
              <div className="btn-group me-1 mt-2">
                <SearchInput onChange={handleSearch} />
              </div>
            </div>
          </div>
          <DatatableTables paginationConfig={paginationConfig} paging={false} column={investorColumn} row={loading ? 'loading' : investorData} />
        </div>
        {isWhite && <WhiteListModal id={isWhite} close={hadleWhiteList} />}
        {isBlack && <BlackListModal id={isBlack} close={handleBlackList} />}
      </Container>
    </div>
  );
};

export default InvestorManagement;
