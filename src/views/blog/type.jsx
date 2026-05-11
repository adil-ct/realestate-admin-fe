/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'reactstrap';
import moment from 'moment';

import TypeModal from 'components/UI/Model/blogs/TypeModal';
import { commonSaga, commonSuccess } from 'store/actions';
import { TypeColumn } from 'constants/blogsTableColumn';
import DatatableTables from 'components/Table/Table';
import SearchInput from 'components/SearchInput';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';
import './index.css';

const Type = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));

  const [filter, setFilter] = useState({page: 1,limit: 10,search: ''});
  const [typeModal, setTypeModal] = useState({show: false, data: {}});
  const [paginationConfig, setPaginationConfig] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [modalType, setModalType] = useState('create');

  useEffect(() => {
    if (userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  const _getTypeList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');

    dispatch(commonSaga({endPoint: `/admin/blog-types?${query}`, type: 'get', stateObj: 'typeList'}));
  };

  useEffect(() => {
    _getTypeList();
  }, [JSON.stringify(filter)]);

  const onPageChange = page => setFilter(prev => ({ ...prev, page }));

  const handleChange = val => {
    setFilter(prev => ({ ...prev, search: val }));
  };

  const typeDetailsModal = (item, flag) => {
    setModalType(flag);
    setTypeModal({show: true, data: item});
  }

  useEffect(() => {
    if (commonData?.typeList?.dataObj?.blogType?.length) {
      commonData?.typeList?.dataObj?.blogType?.forEach(ele => {
        const obj = ele;
        obj.created = moment(new Date(obj.createdAt)).format('lll');
        obj.state = <span className={obj?.isHidden ? "inActiveBadge" : 'activeBadge'}>{obj?.isHidden ? "HIDDEN" : 'PUBLISHED'}</span>;
        obj.action = <ActionCell view={() => typeDetailsModal(obj, "view")} edit={() => typeDetailsModal(obj, "edit")} id={obj?._id} />;
      });
    }

    const paginationConfigTemp = {
      currentPage: filter.page,
      pageCount: Math.ceil(commonData?.typeList?.dataObj?.totalCount / filter?.limit),
      itemCount: commonData?.typeList?.dataObj?.totalCount,
      onPageChange,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [commonData?.typeList?.dataObj]);

  useEffect(() => {
    if (commonData?.createType?.dataSaved || commonData?.updateType?.dataUpdated) {
      _getTypeList();
      if(commonData?.createType?.dataSaved) {
        dispatch(commonSuccess({stateObj: "createType", dataSaved: false}));
      } else {
        dispatch(commonSuccess({stateObj: "updateType", dataUpdated: false}));
      }
    }
  }, [commonData?.createType, commonData?.updateType?.dataObj]);

  return (
    <div className="page-content">
      <div className="breadcrumb_btn">
        <Breadcrumb name="Blog Type" />
        <div className="dflex">
          {isSuperAdmin && (
            <Button className="button-color mx-2" onClick={() => {setModalType("create");setTypeModal({show: true, data: {}})}}>
              Add Type
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
            column={TypeColumn}
            row={commonData?.typeList?.isLoading ? 'loading' : commonData?.typeList?.dataObj?.blogType}
          />
        </div>
      </Container>
      <TypeModal
        modalType={modalType}
        setModalType={setModalType}
        isOpen={typeModal?.show}
        onClose={setTypeModal}
        data={typeModal?.data}
      />
    </div>
  );
};

export default Type;
