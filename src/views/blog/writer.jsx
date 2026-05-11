/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'reactstrap';

import WriterModal from 'components/UI/Model/blogs/WriterModal';
import { AuthorsColumn } from 'constants/blogsTableColumn';
import { commonSaga, commonSuccess } from 'store/actions';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import SearchInput from 'components/SearchInput';
import Breadcrumb from 'components/BreadCrumb';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';
import './index.css';

const Writer = () => {
  const dispatch = useDispatch();
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));
  const { userData } = useSelector(state => state.user);

  const [authorModal, setAuthorModal] = useState({show: false, data: {}});
  const [filter, setFilter] = useState({page: 1,limit: 10,search: ''});
  const [paginationConfig, setPaginationConfig] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [modalType, setModalType] = useState('create');

  useEffect(() => {
    if (userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  const _getAuthorsList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(
      commonSaga({
        endPoint: `/admin/authors?${query}`,
        type: 'get',
        stateObj: 'authorsList'
      }),
    );
  };

  useEffect(() => {
    _getAuthorsList();
  }, [JSON.stringify(filter)]);

  const onPageChange = page => setFilter(prev => ({ ...prev, page }));

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  const authorDetailsModal = (item, flag) => {
    setModalType(flag);
    setAuthorModal({show: true, data: item});
  }

  useEffect(() => {
    if (commonData?.authorsList?.dataObj?.authors?.length) {
      commonData?.authorsList?.dataObj?.authors?.forEach(ele => {
        const obj = ele;
        obj.profile = <img alt={obj.profilePic?.key} src={obj.profilePic?.url} height="20" />;
        obj.name = `${obj?.firstName} ${obj?.lastName}`;
        obj.state = <span className={obj?.isHidden ? "inActiveBadge" : 'activeBadge'}>{obj?.isHidden ? "INACTIVE" : 'PUBLISHED'}</span>;
        obj.action = <ActionCell view={() => authorDetailsModal(obj, "view")} edit={() => authorDetailsModal(obj, "edit")} id={obj?._id} />;
      });
    }
    const paginationConfigTemp = {
      currentPage: filter.page,
      pageCount: Math.ceil(commonData?.authorsList?.dataObj?.totalCount / filter?.limit),
      itemCount: commonData?.authorsList?.dataObj?.totalCount,
      onPageChange,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.authorsList?.dataObj]);

  useEffect(() => {
    if (commonData?.createAuthor?.dataSaved || commonData?.updateAuthor?.dataUpdated) {
      _getAuthorsList();
      if(commonData?.createAuthor?.dataSaved) {
        dispatch(commonSuccess({stateObj: "createAuthor", dataSaved: false}));
      } else {
        dispatch(commonSuccess({stateObj: "updateAuthor", dataUpdated: false}));
      }
    }
  }, [commonData?.createAuthor || commonData?.updateAuthor]);

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="Writer" /> 
        <div className="dflex">
          {isSuperAdmin && (
            <Button className="button-color mx-2" onClick={() => {setModalType("create");setAuthorModal({show: true, data: {}})}}>
              Add Writer
            </Button>
          )}
        </div>
      </div>

      <Container fluid>
        <div className="investor-background">
          <div className="investor-maincontainer">
            <SearchInput onChange={handleChange} />
          </div>
          <DatatableTables
            paginationConfig={paginationConfig}
            paging={false}
            column={AuthorsColumn}
            row={commonData?.authorsList?.isLoading ? 'loading' : commonData?.authorsList?.dataObj?.authors}
          />
        </div>
      </Container>
      <WriterModal 
        modalType={modalType}
        setModalType={setModalType}
        isOpen={authorModal?.show}
        onClose={setAuthorModal}
        data={authorModal?.data}
      />
    </div>
  );
};

export default Writer;
