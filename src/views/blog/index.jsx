/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'reactstrap';

import DeleteGenericModal from 'components/UI/Model/DeleteGenericModal';
import { commonSaga, commonSuccess } from 'store/actions';
import { BlogsColumn } from 'constants/blogsTableColumn';
import DatatableTables from 'components/Table/Table';
import { deleteObjKeys } from 'utils/helperFunction';
import SearchInput from 'components/SearchInput';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';
import './index.css';

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  const [filter, setFilter] = useState({ page: 1, limit: 10, search: ''});
  const [paginationConfig, setPaginationConfig] = useState({});
  const [deleteState, setDeleteState] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const handleView = () => navigate(`/blogs/add-blog`);

  const handleEdit = (item, type) => {
    item = deleteObjKeys(['profile', 'name', 'action', 'state'], item);
    navigate(`/blogs/add-blog`,{state: { data: {...item, type}}});
  };

  useEffect(() => {
    if (userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  const _getBlogsList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(commonSaga({endPoint: `/admin/admin-blogList?${query}`, type: 'get', stateObj: 'BlogsList'}));
  };

  useEffect(() => {
    if(commonData?.deleteBlogState?.dataDeleted) {
        setDeleteState({isOpen: false});
        dispatch(commonSuccess({stateObj: "deleteBlogState", dataDeleted: false}));
        _getBlogsList();
    }
  }, [commonData?.deleteBlogState]);

  useEffect(() => {
    _getBlogsList();
  }, [JSON.stringify(filter)]);

  const onPageChange = page => setFilter(prev => ({ ...prev, page }));

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  const handleDelete = (item) => setDeleteState({isOpen: true, item});

  const confirmDelete = () => {
    const blogId = deleteState?.item;
    if(blogId) {
      dispatch(commonSaga({endPoint: `/admin/delete/blog/${blogId}`, type: 'delete', stateObj: 'deleteBlogState', msg: 'Blog deleted Successfully!', showAlert: true}));
    }
  }

  useEffect(() => {
    if (commonData?.BlogsList?.dataObj?.blogs?.length) {
      commonData?.BlogsList?.dataObj?.blogs?.forEach(ele => {
        const obj = ele;
        obj.name = <span className="clickableLabel" onClick={() => handleEdit(obj, 'edit')}>{obj?.title}</span>;
        obj.profile = <img alt={obj.image?.key} src={obj.image?.url} height="20" />;
        obj.popular = obj?.isPopular ? "Yes" : "No";
        obj.writer = `${obj?.authorDetails?.firstName || ''} ${obj?.authorDetails?.lastName || ''}`;
        obj.state = <span className={obj?.isHidden ? "inActiveBadge" : 'activeBadge'}>{obj?.isHidden ? "NOT PUBLISHED" : 'PUBLISHED'}</span>;
        obj.action = <ActionCell remove={handleDelete} view={() => handleEdit(obj, "view")} edit={() => handleEdit(obj, "edit")} id={obj?._id} />;
      });
    }
    const paginationConfigTemp = {
      currentPage: filter.page,
      pageCount: Math.ceil(commonData?.BlogsList?.dataObj?.totalCount / filter?.limit),
      itemCount: commonData?.BlogsList?.dataObj?.totalCount,
      onPageChange,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.BlogsList?.dataObj]);

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="All Blogs" />
        <div className="dflex">
          {isSuperAdmin && (
            <Button className="button-color mx-2" onClick={handleView}>
              Add Blog
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
            column={BlogsColumn}
            row={commonData?.BlogsList?.isLoading ? 'loading' : commonData?.BlogsList?.dataObj?.blogs}
          />
        </div>
      </Container>
      <DeleteGenericModal
        isOpen={deleteState?.isOpen}
        onClose={() => setDeleteState(prev => ({ ...prev, isOpen : false }))}
        title="Do you still want to delete this blog?"
        confirm={confirmDelete}
      />
    </div>
  );
};

export default Blog;
