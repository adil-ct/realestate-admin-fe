import {
  GET_PLAID_TOKEN_START,
  GET_PLAID_TOKEN_SUCCESS,
  GET_PLAID_TOKEN_FAIL,
  ADD_ACH_BANK_ACCOUNT_START,
  ADD_ACH_BANK_ACCOUNT_SUCCESS,
  ADD_ACH_BANK_ACCOUNT_FAIL,
  ADD_WIRE_BANK_ACCOUNT_START,
  ADD_WIRE_BANK_ACCOUNT_SUCCESS,
  ADD_WIRE_BANK_ACCOUNT_FAIL,
  GET_LOCATION_START,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAIL,
  GET_CITYLOCATION_START,
  GET_CITYLOCATION_SUCCESS,
  GET_CITYLOCATION_FAIL,
  GET_DISTRICTLOCATION_START,
  GET_DISTRICTLOCATION_SUCCESS,
  GET_DISTRICTLOCATION_FAIL,
  GET_SELECTED_LOCATION,
  GET_SELECTED_CITY,
  DEPOSIT_CURRENCY_START,
  DEPOSIT_CURRENCY_SUCCESS,
  DEPOSIT_CURRENCY_FAIL,
  WITHDRAW_CURRENCY_START,
  WITHDRAW_CURRENCY_SUCCESS,
  WITHDRAW_CURRENCY_FAIL,
  GET_SERVICE_FEES_START,
  GET_SERVICE_FEES_SUCCESS,
  GET_SERVICE_FEES_FAIL,
  GET_WALLET_BALANCE_START,
  GET_WALLET_BALANCE_SUCCESS,
  GET_WALLET_BALANCE_FAIL,
  GET_LIST_OF_BANK_ACCOUNT_START,
  GET_LIST_OF_BANK_ACCOUNT_SUCCESS,
  GET_LIST_OF_BANK_ACCOUNT_FAIL,
  GET_LIST_OF_TRANSACTIONS_START,
  GET_LIST_OF_TRANSACTIONS_SUCCESS,
  GET_LIST_OF_TRANSACTIONS_FAIL,
  DELETE_CARD_START,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_FAIL,
  GET_BANK_DETAILS_START,
  GET_BANK_DETAILS_SUCCESS,
  GET_BANK_DETAILS_FAIL,
  ADD_CARD_START,
  ADD_CARD_SUCCESS,
  ADD_CARD_FAIL,
  GET_LIST_OF_CARDS_START,
  GET_LIST_OF_CARDS_SUCCESS,
  GET_LIST_OF_CARDS_FAIL,
  GET_WIRE_INSTRUCTION_START,
  GET_WIRE_INSTRUCTION_SUCCESS,
  GET_WIRE_INSTRUCTION_FAIL,
} from '../../actionLabels';

