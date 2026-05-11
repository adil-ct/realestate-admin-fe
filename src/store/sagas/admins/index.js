import errorHandler from 'utils/apiHandler';
import { put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import {
  adminStart,
  adminFail,
  getAdminDetailsSuccess,
  updateAdminSuccess,
  deleteAdminSuccess,
  adminListSuccess,
  generateTempPasswordSuccess,
  updateAdminStatusSuccess,
} from '../../actions';

import * as actionLabels from '../../actionLabels';

export function* getAdminListSaga({ payload }) {
  yield put(adminStart());
  yield errorHandler({
    endpoint: `/admin/getAdminList?${payload}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(adminListSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(adminFail({ response, type: actionLabels.GET_ADMIN_LIST_SAGA }));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
  });
}

export function* getAdminDetailsSaga(action) {
  const { id } = action.payload;

  yield put(adminStart());
  yield errorHandler({
    endpoint: `/admin/admin-details/${id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getAdminDetailsSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(adminFail({ response, type: actionLabels.GET_ADMIN_DETAILS_SAGA }));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
  });
}

export function* updateAdminSaga(action) {
  const { name, mobileNumber, status, id } = action.payload;
  yield put(adminStart());
  yield errorHandler({
    endpoint: `/admin/update-admin/${id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(updateAdminSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(adminFail({ response, type: actionLabels.UPDATE_ADMIN_SAGA }));
      toast.error(response);
    },
    payload: { name, mobileNumber, status },
    failHandlerType: 'CUSTOM',
    apiType: 'put',
  });
}

export function* deleteAdminSaga(action) {
  const { id } = action.payload;
  yield put(adminStart());
  yield errorHandler({
    endpoint: `/admin/delete-admin/${id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(deleteAdminSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(adminFail({ response, type: actionLabels.DELETE_ADMIN_SAGA }));
      toast.error(response);
    },
    failHandlerType: 'CUSTOM',
    apiType: 'delete',
  });
}

export function* tempPWDGenerate(action) {
  const { id } = action.payload;

  yield put(adminStart('generatingTempPass'));
  yield errorHandler({
    endpoint: `/admin/sendTempPassword`,
    successHandler: yield function* (response) {
      const { data } = response;
      toast.success('Temporary Password sent to email successfully.');
      yield put(generateTempPasswordSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(
        adminFail({ response, type: actionLabels.TEMP_PWD_SAGA, load: 'generatingTempPass' }),
      );
      toast.error(response);
    },
    failHandlerType: 'CUSTOM',
    payload: { id },
    apiType: 'post',
  });
}

export function* updateAdminStatusSaga(action) {
  const { id, handleSuccess } = action.payload;
  yield put(adminStart());
  yield errorHandler({
    endpoint: `/admin/change-status/${id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(updateAdminStatusSuccess(data));
      toast.success(response?.msg);
      handleSuccess();
    },
    failHandler: yield function* (response) {
      yield put(adminFail({ response, type: actionLabels.UPDATE_ADMIN_STATUS_SAGA }));
      toast.error(response);
    },
    failHandlerType: 'CUSTOM',
    apiType: 'put',
  });
}