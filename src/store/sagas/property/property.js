import { put } from 'redux-saga/effects';
import errorHandler from 'utils/apiHandler';
import { toast } from 'react-toastify';
import {
  getPropertyListStart,
  getPropertyListSuccess,
  getPropertyListFail,
  createPropertyStat,
  createPropertySuccess,
  createPropertyFail,
  mintPropertyStart,
  mintPropertySuccess,
  mintPropertyFail,
  mintProperty,
  deletePropertyStart,
  deletePropertyFail,
  deletePropertySuccess
} from 'store/actions';
import { marketMain } from 'http/axios/axios_main';

export function* fetchPropertyList({ payload }) {
  yield put(getPropertyListStart());
  yield errorHandler({
    endpoint: `/property?${payload || ''}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getPropertyListSuccess(data));
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(getPropertyListFail(response));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
    token: true,
  });
}

export function* addProperty(action) {
  yield put(createPropertyStat());
  const { _id, data, success, event, status, onFail } = action.payload;

  delete data.venly;
  delete data.blockchainAddress;

  yield errorHandler({
    endpoint: _id
      ? status === 'Draft'
        ? `/property/${_id}`
        : `/property/${_id}/updateMintedProperty`
      : '/property',
    successHandler: yield function* (response) {
      if (event === 'mint') {
        yield put(mintProperty({ id: _id, success }));
        return;
      }
      yield put(createPropertySuccess(response.data));
      if (success) yield success(response.data);
    },
    failHandler: yield function* (response) {
      if (onFail) yield onFail();
      yield toast.error(response);
      yield put(createPropertyFail(response));
    },
    payload: data,
    failHandlerType: 'CUSTOM',
    apiType: _id ? 'patch' : 'post',
    token: true,
  });
}

export function* mintPropertySaga({ payload }) {
  yield put(mintPropertyStart());
  yield errorHandler({
    endpoint: `/property/${payload.id}/mint`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(mintPropertySuccess(data));
      yield payload.success();
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(mintPropertyFail(response));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'post',
    token: true,
  });
}

export function* putOnSaleProperty({ payload }) {
  yield put(mintPropertyStart());
  yield errorHandler({
    endpoint: `/marketplace/put-on-sale/${payload.id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(mintPropertySuccess(data));
      yield payload.success();
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(mintPropertyFail(response));
    },
    baseAxios: marketMain,
    failHandlerType: 'CUSTOM',
    apiType: 'post',
    token: true,
  });
}

export function* buyMogulEquity({ payload }) {
  yield put(mintPropertyStart());
  yield errorHandler({
    endpoint: '/marketplace/invest',
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(mintPropertySuccess(data));
      yield payload.success();
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(mintPropertyFail(response));
    },
    baseAxios: marketMain,
    failHandlerType: 'CUSTOM',
    apiType: 'post',
    token: true,
    payload: payload.data,
  });
}

export function* deleteProperty(action) {
  yield put(deletePropertyStart());
  const { _id } = action.payload;
  yield errorHandler({
    endpoint: `/property/${_id}`,
    successHandler: yield function* () {
      yield put(deletePropertySuccess());
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(deletePropertyFail(response));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'delete',
    token: true,
  });
}