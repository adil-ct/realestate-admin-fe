import * as actionLabels from '../../actionLabels';

export const getEarlyInvestorStart = () => ({
  type: actionLabels.GET_EARLY_USER_START,
});

export const getEarlyInvestor = payload => ({
  type: actionLabels.GET_EARLY_USER,
  payload,
});

export const getEarlyInvestorSuccess = payload => ({
  type: actionLabels.GET_EARLY_USER_SUCCESS,
  payload,
});

export const getEarlyInvestorFail = payload => ({
  type: actionLabels.GET_EARLY_USER_FAIL,
  payload,
});

export const sendPassword = payload => ({
  type: actionLabels.SEND_PASSWORD,
  payload,
});

export const sendPasswordStart = () => ({
  type: actionLabels.SEND_PASSWORD_START,
});

export const sendPasswordSuccess = payload => ({
  type: actionLabels.SEND_PASSWORD_SUCCESS,
  payload,
});

export const sendPasswordFail = payload => ({
  type: actionLabels.SEND_PASSWORD_FAIL,
  payload,
});

export const addInvestor = payload => ({
  type: actionLabels.ADD_INVESTOR,
  payload,
});

export const addInvestorStart = () => ({
  type: actionLabels.ADD_INVESTOR_START,
});

export const addInvestorSuccess = payload => ({
  type: actionLabels.ADD_INVESTOR_SUCCESS,
  payload,
});

export const addInvestorFail = payload => ({
  type: actionLabels.ADD_INVESTOR_FAIL,
  payload,
});

export const setSavedItem = payload => ({
  type: actionLabels.SAVED_ITEM,
  payload,
});

// profile

export const GetUserProfileStart = () => ({
  type: actionLabels.GET_USER_PROFILE_START,
});

export const GetUserProfile = payload => ({
  type: actionLabels.GET_USER_PROFILE,
  payload,
});

export const GetUserProfileSuccess = payload => ({
  type: actionLabels.GET_USER_PROFILE_SUCCESS,
  payload,
});

export const GetUserProfileFail = payload => ({
  type: actionLabels.GET_USER_PROFILE_FAIL,
  payload,
});


export const getWalletAddressStart = () => ({
  type: actionLabels.GET_WALLET_ADDRESS_START,
});

export const getWalletAddress = (payload) => ({
  type: actionLabels.GET_WALLET_ADDRESS_SAGA,
  payload,
});

export const getWalletAddressSuccess = (payload) => ({
  type: actionLabels.GET_WALLET_ADDRESS_SUCCESS,
  payload,
});

export const getWalletAddressFail = (payload) => ({
  type: actionLabels.GET_WALLET_ADDRESS_FAIL,
  payload,
});

export const getMoonpayUrlStart = () => ({
  type: actionLabels.GET_MOONPAY_URL_START,
});

export const getMoonpayUrl = (payload) => ({
  type: actionLabels.GET_MOONPAY_URL_SAGA,
  payload,
});

export const getMoonpayUrlSuccess = (payload) => ({
  type: actionLabels.GET_MOONPAY_URL_SUCCESS,
  payload,
});

export const getMoonpayUrlFail = (payload) => ({
  type: actionLabels.GET_MOONPAY_URL_FAIL,
  payload,
});

export const getPaymentMethodsStart = () => ({
  type: actionLabels.GET_PAYMENT_METHODS_START,
});

export const getPaymentMethods = (payload) => ({
  type: actionLabels.GET_PAYMENT_METHODS_SAGA,
  payload,
});

export const getPaymentMethodsSuccess = (payload) => ({
  type: actionLabels.GET_PAYMENT_METHODS_SUCCESS,
  payload,
});

export const getPaymentMethodsFail = (payload) => ({
  type: actionLabels.GET_PAYMENT_METHODS_FAIL,
  payload,
});
