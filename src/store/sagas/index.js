import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import * as actionLabels from '../actionLabels';
import { loginSaga, authenticationValidatorSaga, otpVerifySaga, resetPassword } from './auth/auth';
import {
  createInvestors,
  fetchEarlyInvestors,
  sendTempPassword,
  GetUserProfile,
  getWalletAddressSaga,
  getMoonpayUrlSaga,
  getPaymentMethodsSaga,
} from './user/user';
import { fetchMarketList, getComparableProperty, marketCreate, marketUpdate, removeMarket } from './market/market';
import {
  addProperty,
  buyMogulEquity,
  fetchPropertyList,
  mintPropertySaga,
  putOnSaleProperty,
  deleteProperty,
} from './property/property';
import {
  getPlaidTokenSaga,
  addACHBankAccountSaga,
  addWireBankAccountSaga,
  getLocation,
  getCityLocationSaga,
  getDistrictLocationSaga,
  depositCurrencySaga,
  withdrawCurrencySaga,
  getServiceFeesSaga,
  getWalletBalanceSaga,
  getListOfTransactionsSaga,
  getListOfBankAccountSaga,
  deleteCardSaga,
  getBankDetailsSaga,
  addCardSaga,
  getListOfCardsSaga,
  getWireInstructionSaga,
} from './account/account';
import {
  getAdminListSaga,
  getAdminDetailsSaga,
  deleteAdminSaga,
  updateAdminSaga,
  tempPWDGenerate,
  updateAdminStatusSaga,
} from './admins';

import { getPortfolioSummerySaga, getAssetsSummerySaga, getPropertyTxnsSaga } from './portfolio';

import { commonAPISaga } from './common';
import { getDashboardStatsSaga } from './dashboard/dashboard';

export function* watchAuthentication() {
  yield all([
    takeLatest(actionLabels.LOGIN_SAGA, loginSaga),
    takeLatest(actionLabels.OTP_VERIFY, otpVerifySaga),
    takeLatest(actionLabels.AUTHENTICATION_VALIDATOR, authenticationValidatorSaga),
    takeLatest(actionLabels.RESET_PASSWORD, resetPassword),
  ]);
}

export function* watchInvestor() {
  yield all([
    takeLatest(actionLabels.GET_EARLY_USER, fetchEarlyInvestors),
    takeLatest(actionLabels.SEND_PASSWORD, sendTempPassword),
    takeLatest(actionLabels.ADD_INVESTOR, createInvestors),
    takeLatest(actionLabels.GET_USER_PROFILE, GetUserProfile),
    takeLatest(actionLabels.GET_WALLET_ADDRESS_SAGA, getWalletAddressSaga),
    takeLatest(actionLabels.GET_MOONPAY_URL_SAGA, getMoonpayUrlSaga),
    takeLatest(actionLabels.GET_PAYMENT_METHODS_SAGA, getPaymentMethodsSaga),
  ]);
}

// Account actions based saga
export function* watchAccountBasedSagas() {
  yield all([
    takeLatest(actionLabels.GET_PLAID_TOKEN_SAGA, getPlaidTokenSaga),
    takeLatest(actionLabels.ADD_ACH_BANK_ACCOUNT_SAGA, addACHBankAccountSaga),
    takeLatest(actionLabels.ADD_WIRE_BANK_ACCOUNT_SAGA, addWireBankAccountSaga),
    takeLatest(actionLabels.GET_LOCATION_SAGA, getLocation),
    takeLatest(actionLabels.GET_CITYLOCATION_SAGA, getCityLocationSaga),
    takeLatest(actionLabels.GET_DISTRICTLOCATION_SAGA, getDistrictLocationSaga),
    takeLatest(actionLabels.DEPOSIT_CURRENCY_SAGA, depositCurrencySaga),
    takeLatest(actionLabels.WITHDRAW_CURRENCY_SAGA, withdrawCurrencySaga),
    takeLatest(actionLabels.GET_ADMIN_LIST_SAGA, getAdminListSaga),
    takeLatest(actionLabels.UPDATE_ADMIN_SAGA, updateAdminSaga),
    takeLatest(actionLabels.DELETE_ADMIN_SAGA, deleteAdminSaga),
    takeLatest(actionLabels.GET_ADMIN_DETAILS_SAGA, getAdminDetailsSaga),
    takeLatest(actionLabels.TEMP_PWD_SAGA, tempPWDGenerate),
    takeLatest(actionLabels.GET_SERVICE_FEES_SAGA, getServiceFeesSaga),
    takeLatest(actionLabels.GET_WALLET_BALANCE_SAGA, getWalletBalanceSaga),
    takeLatest(actionLabels.GET_LIST_OF_BANK_ACCOUNT_SAGA, getListOfBankAccountSaga),
    takeLatest(actionLabels.GET_LIST_OF_TRANSACTIONS_SAGA, getListOfTransactionsSaga),
    takeLatest(actionLabels.DELETE_CARD_SAGA, deleteCardSaga),
    takeLatest(actionLabels.GET_BANK_DETAILS_SAGA, getBankDetailsSaga),
    takeLatest(actionLabels.ADD_CARD_SAGA, addCardSaga),
    takeLatest(actionLabels.GET_LIST_OF_CARDS_SAGA, getListOfCardsSaga),
    takeLatest(actionLabels.GET_WIRE_INSTRUCTION, getWireInstructionSaga),
    takeLatest(actionLabels.UPDATE_ADMIN_STATUS_SAGA, updateAdminStatusSaga),
  ]);
}

export function* watchMarket() {
  yield all([
    takeLatest(actionLabels.CREATE_MARKET, marketCreate),
    takeLatest(actionLabels.GET_MARKET, fetchMarketList),
    takeLatest(actionLabels.DELETE_MARKET, removeMarket),
    takeLatest(actionLabels.EDIT_MARKET, marketUpdate),
    takeLatest(actionLabels.GET_COMPARABLE_PROPERTY_LIST, getComparableProperty),
  ]);
}

export function* watchProperty() {
  yield all([
    takeLatest(actionLabels.GET_PROPERTY_LIST, fetchPropertyList),
    takeLatest(actionLabels.CREATE_PROPERTY, addProperty),
    takeLatest(actionLabels.MINT_PROPERTY, mintPropertySaga),
    takeLatest(actionLabels.PUT_ON_SALE, putOnSaleProperty),
    takeLatest(actionLabels.BUY_EQUITY, buyMogulEquity),
    takeLatest(actionLabels.DELETE_PROPERTY, deleteProperty),
  ]);
}

export function* watchPortfolio() {
  yield all([
    takeLatest(actionLabels.PORTFOLIO_SUMMERY_SAGA, getPortfolioSummerySaga),
    takeLatest(actionLabels.ASSET_SUMMERY_SAGA, getAssetsSummerySaga),
    takeLatest(actionLabels.PROPERTY_TXNS_SAGA, getPropertyTxnsSaga),
  ]);
}

export function* watchCommon() {
  yield all([takeEvery(actionLabels.COMMON_SAGA, commonAPISaga)]);
}

export function* watchDashboard() {
  yield all([
    takeLatest(actionLabels.GET_DASHBOARD_STATS_SAGA, getDashboardStatsSaga),
  ]);
}