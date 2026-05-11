import * as actionLabels from '../../actionLabels';

export const initialState = {
  isLoading: false,
  isAdminAdded: false,
  isAdminUpdated: false,
  isAdminDeleted: false,
  isTempPWDGenerated: false,
  adminsList: {},
  adminDetails: {},
  errorMsg: '',
  generatingTempPass: false,
  isAdminStatusChanged: false,
};

const failStateConfig = payload => {
  let stateObj = {};
  switch (payload?.type) {
    case actionLabels.GET_ADMIN_LIST_SAGA:
      stateObj.adminsList = {};
      break;

    case actionLabels.GET_ADMIN_DETAILS_SAGA:
      stateObj.adminDetails = {};
      break;

    case actionLabels.UPDATE_ADMIN_SAGA:
      stateObj.isAdminUpdated = false;
      break;

    case actionLabels.DELETE_ADMIN_SAGA:
      stateObj.isAdminDeleted = false;
      break;

    case actionLabels.TEMP_PWD_SAGA:
      stateObj.isTempPWDGenerated = false;
      break;
    case actionLabels.UPDATE_ADMIN_STATUS_SAGA:
      stateObj.isAdminStatusChanged = false;
      break;
    default:
      stateObj = {};
  }

  stateObj.errorMsg = payload?.response;
  return stateObj;
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionLabels.ADMIN_START:
      return {
        ...state,
        [payload || 'isLoading']: true,
        isAdminAdded: false,
        isAdminUpdated: false,
        isAdminDeleted: false,
      };
    case actionLabels.ADMIN_FAIL:
      return {
        ...state,
        [payload?.load || 'isLoading']: false,
        ...failStateConfig(payload),
      };

    case actionLabels.GET_ADMIN_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        adminsList: payload,
      };
    }

    case actionLabels.GET_ADMIN_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        adminDetails: payload,
      };
    }

    case actionLabels.UPDATE_ADMIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAdminUpdated: true,
      };
    }

    case actionLabels.DELETE_ADMIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAdminDeleted: true,
      };
    }

    case actionLabels.TEMP_PWD_SAGA: {
      return {
        ...state,
        isLoading: false,
        isTempPWDGenerated: false,
      };
    }

    case actionLabels.TEMP_PWD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isTempPWDGenerated: true,
        generatingTempPass: false,
      };
    }
    case actionLabels.UPDATE_ADMIN_STATUS_SUCCESS: {
      console.log('hheehhehe 2')
      return {
        ...state,
        isLoading: false,
        isAdminStatusChanged: !state.isAdminStatusChanged,
      };
    }
    default:
      return state;
  }
};
