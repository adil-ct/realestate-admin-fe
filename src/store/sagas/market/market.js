import { put } from 'redux-saga/effects';
import {
  getMarketSuccess,
  createMarketSuccess,
  createMarketStart,
  createMarketFail,
  getMarketFail,
  getMarketStart,
  deleteMarketSuccess,
  getComparablePropertyStart,
  getComparablePropertySuccess,
  getComparablePropertyFail
} from 'store/actions';
import errorHandler from 'utils/apiHandler';
import { toast } from 'react-toastify';
import { marketMain } from 'http/axios/axios_main';

export function* marketCreate(action) {
  yield put(createMarketStart());
  yield errorHandler({
    endpoint: '/marketplace/create-market',
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(createMarketSuccess(data));
      yield action.payload.success(data._id);
      yield toast.success('Market created Successfully, you can add chart data');
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(createMarketFail(response));
    },
    baseAxios: marketMain,
    payload: action.payload?.data,
    failHandlerType: 'CUSTOM',
    apiType: 'post',
    token: true,
  });
}

export function* marketUpdate(action) {
  const { id, success, marketDetail } = action.payload;
  yield put(createMarketStart());
  yield errorHandler({
    endpoint: `/marketplace/update-market/${id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(createMarketSuccess(data));
      yield success();
      yield toast.success('Market detail updated successfully');
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(createMarketFail(response));
    },
    baseAxios: marketMain,
    payload: marketDetail,
    failHandlerType: 'CUSTOM',
    apiType: 'patch',
    token: true,
  });
}

export function* fetchMarketList() {
  yield put(getMarketStart());
  yield errorHandler({
    endpoint: '/marketplace/market',
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getMarketSuccess(data));
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(getMarketFail(response));
    },
    failHandlerType: 'CUSTOM',
    baseAxios: marketMain,
    apiType: 'get',
    token: true,
  });
}

export function* removeMarket(action) {
  const { id, success } = action.payload;
  yield errorHandler({
    endpoint: `/marketplace/delete-market/${id}`,
    successHandler: yield function* () {
      yield put(deleteMarketSuccess(id));
      yield success();
    },
    failHandler: yield function* (response) {
      yield toast.error(response || 'Something went wrong server error!');
    },
    failHandlerType: 'CUSTOM',
    baseAxios: marketMain,
    apiType: 'delete',
    token: true,
  });
}

export function* getComparableProperty(action) {
  const { query } = action.payload;
  yield put(getComparablePropertyStart());
  yield errorHandler({
    endpoint: `/marketplace/comparable-properties?${query}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getComparablePropertySuccess(data));
    },
    failHandler: yield function* (response) {
      yield toast.error(response);
      yield put(getComparablePropertyFail(response));
    },
    failHandlerType: 'CUSTOM',
    baseAxios: marketMain,
    apiType: 'get',
    token: true,
  });
}