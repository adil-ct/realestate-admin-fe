import * as actionLabels from '../../actionLabels';

export const initialState = {
  isLoading: false,
  portfolioList: {},
  portfolioSummery: {},
  assetsSummery: {},
  propertyTxns: {},
  errorMsg: ''
};

const failStateConfig = payload => {
  let stateObj = {};
  switch (payload?.type) {
    case actionLabels.PORTFOLIO_SUMMERY_SAGA:
      stateObj.portfolioSummery = {};
      break;

    case actionLabels.ASSET_SUMMERY_SAGA:
      stateObj.assetsSummery = {};
      break;

    case actionLabels.PROPERTY_TXNS_SAGA:
      stateObj.propertyTxns = {};
      break;

    default:
      stateObj = {};
  }

  stateObj.errorMsg = payload?.response;
  return stateObj;
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionLabels.PORTFOLIO_START:
      return {
        ...state,
        [payload || 'isLoading']: true,
      };
    case actionLabels.PORTFOLIO_FAIL:
      return {
        ...state,
        [payload?.load || 'isLoading']: false,
        ...failStateConfig(payload),
    };

    case actionLabels.PORTFOLIO_SUMMERY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        portfolioSummery: payload,
      };
    }

    case actionLabels.ASSET_SUMMERY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        assetsSummery: payload,
      };
    }

    case actionLabels.PROPERTY_TXNS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        propertyTxns: payload,
      };
    }

    default:
      return state;
  }
};
