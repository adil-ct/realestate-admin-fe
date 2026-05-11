import errorHandler from 'utils/apiHandler';
import { put } from 'redux-saga/effects';

import { marketMain } from 'http/axios/axios_main';
import {
  portfolioStart,
  portfolioFail,
  portfolioSummerySuccess,
  assetsSummerySuccess,
  getPropertyTxnsSuccess
} from '../../actions';

import * as actionLabels from '../../actionLabels';

export function* getPortfolioSummerySaga() {
  yield put(portfolioStart());
  yield errorHandler({
    endpoint: `/admin/portfolio-summary`,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(portfolioSummerySuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(portfolioFail({ response, type: actionLabels.PORTFOLIO_SUMMERY_SAGA }));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
  });
}

export function* getAssetsSummerySaga({payload}) {
    const {id} = payload;

  yield put(portfolioStart());
  yield errorHandler({
    endpoint: `/marketplace/asset-summary/${id}`,
    baseAxios: marketMain,
    token: true,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(assetsSummerySuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(portfolioFail({ response, type: actionLabels.ASSET_SUMMERY_SAGA }));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
  });
}

export function* getPropertyTxnsSaga({payload}) {
    const {id} = payload;

  yield put(portfolioStart());
  yield errorHandler({
    endpoint: `/marketplace/getPropertyTransactions/${id}`,
    baseAxios: marketMain,
    token: true,
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getPropertyTxnsSuccess(data));
    },
    failHandler: yield function* (response) {
      yield put(portfolioFail({ response, type: actionLabels.PROPERTY_TXNS_SAGA }));
    },
    failHandlerType: 'CUSTOM',
    apiType: 'get',
  });
}
