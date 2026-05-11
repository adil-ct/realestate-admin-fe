import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';

import ButtonDropDown from 'components/Dropdowncomponent/DropdownButton';
import { NavigationLabel } from 'components/Table/tableComponents';
import { getEarlyInvestor } from 'store/actions';
import { investorRelationColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';

import '../viewcommon.css';

const InvestorRelation = () => {

  const { investorRelation, loading } = useSelector(state => state.user);

  const [filter, setFilter] = useState({
    startIndex: 1,
    itemsPerPage: 10,  
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [investorRelationData, setInvestorRelation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleView = item =>
    navigate(`/investor-relations/${item?.referralId}`);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, startIndex: page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };
  
  useEffect(() => {
    if (investorRelation?.users?.length) {
      const detail = investorRelation?.users?.map(item => ({
        name: (
          <NavigationLabel
            title={`${item?.firstName || '-'} ${item?.lastName || '-'}`}
            link={`/investor-relations/${item?.referralId}`}
          />
        ),
        email: item?.email || '--',
        phoneNo: item?.mobileNumber || '--',
        kyc: item?.kycStatus || '--',
        earned: `$ ${item?.referralEarnings?.toFixed(2) || '0.00'}` || '--',
        action: <ActionCell view={handleView} id={item} />,
      }));

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(investorRelation?.totalCount / 10),
        count,
        itemCount: investorRelation?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
      setInvestorRelation(detail);
    }else setInvestorRelation([]);
  }, [investorRelation]);

  const getInvestorRelationList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(getEarlyInvestor({ list: 'user/affiliate/users', field: 'investorRelation', query }));
  };

  const handleSearch = val => {
    setFilter(prev => ({ ...prev, search: val || undefined, startIndex: 1 }));
  };

  useEffect(() => {
    getInvestorRelationList();
  }, [filter]);

  const exportHandler = val => {
    const flag = val === 'CSV' ? 'toCsv' : 'toXls';
    setFilter(prev => ({ ...prev, sendData: flag }));
    toast.success('Statement has been sent to your linked email.');
  };

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="Investor Relations" />
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
            <div className="d-flex">
              <div className="btn-group me-1 mt-2">
                <SearchInput onChange={handleSearch} />
              </div>
            </div>
          </div>
          <DatatableTables
            paginationConfig={paginationConfig}           
            column={investorRelationColumn}
            row={loading ? 'loading' : investorRelationData}
            paging={false}
          />
        </div>
      </Container>
    </div>
  );
};

export default InvestorRelation;
