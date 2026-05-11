import * as actionLabels from '../../actionLabels';

const initialState = {
  propertyList: [],
  loading: false,
  createLoading: false,
  errorMsg: '',
  totalItems: 0,
  minting: false,
  propertyDeleted: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionLabels.GET_PROPERTY_LIST_START:
      return { ...state, loading: true, errorMsg: '' };
    case actionLabels.GET_PROPERTY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyList: payload.items,
        errorMsg: '',
        totalItems: payload.totalItems,
      };
    case actionLabels.GET_PROPERTY_LIST_FAIL:
      return { ...state, loading: false, errorMsg: payload };
    case actionLabels.CREATE_PROPERTY_START: {
      return { ...state, createLoading: true };
    }
    case actionLabels.CREATE_PROPERTY_SUCCESS: {
      return { ...state, createLoading: false };
    }
    case actionLabels.CREATE_PROPERTY_FAIL: {
      return { ...state, createLoading: false };
    }
    case actionLabels.MINT_PROPERTY_START: {
      return { ...state, minting: true,createLoading: false };
    }
    case actionLabels.MINT_PROPERTY_SUCCESS: {
      return { ...state, minting: false };
    }
    case actionLabels.MINT_PROPERTY_FAIL: {
      return { ...state, minting: false };
    }
    case actionLabels.DELETE_PROPERTY_START: {
      return { ...state, loading: true, propertyDeleted: false };
    }
    case actionLabels.DELETE_PROPERTY_SUCCESS: {
      return { ...state, loading: false, propertyDeleted: true };
    }
    case actionLabels.DELETE_PROPERTY_FAIL: {
      return { ...state, loading: false, propertyDeleted: false };
    }
    default:
      return state;
  }
};
