import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Spinner } from 'reactstrap';
import { commonSaga, commonSuccess } from 'store/actions';

const WhiteListModal = ({ id, close }) => {
  const dispatch = useDispatch();
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));

  useEffect(() => {
    if(commonData?.userFlagUpdate?.dataUpdated) {
      close();
      dispatch(commonSuccess({stateObj: "userFlagUpdate", dataUpdated: false}));
    }
  }, [commonData?.userFlagUpdate]);

  const whiteList = () => {
    dispatch(commonSaga({endPoint: '/admin/blacklist', type: "put", stateObj: "userFlagUpdate", dataToPost: { userId: id, blacklistType: 'none'}, 'msg': `Investor Successfully Whitelisted!`, showAlert: true}));
  };

  return (
    <>
      <div>
        <Modal isOpen centered>
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="myModalLabel">
              Whitelist
            </h5>
            <button
              type="button"
              onClick={close}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-center">
            <h5> Are you sure you want to whitelist the user?</h5>
            {/* <div className="form-group">
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder="Give Reason"
              />
            </div> */}
          </div>

          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light dropdownColor w-50"
              onClick={whiteList}
              disabled={commonData?.userFlagUpdate?.isLoading}
            >
              {commonData?.userFlagUpdate?.isLoading ? <Spinner size="sm" /> : 'Confirm'}
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default WhiteListModal;
