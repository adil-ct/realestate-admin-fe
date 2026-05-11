/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Container } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NavigationLabel, MultiProgress } from 'components/Table/tableComponents';
import { proposalsColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import { commonSaga } from 'store/actions';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';
import CreateProposal from 'components/UI/Model/CreateProposal';

const AdminsProposals = () => {
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
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [paginationConfig, setPaginationConfig] = useState({});
  const [dateRange, setDateRange] = useState(['', '']);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [startDate, endDate] = dateRange;
  const [createProposalModal, setCreateProposalModal] = useState(false);
  const [editProposalModal, setEditProposalModal] = useState(false);

  const getList = query => {
    dispatch(
      commonSaga({
        endPoint: `/proposals/proposals?${query}&admin=true`,
        type: 'get',
        stateObj: 'adminProposalsList',
        baseEP: 'INVESTOR',
      }),
    );
  };
  useEffect(() => {
    if (refreshTrigger) {
      getList();
      setRefreshTrigger(false);
    }
  }, [refreshTrigger]);

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
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

  const handleEdit = proposalId => {
    const data = commonData?.adminProposalsList?.dataObj?.list.find(
      prop => prop._id === proposalId,
    );
    setEditProposalModal(data);
  };

  useEffect(() => {
    if (commonData?.adminProposalsList?.dataObj?.list?.length) {
      commonData?.adminProposalsList?.dataObj?.list?.forEach(ele => {
        const obj = ele;
        obj.preLinkTitle = obj?.title;
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
        obj.action = (
          <i
            title="Edit"
            className="color-green fas fa-edit mx-2"
            role="button"
            onClick={() => {
              if (ele.status !== 'Not started') {
                toast.error('Proposal has already started');
                return;
              }
              handleEdit(ele?._id);
            }}
            disabled={ele.status !== 'Not started'}
          />
        );
      });

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(commonData?.adminProposalsList?.dataObj?.totalCount / filter?.limit),
        count,
        itemCount: commonData?.adminProposalsList?.dataObj?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
    }
  }, [commonData?.adminProposalsList]);

  return (
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
          </div>
          <div className="d-flex">
            <SearchInput onChange={handleChange} />
            <Button
              type="button"
              className="button-color ms-2"
              data-toggle="modal"
              data-target="#myModal"
              onClick={() => setCreateProposalModal('create')}
            >
              Create Proposal
            </Button>
          </div>
        </div>
        <DatatableTables
          column={proposalsColumn}
          // action={action}
          row={
            commonData?.adminProposalsList?.isLoading
              ? 'loading'
              : commonData?.adminProposalsList?.dataObj?.list
          }
          paginationConfig={paginationConfig}
          paging={false}
        />
      </div>
      {createProposalModal && (
        <CreateProposal
          isOpen={createProposalModal}
          close={setCreateProposalModal}
          refresh={setRefreshTrigger}
        />
      )}
      {editProposalModal && (
        <CreateProposal
          isOpen={editProposalModal}
          close={setEditProposalModal}
          edit={editProposalModal}
          refresh={setRefreshTrigger}
        />
      )}
    </Container>
  );
};

export default AdminsProposals;
