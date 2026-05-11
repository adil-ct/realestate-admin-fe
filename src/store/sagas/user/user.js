import { userMain, axiosMain, paymentMain } from 'http/axios/axios_main';
import { toast } from 'react-toastify';
import { put } from 'redux-saga/effects';
import {
  getEarlyInvestorSuccess,
  getEarlyInvestorFail,
  getEarlyInvestorStart,
  sendPasswordStart,
  sendPasswordFail,
  sendPasswordSuccess,
  // addInvestorSuccess,
  GetUserProfileStart,
  GetUserProfileSuccess,
  GetUserProfileFail,
  getWalletAddressStart,
  getWalletAddressSuccess,
  getWalletAddressFail,
  getMoonpayUrlStart,
  getMoonpayUrlSuccess,
  getMoonpayUrlFail,
  getPaymentMethodsStart,
  getPaymentMethodsSuccess,
  getPaymentMethodsFail,
  // getEarlyInvestor,
} from 'store/actions';
import errorHandler from 'utils/apiHandler';

export function* fetchEarlyInvestors(action) {
  const { list, field, query } = action.payload;
  yield put(getEarlyInvestorStart());
  yield errorHandler({
    endpoint: `/${list}${query ? `?${query}` : ''}`,
    successHandler: yield function* (response) {
      const { data } = response;
      // data?.emails || data?.items
      yield put(
        getEarlyInvestorSuccess({
          data,
          status: data?.earlyAccessStatus,
          field,
        }),
      );
    },
    failHandler: yield function* (response) {
      yield put(getEarlyInvestorFail(response));
      toast.error(response);
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
    baseAxios: list.includes('payment') ? paymentMain : list !== 'user/listUsers' && list !== 'user/refereeList' && !list.includes('referee-transactions') ? axiosMain : userMain,
    token : true
  });
}

export function* sendTempPassword(action) {
  const { ids, success } = action.payload;
  yield put(sendPasswordStart());
  yield errorHandler({
    endpoint: '/user/tempPassword-early-access',
    successHandler: yield function* () {
      yield put(sendPasswordSuccess(ids));
      yield success();
    },
    failHandler: yield function* (response) {
      yield put(sendPasswordFail(response));
    },
    payload: { ids },
    failHandlerType: 'CUSTOM',
    apiType: 'post',
  });
}

export function* createInvestors(action) {
  const { emails, successHandler } = action.payload;
  // yield put(sendPasswordStart());
  yield errorHandler({
    endpoint: '/user/grant-early-access',
    successHandler: yield function* () {
      // yield put(addInvestorSuccess(emails));
      yield successHandler();
      // yield put(getEarlyInvestor());
    },
    failHandler: yield function* (response) {
      yield put(sendPasswordFail(response));
    },
    payload: { emails },
    failHandlerType: 'CUSTOM',
    apiType: 'post',
  });
}

// Get list of all cards
export function* GetUserProfile() {
  yield put(GetUserProfileStart());
  yield errorHandler({
    endpoint: `/admin/profile`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(GetUserProfileSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(GetUserProfileFail(response));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
    token: true,
  });
}

export function* getWalletAddressSaga({ payload }) {
  const { handleSuccess } = payload;
  yield put(getWalletAddressStart());
  yield errorHandler({
    endpoint: `/user/walletAddress`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getWalletAddressSuccess({ data }));
      // eslint-disable-next-line no-unused-expressions
      handleSuccess && handleSuccess();
    },
    failHandler: yield function* (response) {
      yield put(getWalletAddressFail(response));
      // toaster.error(response);
    },
    failHandlerType: 'CUSTOM',
    payload: '',
    apiType: 'get',
    token: true,
    baseAxios: userMain,
  });
}

export function* getMoonpayUrlSaga({ payload }) {
  const { handleSuccess } = payload;
  yield put(getMoonpayUrlStart());
  yield errorHandler({
    endpoint: `/payment/moonpay-widget`,
    // baseURL: PAYMENT_BASE_URL,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getMoonpayUrlSuccess({ data }));
      // eslint-disable-next-line no-unused-expressions
      handleSuccess && handleSuccess(data);
    },
    failHandler: yield function* (response) {
      yield put(getMoonpayUrlFail(response));
      // toaster.error(response);
    },
    failHandlerType: 'CUSTOM',
    payload: '',
    apiType: 'get',
    token: true,
    baseAxios: paymentMain,
  });
}

export function* getPaymentMethodsSaga() {
  yield put(getPaymentMethodsStart());
  yield errorHandler({
    endpoint: `/payment/payment-methods`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getPaymentMethodsSuccess({ data }));
    },
    failHandler: yield function* (response) {
      yield put(getPaymentMethodsFail(response));
      // toaster.error(response);
    },
    failHandlerType: 'CUSTOM',
    payload: '',
    apiType: 'get',
    token: true,
    baseAxios: paymentMain,
  });
}
