import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Container, Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { comparablePropertyColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';
import { getComparableProperty, commonSaga } from 'store/actions';
import CreateComparableProperty from 'components/UI/Model/comparableProperty/CreateComparableProperty';
import DeleteModal from 'components/UI/Model/DeleteModal';

import 'react-datepicker/dist/react-datepicker.css';
import '../viewcommon.css';

const ComparableProperty = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    promoStartDate: '',
    promoEndDate: '',
  });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState('');
  const [promotionList, setPromotionList] = useState([]);
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [property, setProperty] = useState(null);
  const { comparableList, loading } = useSelector(state => state.market);

  const getComparablePropertyList = () => {
    const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '')
      .map(item => `${item}=${filter[item]}`)
      .join('&');
    dispatch(getComparableProperty({ query }));
  }


  const handleView = (item) =>
    navigate(`/comparable-property/${item?._id}/view`);


  const handleEdit = (item) =>
    navigate(`/comparable-property/${item?._id}/edit`);


  const handleCreatePromo = () => setOpen(true);

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page }));
  };

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  const handleRemoveProperty = (item) => {
    setShowDeleteModal(true);
    setProperty(item);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const removeComparableProperty = () => {
    const onSuccess = () => {
      handleCloseDeleteModal()
      getComparablePropertyList()
      toast.success(`${property?.name} deleted successfully`);
    }

    dispatch(
      commonSaga({
        endPoint: `marketplace/delete-comparable-property/${property?._id}`,
        type: 'delete',
        stateObj: 'removeProperty',
        baseEP: 'MARKETPLACE',
        success: onSuccess
      }),
    );
  }


  useEffect(() => {
    if (comparableList?.data?.length) {
      const detail = comparableList?.data?.map(item => ({
        name: item.name,
        sqFt: item?.sqFt,
        monthlyRent: item?.monthlyRent,
        action: <ActionCell view={handleView} edit={handleEdit} id={item} remove={handleRemoveProperty} />,
      }));

      const paginationConfigTemp = {
        currentPage,
        pageCount: Math.ceil(comparableList?.totalCount / 10),
        count,
        itemCount: comparableList?.totalCount,
        onPageChange,
        updateCurrentCountPage,
      };
      setPaginationConfig(paginationConfigTemp);
      setPromotionList(detail);
    } else setPromotionList([]);
  }, [comparableList]);


  useEffect(() => {
    getComparablePropertyList();
  }, [JSON.stringify(filter)]);

  return (
    <div className="page-content">
      <div className="ps-2">
        <Breadcrumb name="Comparable Property" />
      </div>

      <Container fluid>
        <div className="investor-background">
          <div className="investor-maincontainer">
            <Button className="button-color" onClick={handleCreatePromo}>
              Create
            </Button>
          </div>
          <DatatableTables
            column={comparablePropertyColumn}
            row={loading ? 'loading' : promotionList}
            paginationConfig={paginationConfig}
            paging={false}
          />
        </div>
      </Container>

      <CreateComparableProperty
        isOpen={open}
        close={() => setOpen(false)}
        getComparablePropertyList={getComparablePropertyList}
      />

      {showDeleteModal && (
        <DeleteModal
          title={`Are you sure you want to delete ${property?.name}?`}
          close={handleCloseDeleteModal}
          confirm={removeComparableProperty}
        />
      )}
    </div>
  );
};

export default ComparableProperty;
