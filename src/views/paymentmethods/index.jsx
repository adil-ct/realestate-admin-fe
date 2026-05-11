/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import {Container, Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import moment from 'moment';

import AddPaymentMethods from 'components/UI/Model/AddPaymentMethods';
import { PaymentMethodsColumn } from 'constants/tableColumn';
import { commonSaga, commonSuccess } from 'store/actions';
import { deleteObjKeys } from 'utils/helperFunction';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import Breadcrumb from 'components/BreadCrumb';
import Switch from 'react-switch';

import "react-datepicker/dist/react-datepicker.css";
import '../viewcommon.css';

const PaymentMethods = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { commonData } = useSelector((state) => ({
      commonData: state.common,
    }));

    const [pmModal, setPMModal] = useState({show: false, data: {}});
    const [paginationConfig, setPaginationConfig] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10});
    const [modalType, setModalType] = useState(true);

    const _getList = () => {
      const query = Object.keys(filter)
      .filter(item => filter[item] !== undefined && filter[item] !== '' && filter[item] !== "Transaction Type" && filter[item] !== "Status")
      .map(item => `${item}=${filter[item]}`)
      .join('&');

      dispatch(commonSaga({endPoint: `/payment/payment-methods?${query}`, type: "get", stateObj: "paymentMethodsList", baseEP: "PAYMENT"}));
    }

    useEffect(() => {
      _getList();
    }, [JSON.stringify(filter)]);

    useEffect(() => {
      if(commonData?.createPaymentMethod?.dataSaved || commonData?.updatePaymentMethod?.dataUpdated) {
          setPMModal({show: false, data: {}});
          setModalType("create");

          if(commonData?.createPaymentMethod?.dataSaved) {
            dispatch(commonSuccess({stateObj: "createPaymentMethod", dataSaved: false}));
          }
          if(commonData?.updatePaymentMethod?.dataUpdated) {
            dispatch(commonSuccess({stateObj: "updatePaymentMethod", dataUpdated: false}));
          }
          _getList();
      }
    }, [commonData?.createPaymentMethod, commonData?.updatePaymentMethod]);
    
    const onPageChange = page => setFilter(prev => ({ ...prev, page }));
  
    const handleView = item => {
      item = deleteObjKeys(['action', 'status'], item);
      navigate('/payment-method-details', {state: { data: item } });
    }

    const pmType = (obj) => {
      let _type = '-';
      if(obj?.canWithdraw) {
        _type = "Can Withdraw";
      } 
      if(obj?.canDeposit) {
        _type = "Can Deposit";
      } 
      
      if(obj?.canDeposit && obj?.canWithdraw) {
        _type = "Can Deposit, Can Withdraw";
      } else if (!obj?.canDeposit && !obj?.canWithdraw) {
        _type = '-';
      }
      return _type;
    }
    
    const Offsymbol = () => <div className="uncheckedicon" />;
    const OnSymbol = () => <div className="checkedicon" />;
    const onSwitchChange = (obj) => {
      const alterObj = {isHidden: !obj.isHidden};
      dispatch(commonSaga({endPoint: `/payment/update-Payment-method/${obj?._id}`, type: "patch", stateObj: "updatePaymentMethod", dataToPost: alterObj, 'msg': 'Payment Method Updated Successfully!', showAlert: true, baseEP: "PAYMENT"}));
    }

    useEffect(() => {
      if(commonData?.paymentMethodsList?.dataObj?.length) {
        commonData?.paymentMethodsList?.dataObj?.forEach(ele => {
          const obj = ele;
          obj.updatedAt = moment(new Date(obj.updatedAt)).format('lll');
          obj.type = pmType(obj);
          obj.status = <Switch id={ele?._id} key={ele?._id} uncheckedIcon={<Offsymbol />} checkedIcon={<OnSymbol />}
          onColor="#00FF00" onChange={() => onSwitchChange(obj)} checked={!obj.isHidden} />
          obj.action = <ActionCell view={() => handleView(obj)} id={obj?._id} />;
        });
      }
      const paginationConfigTemp = {
        currentPage: filter.page,
        pageCount: Math.ceil(commonData?.paymentMethodsList?.dataObj?.totalCount / filter?.limit),
        itemCount: commonData?.paymentMethodsList?.dataObj?.totalCount,
        onPageChange,
      };
      setPaginationConfig(paginationConfigTemp);
    }, [commonData?.paymentMethodsList?.dataObj]);

    const addMethodModel = () => {
        setModalType("create");
        setPMModal({show: true, data: {}});
    }

    const handelSort = (sortObj) =>  {
      if(sortObj?.column === "amount") {
        setFilter(prev => ({ ...prev, sortBy: "price", "sortKey" : sortObj?.direction === "desc" ? '-1' : '1' }));
      }
    }

  return (
    <div className="page-content">
        <div className="breadcrumb_btn">
            <Breadcrumb name="Payment Methods" />
            <div className="dflex">
              <Button disabled className="button-color mx-2" onClick={addMethodModel}>
                Add Method
              </Button>
            </div>
        </div>

      <Container fluid>
          <div className="investor-background">
            <DatatableTables
              paginationConfig={paginationConfig} 
              paging={false} 
              column={PaymentMethodsColumn} 
              handelSort={handelSort}
              row={commonData?.paymentMethodsList?.isLoading ? "loading" :  commonData?.paymentMethodsList?.dataObj} 
            />
          </div>
      </Container>
      <AddPaymentMethods
        modalType={modalType}
        setModalType={setModalType}
        isOpen={pmModal?.show}
        onClose={setPMModal}
        data={pmModal?.data}
      />
    </div>
  );
};

export default PaymentMethods;
