import * as actionLabels from '../../actionLabels';

/* GLOBAL */
export const portfolioStart = payload => ({
  type: actionLabels.PORTFOLIO_START,
  payload,
});

export const portfolioFail = payload => ({
  type: actionLabels.PORTFOLIO_FAIL,
  payload,
});

/* For Portfolio Summery */
export const getPortfolioSummery = payload => ({
  type: actionLabels.PORTFOLIO_SUMMERY_SAGA,
  payload,
});

export const portfolioSummerySuccess = payload => ({
  type: actionLabels.PORTFOLIO_SUMMERY_SUCCESS,
  payload,
});

/* For assets Summery */
export const getAssetsSummery = payload => ({
  type: actionLabels.ASSET_SUMMERY_SAGA,
  payload,
});

export const assetsSummerySuccess = payload => ({
  type: actionLabels.ASSET_SUMMERY_SUCCESS,
  payload,
});

/* For Property Transactions */
export const getPropertyTxns = payload => ({
  type: actionLabels.PROPERTY_TXNS_SAGA,
  payload,
});

export const getPropertyTxnsSuccess = payload => ({
  type: actionLabels.PROPERTY_TXNS_SUCCESS,
  payload,
});
