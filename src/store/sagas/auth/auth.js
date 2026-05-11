import { put } from 'redux-saga/effects';
import errorHandler from 'utils/apiHandler';

import {
  loginSuccess,
  loginFail,
  loginStart,
  otpVerifySuccess,
  passwordResetStart,
  passwordResetSuccess,
  passwordResetFail,
  otpVerifyStart,
  otpVerifyFail,
} from '../../actions';

export function* loginSaga(action) {
  const { email, password, onSuccess } = action.payload;

  yield put(loginStart());
  yield errorHandler({
    endpoint: '/admin/login',
    successHandler: yield function* (response) {
      localStorage.setItem('email', email);
      const { data } = response;
      localStorage.setItem('userId', data?._id);
      localStorage.setItem('authToken', data?.token);
      localStorage.setItem('isSuperAdmin', data?.isSuperAdmin)
      yield put(loginSuccess(data));
      onSuccess()
    },
    failHandler: yield function* (response) {
      yield put(loginFail(response));
    },
    payload: { email, password },
    failHandlerType: 'CUSTOM',
    apiType: 'post',
  });
}
export function* resetPassword(action) {
  const { password, id } = action.payload;
  yield put(passwordResetStart());
  yield errorHandler({
    endpoint: `/admin/forceUpdatePassword/${id}`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(passwordResetSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(passwordResetFail(response));
    },
    payload: { password },
    failHandlerType: 'CUSTOM',
    apiType: 'post',
  });
}
export function* otpVerifySaga(action) {
  yield put(otpVerifyStart());
  yield errorHandler({
    endpoint: '/admin/loginVerify',
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(otpVerifySuccess({ token: data?.token }));
    },
    failHandler: yield function* (response) {
      yield put(otpVerifyFail(response));
    },
    payload: action.payload,
    failHandlerType: 'CUSTOM',
    apiType: 'post',
  });
}

export function* authenticationValidatorSaga() {
  yield put(loginStart());
  const token = yield localStorage.getItem('authToken');
  if (!token) {
    yield put(loginFail(''));
    // yield put(logout()); // logout action
  } else {
    yield put(loginSuccess({ token }));
  }
}