export const initialState = {
  isLoading: {
    plaidLinkToken: false,
    addACHBankAccount: false,
    addWireBankAccount: false,
    getBankAccountList: false,
    addCard: false,
    getCardsList: false,
    depositCurrency: false,
    withdrawCurrency: false,
    walletBalance: false,
    deleteCard: false,
    getBankDetails: true,
    getTransactionsList: false,
    getServiceFees: false,
    getWireInstruction: false,
  },
  plaidLinkToken: {},
  addACHBankAccountData: {},
  addWireBankAccountData: {},
  linkedBankAccounts: [],
  addCardData: {},
  linkedCards: [],
  depositCurrencyData: {},
  withdrawCurrencyData: {},
  deposites: [],
  walletBalance: {},
  deleteCardData: {},
  getBankDetailsData: {},
  transactions: [],
  serviceFees: [],
  wireInstruction: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    // Get Plaid Link Token
    case GET_PLAID_TOKEN_START:
      return {
        ...state,
        plaidLinkToken: {},
        isLoading: {
          ...state.isLoading,
          plaidLinkToken: true,
        },
      };
    case GET_PLAID_TOKEN_SUCCESS: {
      return {
        ...state,
        plaidLinkToken: payload.data,
        isLoading: {
          ...state.isLoading,
          plaidLinkToken: false,
        },
      };
    }
    case GET_PLAID_TOKEN_FAIL: {
      return {
        ...state,
        plaidLinkToken: {},
        isLoading: {
          ...state.isLoading,
          plaidLinkToken: false,
        },
      };
    }

    // Add ACH Bank Account
    case ADD_ACH_BANK_ACCOUNT_START:
      return {
        ...state,
        addACHBankAccountData: {},
        isLoading: {
          ...state.isLoading,
          addACHBankAccount: true,
        },
      };
    case ADD_ACH_BANK_ACCOUNT_SUCCESS: {
      return {
        ...state,
        addACHBankAccountData: payload.data,
        isLoading: {
          ...state.isLoading,
          addACHBankAccount: false,
        },
      };
    }
    case ADD_ACH_BANK_ACCOUNT_FAIL: {
      return {
        ...state,
        addACHBankAccountData: {},
        isLoading: {
          ...state.isLoading,
          addACHBankAccount: false,
        },
      };
    }
    // Add WIRE Bank Account
    case ADD_WIRE_BANK_ACCOUNT_START:
      return {
        ...state,
        addWireBankAccountData: {},
        isLoading: {
          ...state.isLoading,
          addWireBankAccount: true,
        },
      };
    case ADD_WIRE_BANK_ACCOUNT_SUCCESS: {
      return {
        ...state,
        addWireBankAccountData: payload.data,
        isLoading: {
          ...state.isLoading,
          addWireBankAccount: false,
        },
        linkedBankAccounts: [...state.linkedBankAccounts, payload.data],
      };
    }
    case ADD_WIRE_BANK_ACCOUNT_FAIL: {
      return {
        ...state,
        addWireBankAccountData: {},
        isLoading: {
          ...state.isLoading,
          addWireBankAccount: false,
        },
      };
    }
    case GET_LOCATION_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [payload.type]: true,
        },
      };
    case GET_LOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: false,
        },
        countries: payload.data,
        errorMsg: '',
      };
    }
    case GET_LOCATION_FAIL: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: true,
        },
      };
    }
    case GET_SELECTED_LOCATION: {
      return {
        ...state,
        selectedCountry: payload,
      };
    }
    case GET_CITYLOCATION_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: true,
        },
      };
    case GET_CITYLOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: false,
        },
        cities: payload.data,
        errorMsg: '',
      };
    }
    case GET_CITYLOCATION_FAIL: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: true,
        },
      };
    }
    case GET_SELECTED_CITY: {
      return {
        ...state,
        selectedCity: payload,
      };
    }
    case GET_DISTRICTLOCATION_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: true,
        },
      };
    case GET_DISTRICTLOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: false,
        },
        districts: payload.data.data,
        errorMsg: '',
      };
    }
    case GET_DISTRICTLOCATION_FAIL: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [type]: true,
        },
        districts: [],
        cities: [],
      };
    }
    // Deposit currency using bank account
    case DEPOSIT_CURRENCY_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          depositCurrency: true,
        },
      };
    case DEPOSIT_CURRENCY_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          depositCurrency: false,
        },
        depositCurrencyData: payload,
      };
    case DEPOSIT_CURRENCY_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          depositCurrency: false,
        },
      };

    // Withdraw currency using bank account
    case WITHDRAW_CURRENCY_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          withdrawCurrency: true,
        },
      };
    case WITHDRAW_CURRENCY_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          withdrawCurrency: false,
        },
        withdrawCurrencyData: payload,
      };
    case WITHDRAW_CURRENCY_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          withdrawCurrency: false,
        },
      };

    // Get Limits & Service fess
    case GET_SERVICE_FEES_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getServiceFees: true,
        },
      };
    case GET_SERVICE_FEES_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getServiceFees: false,
        },
        serviceFees: payload,
      };
    case GET_SERVICE_FEES_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getServiceFees: false,
        },
      };
    // Get Wallet Balance
    case GET_WALLET_BALANCE_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          walletBalance: true,
        },
      };
    case GET_WALLET_BALANCE_SUCCESS: {
      const { balance, blockedFunds, ...rest } = payload;
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          walletBalance: false,
        },
        walletBalance: {
          availableBalance: balance,
          balance,
          blockedFunds,
          ...rest,
        },
      };
    }
    case GET_WALLET_BALANCE_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          walletBalance: false,
        },
      };

    // Get list of bank account
    case GET_LIST_OF_BANK_ACCOUNT_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getBankAccountList: true,
        },
      };
    case GET_LIST_OF_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getBankAccountList: false,
        },
        linkedBankAccounts: payload,
      };
    case GET_LIST_OF_BANK_ACCOUNT_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getBankAccountList: false,
        },
      };

    // Delete Card
    case DELETE_CARD_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          deleteCard: true,
        },
      };
    case DELETE_CARD_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          deleteCard: false,
        },
        deleteCardData: payload,
      };
    }
    case DELETE_CARD_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          deleteCard: false,
        },
      };

    // Get Bank Details
    case GET_BANK_DETAILS_START: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getBankDetails: true,
        },
      };
    }
    case GET_BANK_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getBankDetails: false,
        },
        getBankDetailsData: payload,
      };
    }
    case GET_BANK_DETAILS_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getBankDetails: false,
        },
      };

    // Get list of transactions
    case GET_LIST_OF_TRANSACTIONS_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getTransactionsList: true,
        },
      };
    case GET_LIST_OF_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getTransactionsList: false,
        },
        transactions: payload,
      };
    case GET_LIST_OF_TRANSACTIONS_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getTransactionsList: false,
        },
      };

    // Add Caard
    case ADD_CARD_START:
      return {
        ...state,
        addCardData: {},
        isLoading: {
          ...state.isLoading,
          addCard: true,
          getCardsList: true,
        },
      };
    case ADD_CARD_SUCCESS: {
      // const { billingDetails, card,id } = payload.data;
      // const response = {
      //   card,
      //   cardId: id,
      //   accountHolder: billingDetails,
      // };
      return {
        ...state,
        addCardData: payload.data,
        isLoading: {
          ...state.isLoading,
          addCard: false,
          getCardsList: false,
        },
        // linkedCards: [...state.linkedCards, response],
      };
    }
    case ADD_CARD_FAIL: {
      return {
        ...state,
        addCardData: {},
        isLoading: {
          ...state.isLoading,
          addCard: false,
          getCardsList: false,
        },
      };
    }

    // Get list of cards
    case GET_LIST_OF_CARDS_START:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getCardsList: true,
        },
      };
    case GET_LIST_OF_CARDS_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getCardsList: false,
        },
        linkedCards: payload,
      };
    case GET_LIST_OF_CARDS_FAIL:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          getCardsList: false,
        },
      };

    // Get Wire
    case GET_WIRE_INSTRUCTION_START:
      return {
        ...state,
        wireInstruction: {},
        isLoading: {
          ...state.isLoading,
          getWireInstruction: true,
        },
      };
    case GET_WIRE_INSTRUCTION_SUCCESS: {
      return {
        ...state,
        wireInstruction: payload.data.data,
        isLoading: {
          ...state.isLoading,
          getWireInstruction: false,
        },
      };
    }
    case GET_WIRE_INSTRUCTION_FAIL: {
      return {
        ...state,
        wireInstruction: {},
        isLoading: {
          ...state.isLoading,
          getWireInstruction: false,
        },
      };
    }

    default:
      return state;
  }
};
