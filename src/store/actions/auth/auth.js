import * as actionLabels from '../../actionLabels';
import { OTP_VERIFY_START } from '../../actionLabels';

export const loginStart = () => ({
  type: actionLabels.LOGIN_START,
});

export const login = payload => ({
  type: actionLabels.LOGIN_SAGA,
  payload,
});

export const loginSuccess = payload => ({
  type: actionLabels.LOGIN_SUCCESS,
  payload,
});

export const loginFail = payload => ({
  type: actionLabels.LOGIN_FAIL,
  payload,
});

export const authenticationValidator = () => ({
  type: actionLabels.AUTHENTICATION_VALIDATOR,
});

export const clearAuth = () => ({
  type: actionLabels.CLEAR_AUTH,
});

export const otpVerify = payload => ({
  type: actionLabels.OTP_VERIFY,
  payload,
});

export const otpVerifySuccess = payload => ({
  type: actionLabels.OTP_VERIFY_SUCCESS,
  payload,
});

export const otpVerifyFail = payload => ({
  type: actionLabels.OTP_VERIFY_FAIL,
  payload,
});

export const otpVerifyStart = () => ({
  type: OTP_VERIFY_START,
});

export const passwordReset = payload => ({
  type: actionLabels.RESET_PASSWORD,
  payload,
});

export const passwordResetStart = () => ({
  type: actionLabels.RESET_PASSWORD_START,
});

export const passwordResetSuccess = payload => ({
  type: actionLabels.RESET_PASSWORD_SUCCESS,
  payload,
});

export const passwordResetFail = payload => ({
  type: actionLabels.RESET_PASSWORD_FAIL,
  payload,
});
