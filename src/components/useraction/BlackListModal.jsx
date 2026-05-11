import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Spinner } from 'reactstrap';
import { commonSaga, commonSuccess } from 'store/actions';

const BlackListModal = ({ id, close }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState('Complete');
  const { commonData } = useSelector((state) => ({
    commonData: state.common,
  }));

  useEffect(() => {
    if(commonData?.userFlagUpdate?.dataUpdated) {
      close();
      dispatch(commonSuccess({stateObj: "userFlagUpdate", dataUpdated: false}));
    }
  }, [commonData?.userFlagUpdate]);

  const blacklistuser = () => {
    dispatch(commonSaga({endPoint: '/admin/blacklist', type: "put", stateObj: "userFlagUpdate", dataToPost: { userId: id, blacklistType: type, reason: ''}, 'msg': `Investor Successfully Blacklisted!`, showAlert: true}));
  };

  const handleChange = e => setType(e.target.value);
  return (
    <>
      <div>
        <Modal isOpen centered>
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="myModalLabel">
              BlackList User
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
          <div className="modal-body">
            <p> Are you sure you want to blacklist the user?</p>
            <div className="col-sm-auto mb-4">
              <label className="" htmlFor="autoSizingSelect">
                Blacklist From
              </label>
              <select className="form-select" id="autoSizingSelect" onChange={handleChange}>
                <option value="complete">Completely BlackList</option>
                <option value="fromInvestments">From Investments</option>
              </select>
            </div>
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
              onClick={blacklistuser}
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

export default BlackListModal;
