import * as actionLabels from '../../actionLabels';

export const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionLabels.COMMON_START:
      return {
        ...state,
        [payload]: {
            isLoading: true
        }
      };
    case actionLabels.COMMON_FAIL:
      return {
        ...state,
        [payload.stateObj]: {
            isLoading: false,
            dataObj: {},
            errorMsg: payload?.response,
            ...payload
        }
    };
    case actionLabels.COMMON_CLEAR:
      return {
        ...state,
        [payload.stateObj]: {
            isLoading: false,
            dataObj: {},
            ...payload
        }
    };

    case actionLabels.COMMON_SUCCESS: {
      return {
        ...state,
        [payload.stateObj]: {
            isLoading: false,
            dataObj: payload.res,
            errorMsg: '',
            ...payload
        }
      };
    }

    default:
      return state;
  }
};