/* eslint-disable no-case-declarations */
import * as actionLabels from '../../actionLabels';

export const initialState = {
  investorList: [],
  loading: false,
  errorMsg: '',
  sendPassErr: '',
  sendPassLoading: false,
  status: false,
  saveList: [],
  userList: [],
  walletAddress: {},
  moonpay: {},
  paymentMethods: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionLabels.GET_EARLY_USER_START:
      return { ...state, loading: true };
    case actionLabels.GET_EARLY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        [payload.field]: payload.data,
        status: payload.status || false,
      };
    case actionLabels.GET_EARLY_USER_FAIL:
      return { ...state, loading: false, errorMsg: payload };
    case actionLabels.SEND_PASSWORD_START:
      return { ...state, sendPassLoading: true };
    case actionLabels.SEND_PASSWORD_SUCCESS:
      const newList = state.investorList.map(item => {
        if (payload.includes(item._id)) return { ...item, temporaryPasswordSent: true };
        return item;
      });
      return { ...state, sendPassLoading: false, sendPassErr: '', investorList: newList };
    case actionLabels.SEND_PASSWORD_FAIL:
      return { ...state, sendPassErr: payload, sendPassLoading: false };
    case actionLabels.ADD_INVESTOR_SUCCESS:
      const earlyList = [];
      const newInvestorList = [...state.investorList].filter(item => {
        if (payload.includes(item.email)) {
          earlyList.push({ ...item, earlyAccess: true });
          return false;
        }
        return true;
      });
      newInvestorList.unshift(...earlyList);
      return { ...state, sendPassLoading: false, sendPassErr: '', investorList: newInvestorList };

    case actionLabels.SAVED_ITEM:
      if (!payload) return { ...state, saveList: [] };
      const { tab, changed } = payload;
      // if (changed && state.saveList.includes(tab)) return state;
      if (changed) {
        return { ...state, saveList: [...new Set([tab, ...state.saveList])] };
      }
      return { ...state, saveList: state.saveList.filter(item => item !== tab) };

    // Get User Profile
    case actionLabels.GET_USER_PROFILE_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          GetUserProfile: true,
        },
      };
    case actionLabels.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          GetUserProfile: false,
        },
        userData: payload,
      };
    case actionLabels.GET_USER_PROFILE_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          GetUserProfile: false,
        },
      };

    case actionLabels.GET_WALLET_ADDRESS_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          walletAddress: true,
        },
      };
    case actionLabels.GET_WALLET_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          walletAddress: false,
        },
        walletAddress: payload,
      };
    case actionLabels.GET_WALLET_ADDRESS_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          walletAddress: false,
        },
      };
    case actionLabels.GET_MOONPAY_URL_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          moonpay: true,
        },
      };
    case actionLabels.GET_MOONPAY_URL_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          moonpay: false,
        },
        moonpay: payload,
      };
    case actionLabels.GET_MOONPAY_URL_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          moonpay: false,
        },
      };
    case actionLabels.GET_PAYMENT_METHODS_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          paymentMethods: true,
        },
      };
    case actionLabels.GET_PAYMENT_METHODS_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          paymentMethods: false,
        },
        paymentMethods: payload,
      };
    case actionLabels.GET_PAYMENT_METHODS_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          paymentMethods: false,
        },
      };
    default:
      return state;
  }
};
