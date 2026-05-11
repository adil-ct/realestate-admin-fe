/* eslint-disable no-underscore-dangle */
import { Card, Button, CardBody, Col, Container, Media, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import SimpleToggleSwitch from 'components/Switch/SimpleToggleSwitch';
import AddPaymentMethods from 'components/UI/Model/AddPaymentMethods';
import { PaymentMethodsColumn } from 'constants/tableColumn';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import { deleteObjKeys } from 'utils/helperFunction';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import { commonSaga } from 'store/actions';

import '../ViewUser/ViewUser.css';

const MethodDetails = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { commonData } = useSelector((stateObj) => ({
    commonData: stateObj.common,
  }));
  
  const [pmModal, setPMModal] = useState({show: false, data: {}});
  const [platformsList, setPlatformsList] = useState([]);
  const [modalType, setModalType] = useState(true);
  const [breadcrum, setBreadcrum] = useState([]);

  const {
    canDeposit,
    canWithdraw,
    description,
    icon,
    isHidden,
    method,
    platform,
    subHeading,
    _id,
  } = state.data;

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

  const handleView = (item, type) => {
    setModalType("view");
    setPMModal({show: true, data: item, type});
  }
  const handleEdit = (item, type) => {
    setModalType("edit");
    setPMModal({show: true, data: item, type});
  }

  useEffect(() => {
      setBreadcrum([
        {
          name: 'Payment Methods',
          link: '/payment-methods',
        },
        { name: method },
      ]);

      setPlatformsList(platform);
  }, []);

  useEffect(() => {
    if(platformsList?.length) {
      platformsList?.forEach(ele => {
        const obj = ele;
        obj.type = pmType(obj);
        obj.method = obj?.name || obj?.method;
        obj.updatedAt = moment(new Date(obj.updatedAt)).format('lll');
        obj.status = <SimpleToggleSwitch disabled status={!obj.isHidden} key={ele._id} />;
        obj.action = <ActionCell view={() => handleView(obj, 'platform')} edit={() => handleEdit(obj, 'platform')} id={obj?._id} />;
      });
    }
  }, [platformsList])

  useEffect(() => {
    if(commonData?.createPaymentMethod?.dataSaved || commonData?.updatePaymentMethod?.dataUpdated) {
        setPMModal({show: false, data: {}});
        setModalType("create");
        navigate('/payment-methods');
    }
  }, [commonData?.createPaymentMethod, commonData?.updatePaymentMethod]);

  const onSubmit = (values) => {
    const tempObj = {};
    tempObj.canDeposit = values.booleanArr.indexOf('canDeposit') !== -1;
    tempObj.canWithdraw = values.booleanArr.indexOf('canWithdraw') !== -1;
    tempObj.isHidden = values.booleanArr.indexOf('isHidden') !== -1;

    let alterObj = {
      ...values,
      ...tempObj
    }

    alterObj = deleteObjKeys(['name', 'method', 'booleanArr'], alterObj);

    if(pmModal?.type === "platform") {
      const otherPlatforms = platform.map(ele => {
        ele = deleteObjKeys(['action', 'status', 'type', 'countries', 'updatedAt', 'method', 'booleanArr'], ele);
    
        if(ele._id === pmModal?.data?._id) {
          ele.canDeposit = values.booleanArr.indexOf('canDeposit') !== -1;
          ele.canWithdraw = values.booleanArr.indexOf('canWithdraw') !== -1;
          ele.isHidden = values.booleanArr.indexOf('isHidden') !== -1;
          ele.subHeading = values.subHeading || ele.subHeading;
          ele.description = values.description || ele.description;
          ele.icon = values.icon || ele.icon;
        }
        return ele;
      });

        alterObj = {
            platform: [
              ...otherPlatforms,
            ]
        }
    }

    if (modalType === "create") {
      dispatch(commonSaga({endPoint: "/payment/Payment-method", type: "post", stateObj: "createPaymentMethod", dataToPost: alterObj, 'msg': 'Payment Method Created Successfully!', showAlert: true, baseEP: "PAYMENT"}));
    } else {
      dispatch(commonSaga({endPoint: `/payment/update-Payment-method/${_id}`, type: "patch", stateObj: "updatePaymentMethod", dataToPost: alterObj, 'msg': 'Payment Method Updated Successfully!', showAlert: true, baseEP: "PAYMENT"}));
    }
  }

  return (
    <div className="page-content me-2">
      <Row>
        <Col md={11} xs={11}>
          <Breadcrumb
            items={breadcrum}
          />
        </Col>
        <Col md={1} xs={1}>
            <Button onClick={() => handleEdit(state?.data, 'method')} className="text-center btn mx-1">
              <span className="mx-2 mt-3">Edit</span>
            </Button>
          </Col>
      </Row>
      <Container fluid>
        <Row>
          <Card>
            <CardBody className="d-flex flex-wrap">
              <Col lg="4" md="12">
                <Media className="d-flex">
                  <div className="ms-3">
                    <img src={icon} alt="" className="avatar-md rounded-circle img-thumbnail" />
                  </div>
                  <Media body className="flex-1 align-self-center">
                    <div className="text-muted">
                      <div className="d-flex">
                        <h5 className="ml-2 view-user-title">
                          {method}
                        </h5>
                      </div>
                    </div>
                  </Media>
                </Media>
              </Col>
              <Col lg="4" md="6">
                <div className="text-center">
                  <div className="d-flex">
                    <h6 className="mx-2 mt-3">Can Withdraw : {canWithdraw ? 'Yes' : 'No'}</h6>
                  </div>
                  <div className="d-flex">
                    <h6 className="mx-2 mt-3">Can Deposit : {canDeposit ? 'Yes' : 'No'}</h6>
                  </div>
                  <div className="d-flex">
                    <h6 className="mx-2 mt-3">Hidden : {isHidden ? 'Yes' : 'No'}</h6>
                  </div>
                </div>
              </Col>
              <Col lg="4" md="6">
                <div className="d-flex">
                  <h6 className="mx-2 mt-3"> Description: {description}</h6>
                </div>
                <div className="d-flex">
                  <h6 className="mx-2 mt-3">Heading: {subHeading || '-'}</h6>
                </div>
              </Col>
            </CardBody>
          </Card>
        </Row>

        {platformsList?.length > 0 && 
            <Container fluid>
            <Row>            
                <Card>
                    <h4 className="mx-4 mt-3">Platforms</h4>
                    <CardBody>
                    <DatatableTables
                        striped
                        column={PaymentMethodsColumn}
                        row={platformsList}
                        paging={false} 
                    />
                    </CardBody>
                </Card>
            </Row>
            </Container>
        }
        <AddPaymentMethods
            modalType={modalType}
            setModalType={setModalType}
            isOpen={pmModal?.show}
            onClose={setPMModal}
            data={pmModal?.data}
            onSubmit={onSubmit}
        />
      </Container>
    </div>
  );
};
export default MethodDetails;
