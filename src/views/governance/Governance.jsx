/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import moment from 'moment';

import { NavigationLabel, MultiProgress } from 'components/Table/tableComponents';
import { governanceColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import MultiSelect from 'components/MultiSelect';
import Breadcrumb from 'components/BreadCrumb';
import { commonSaga } from 'store/actions';
import AdminsProposals from './AdminsProposals';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';

const Governance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    approvalStatus: '',
    startDate: '',
    endDate: '',
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [dateRange, setDateRange] = useState(['', '']);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('proposals');

  const toggleTab = flag => {
    if (activeTab !== flag) {
      setActiveTab(flag);
    }
  };

  const handleView = item =>
    navigate(`/view-proposal/${item}`,
      {state: { data: item, items: [{ name: 'Governance', link: '/governance' }] },
    });

  const action = ind => <ActionCell view={handleView} id={ind} />;

  const getList = query => {
    dispatch(
      commonSaga({
        endPoint: `/proposals/proposals?${query}`,
        type: 'get',
        stateObj: 'proposalsList',
        baseEP: 'INVESTOR',
      }),
    );
  };

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  const handleFilter = (val, name) => {
    setFilter(prev => ({ ...prev, [name]: val }));
  };

  useEffect(() => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== 'all')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    getList(query);
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      setFilter(prev => ({
        ...prev,
        startDate: moment(new Date(dateRange[0])).format('YYYY-MM-DD'),
        endDate: moment(new Date(dateRange[1])).format('YYYY-MM-DD'),
      }));
    } else {
      setFilter(prev => ({ ...prev, startDate: '', endDate: '' }));
    }
  }, [dateRange]);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };
  /* Pagination Config */

  useEffect(() => {
    if (commonData?.proposalsList?.dataObj?.list?.length) {
      commonData?.proposalsList?.dataObj?.list?.forEach(ele => {
        const obj = ele;
        obj.title = NavigationLabel({
          title: obj?.title,
          link: `/view-proposal/${ele?._id}?property=${ele?.propertyId?._id}&via=governance`,
        });
        obj.startDate = moment(new Date(obj?.votingStartDate)).format('lll');
        obj.propertyName = obj?.propertyId?.name;
        obj.votes =
          !obj?.votedFor && !obj?.votedAgainst
            ? '0'
            : MultiProgress({ success: obj?.votedFor, light: 0, danger: obj?.votedAgainst });
        obj.endDate = moment(new Date(obj?.votingEndDate)).format('lll');
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.proposalsList?.dataObj?.totalCount / filter?.limit),
        count,
        itemCount: commonData?.proposalsList?.dataObj?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [commonData?.proposalsList]);

  return (
    <div className="page-content">
      <div className="ps-2">
        <Breadcrumb name="Governance" />
      </div>
      <Nav pills className="nav-justified bg-light p-2  portfolioNav">
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'proposals' ? 'active' : ''}
            onClick={() => {
              toggleTab('proposals');
            }}
          >
            <span className="d-sm-block">Property Manager</span>
          </NavLink>
        </NavItem>
        <NavItem className="waves-effect waves-light">
          <NavLink
            className={activeTab === 'admins' ? 'active' : ''}
            onClick={() => {
              toggleTab('admins');
            }}
          >
            <span className="d-sm-block">Admins</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="p-2 text-muted">
        <TabPane tabId="proposals">
          <Container fluid>
            <div className="investor-background">
              <div className="investor-maincontainer">
                <div className="dflex">
                  <DatePicker
                    selectsRange="true"
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Date Range Filter"
                    onChange={update => {
                      setDateRange(update);
                    }}
                    isClearable="false"
                  />
                  <MultiSelect
                    title="Approval Status"
                    selectAll="true"
                    options={['Approved', 'Rejected', 'Pending']}
                    name="approvalStatus"
                    className="ml15"
                    onSelect={handleFilter}
                  />
                  <MultiSelect
                    title="Status"
                    selectAll="true"
                    options={['Pending', 'Rejected', 'Not started', 'In progress', 'Completed']}
                    name="status"
                    className="ml15"
                    onSelect={handleFilter}
                  />
                </div>
                <div className="d-flex">
                  <SearchInput onChange={handleChange} />
                </div>
              </div>
              <DatatableTables
                column={governanceColumn}
                action={action}
                row={
                  commonData?.proposalsList?.isLoading
                    ? 'loading'
                    : commonData?.proposalsList?.dataObj?.list
                }
                paginationConfig={paginationConfig}
                paging={false}
              />
            </div>
          </Container>
        </TabPane>
        <TabPane tabId="admins">{activeTab === 'admins' && <AdminsProposals />}</TabPane>
      </TabContent>
    </div>
  );
};

export default Governance;
