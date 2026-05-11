import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

import PropertiesManagementCard from 'components/card/PropertiesManagementCard';
import { ProposalsColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';
import avatar from 'assets/images/avatar.jpg';
import { commonSaga } from 'store/actions';

import '../viewcommon.css';

const Proposals = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));
  const [reportsData, setReportsData] = useState([])
  const [filter, setFilter] = useState({ page: 1, limit: 10, search: '' });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');

  const handleView = (item) => navigate(`/view-proposal/${item}?property=${id}&via=proposals`);

  const getList = (query) => {
    dispatch(commonSaga({endPoint: `/proposals/property-proposals/${id}?${query}`, type: "get", stateObj: "proposalDetails", baseEP: "INVESTOR"}));
  }

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page}));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };
  /* Pagination Config */

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  useEffect(() => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== "all")
      .map(item => `${item}=${filter[item]}`)
      .join('&');

      getList(query);
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    const reports = [
      {
        id: 1,
        title: 'No. of Proposals',
        icon: 'uil-home-alt fa-3x',
        value: commonData?.proposalDetails?.dataObj?.proposals,
      },
      {
        id: 2,
        title: 'Current Live Proposals',
        icon: 'uil-home-alt fa-3x',
        value: commonData?.proposalDetails?.dataObj?.liveProposals,
      },
      {
        id: 3,
        title: 'Successful Proposals',
        icon: 'uil-home-alt fa-3x',
        value: commonData?.proposalDetails?.dataObj?.successfullProposals,
      },
      {
        id: 4,
        title: 'Last Proposal Date',
        value: commonData?.proposalDetails?.dataObj?.lastProposalDate ? 
          moment(new Date(commonData?.proposalDetails?.dataObj?.lastProposalDate)).format('lll') : 'N/A',
        icon: ' uil-calendar-alt fa-3x',
      },
    ];
    setReportsData(reports);

    commonData?.proposalDetails?.dataObj?.data?.forEach(ele => {
      const obj = ele;
      obj.endDate = moment(new Date(obj?.votingEndDate)).format('lll');
      obj.action = <ActionCell view={handleView} id={obj?._id} />
      obj.status = obj?.result || obj?.status;
    });

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(commonData?.proposalDetails?.dataObj?.data?.totalItems / filter?.limit),
      count,
      itemCount: commonData?.proposalDetails?.dataObj?.data?.totalItems,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);

  }, [commonData?.proposalDetails?.dataObj]);

  return (
    <div className="page-content">
      <Breadcrumb
        items={[
          { name: 'My Portfolio', link: '/portfolio' },
          { name: 'Property', link: `/portfolio-property/${id}` },
          { name: 'Proposals' },
        ]}
      />

      <Container fluid>
        <Card>
          <CardBody className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div>
                <img src={commonData?.proposalDetails?.dataObj?.mainImage?.url || avatar} alt="" className="avatar-md rounded-circle img-thumbnail me-3" />
              </div>
              <div>
                <div>
                  <h5>{commonData?.proposalDetails?.dataObj?.propertyName}</h5>
                  <i>{commonData?.proposalDetails?.dataObj?.city}, {commonData?.proposalDetails?.dataObj?.state}</i>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <Row>
          {reportsData?.map(item => (
            <Col xl="3" key={item?.title}>
              <PropertiesManagementCard name={item.title} score={item.value} icon={item.icon}/>
            </Col>
          ))}
        </Row>
        <div className="investor-background">
          <div className="investor-maincontainer">
            <div />
            <div className="d-flex">
              <SearchInput onChange={handleChange} />
            </div>
          </div>
          <DatatableTables 
            column={ProposalsColumn} 
            paging={false}
            paginationConfig={paginationConfig}
            row={commonData?.proposalDetails?.isLoading ? "loading" :commonData?.proposalDetails?.dataObj?.data}
          />
        </div>
      </Container>
    </div>
  );
};

export default Proposals;
