import {
  GET_PLAID_TOKEN_SAGA,
  GET_PLAID_TOKEN_START,
  GET_PLAID_TOKEN_SUCCESS,
  GET_PLAID_TOKEN_FAIL,
  ADD_ACH_BANK_ACCOUNT_SAGA,
  ADD_ACH_BANK_ACCOUNT_START,
  ADD_ACH_BANK_ACCOUNT_SUCCESS,
  ADD_ACH_BANK_ACCOUNT_FAIL,
  ADD_WIRE_BANK_ACCOUNT_SAGA,
  ADD_WIRE_BANK_ACCOUNT_START,
  ADD_WIRE_BANK_ACCOUNT_SUCCESS,
  ADD_WIRE_BANK_ACCOUNT_FAIL,
  GET_LOCATION_SAGA,
  GET_LOCATION_START,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAIL,
  GET_CITYLOCATION_SAGA,
  GET_CITYLOCATION_START,
  GET_CITYLOCATION_SUCCESS,
  GET_CITYLOCATION_FAIL,
  GET_DISTRICTLOCATION_SAGA,
  GET_DISTRICTLOCATION_START,
  GET_DISTRICTLOCATION_SUCCESS,
  GET_DISTRICTLOCATION_FAIL,
  GET_SELECTED_LOCATION,
  GET_SELECTED_CITY,
  DEPOSIT_CURRENCY_SAGA,
  DEPOSIT_CURRENCY_START,
  DEPOSIT_CURRENCY_SUCCESS,
  DEPOSIT_CURRENCY_FAIL,
  WITHDRAW_CURRENCY_SAGA,
  WITHDRAW_CURRENCY_START,
  WITHDRAW_CURRENCY_SUCCESS,
  WITHDRAW_CURRENCY_FAIL,
  GET_SERVICE_FEES_SAGA,
  GET_SERVICE_FEES_START,
  GET_SERVICE_FEES_SUCCESS,
  GET_SERVICE_FEES_FAIL,
  GET_WALLET_BALANCE_SAGA,
  GET_WALLET_BALANCE_START,
  GET_WALLET_BALANCE_SUCCESS,
  GET_WALLET_BALANCE_FAIL,
  GET_LIST_OF_BANK_ACCOUNT_SAGA,
  GET_LIST_OF_BANK_ACCOUNT_START,
  GET_LIST_OF_BANK_ACCOUNT_SUCCESS,
  GET_LIST_OF_BANK_ACCOUNT_FAIL,
  GET_LIST_OF_TRANSACTIONS_SAGA,
  GET_LIST_OF_TRANSACTIONS_START,
  GET_LIST_OF_TRANSACTIONS_SUCCESS,
  GET_LIST_OF_TRANSACTIONS_FAIL,
  DELETE_CARD_SAGA,
  DELETE_CARD_START,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_FAIL,
  GET_BANK_DETAILS_SAGA,
  GET_BANK_DETAILS_START,
  GET_BANK_DETAILS_SUCCESS,
  GET_BANK_DETAILS_FAIL,
  ADD_CARD_SAGA,
  ADD_CARD_START,
  ADD_CARD_SUCCESS,
  ADD_CARD_FAIL,
  GET_LIST_OF_CARDS_SAGA,
  GET_LIST_OF_CARDS_START,
  GET_LIST_OF_CARDS_SUCCESS,
  GET_LIST_OF_CARDS_FAIL,
  GET_WIRE_INSTRUCTION,
  GET_WIRE_INSTRUCTION_START,
  GET_WIRE_INSTRUCTION_SUCCESS,
  GET_WIRE_INSTRUCTION_FAIL,
} from '../../actionLabels';

// Get Plaid Link Token

export const getPlaidTokenStart = () => ({
  type: GET_PLAID_TOKEN_START,
});

export const getPlaidTokenSaga = payload => ({
  type: GET_PLAID_TOKEN_SAGA,
  payload,
});

export const getPlaidTokenSuccess = payload => ({
  type: GET_PLAID_TOKEN_SUCCESS,
  payload,
});

export const getPlaidTokenFail = payload => ({
  type: GET_PLAID_TOKEN_FAIL,
  payload,
});

// Add ACH Bank Account

export const addACHBankAccountStart = () => ({
  type: ADD_ACH_BANK_ACCOUNT_START,
});

export const addACHBankAccountSaga = payload => ({
  type: ADD_ACH_BANK_ACCOUNT_SAGA,
  payload,
});

export const addACHBankAccountSuccess = payload => ({
  type: ADD_ACH_BANK_ACCOUNT_SUCCESS,
  payload,
});

export const addACHBankAccountFail = payload => ({
  type: ADD_ACH_BANK_ACCOUNT_FAIL,
  payload,
});

export const addWireBankAccountStart = () => ({
  type: ADD_WIRE_BANK_ACCOUNT_START,
});

export const addWireBankAccountSaga = payload => ({
  type: ADD_WIRE_BANK_ACCOUNT_SAGA,
  payload,
});

export const addWireBankAccountSuccess = payload => ({
  type: ADD_WIRE_BANK_ACCOUNT_SUCCESS,
  payload,
});

export const addWireBankAccountFail = payload => ({
  type: ADD_WIRE_BANK_ACCOUNT_FAIL,
  payload,
});

export const getLocationStart = payload => ({
  type: GET_LOCATION_START,
  payload,
});

export const getLocation = payload => ({
  type: GET_LOCATION_SAGA,
  payload,
});

export const getLocationSuccess = payload => ({
  type: GET_LOCATION_SUCCESS,
  payload,
});

export const getLocationFail = payload => ({
  type: GET_LOCATION_FAIL,
  payload,
});

export const getSelectedLocation = payload => ({
  type: GET_SELECTED_LOCATION,
  payload,
});

export const getCityLocationStart = () => ({
  type: GET_CITYLOCATION_START,
});

export const getCityLocationSaga = payload => ({
  type: GET_CITYLOCATION_SAGA,
  payload,
});

export const getCityLocationSuccess = payload => ({
  type: GET_CITYLOCATION_SUCCESS,
  payload,
});

export const getCityLocationFail = payload => ({
  type: GET_CITYLOCATION_FAIL,
  payload,
});

export const getSelectedCity = payload => ({
  type: GET_SELECTED_CITY,
  payload,
});

export const getDistrictLocationStart = () => ({
  type: GET_DISTRICTLOCATION_START,
});

export const getDistrictLocationSaga = payload => ({
  type: GET_DISTRICTLOCATION_SAGA,
  payload,
});

export const getDistrictLocationSuccess = payload => ({
  type: GET_DISTRICTLOCATION_SUCCESS,
  payload,
});

export const getDistrictLocationFail = payload => ({
  type: GET_DISTRICTLOCATION_FAIL,
  payload,
});

// Deposit currency using bank account

export const depositCurrencyStart = () => ({
  type: DEPOSIT_CURRENCY_START,
});

export const depositCurrency = payload => ({
  type: DEPOSIT_CURRENCY_SAGA,
  payload,
});

export const depositCurrencySuccess = payload => ({
  type: DEPOSIT_CURRENCY_SUCCESS,
  payload,
});

export const depositCurrencyFail = payload => ({
  type: DEPOSIT_CURRENCY_FAIL,
  payload,
});

// Withdraw currency using bank account

export const withdrawCurrencyStart = () => ({
  type: WITHDRAW_CURRENCY_START,
});

export const withdrawCurrency = payload => ({
  type: WITHDRAW_CURRENCY_SAGA,
  payload,
});

export const withdrawCurrencySuccess = payload => ({
  type: WITHDRAW_CURRENCY_SUCCESS,
  payload,
});

export const withdrawCurrencyFail = payload => ({
  type: WITHDRAW_CURRENCY_FAIL,
  payload,
});

// Get lists of all bank accounts

export const getListOfBankAccountStart = () => ({
  type: GET_LIST_OF_BANK_ACCOUNT_START,
});

export const getListOfBankAccount = payload => ({
  type: GET_LIST_OF_BANK_ACCOUNT_SAGA,
  payload,
});

export const getListOfBankAccountSuccess = payload => ({
  type: GET_LIST_OF_BANK_ACCOUNT_SUCCESS,
  payload,
});

export const getListOfBankAccountFail = payload => ({
  type: GET_LIST_OF_BANK_ACCOUNT_FAIL,
  payload,
});

// Get Wallet Balance

export const getWalletBalanceStart = () => ({
  type: GET_WALLET_BALANCE_START,
});

export const getWalletBalance = payload => ({
  type: GET_WALLET_BALANCE_SAGA,
  payload,
});

export const getWalletBalanceSuccess = payload => ({
  type: GET_WALLET_BALANCE_SUCCESS,
  payload,
});

export const getWalletBalanceFail = payload => ({
  type: GET_WALLET_BALANCE_FAIL,
  payload,
});

// Get lists of all transactions

export const getListOfTransactionsStart = () => ({
  type: GET_LIST_OF_TRANSACTIONS_START,
});

export const getListOfTransactions = payload => ({
  type: GET_LIST_OF_TRANSACTIONS_SAGA,
  payload,
});

export const getListOfTransactionsSuccess = payload => ({
  type: GET_LIST_OF_TRANSACTIONS_SUCCESS,
  payload,
});

export const getListOfTransactionsFail = payload => ({
  type: GET_LIST_OF_TRANSACTIONS_FAIL,
  payload,
});

// Get Limits & Service fess

export const getServiceFeesStart = () => ({
  type: GET_SERVICE_FEES_START,
});

export const getServiceFees = payload => ({
  type: GET_SERVICE_FEES_SAGA,
  payload,
});

export const getServiceFeesSuccess = payload => ({
  type: GET_SERVICE_FEES_SUCCESS,
  payload,
});

export const getServiceFeesFail = payload => ({
  type: GET_SERVICE_FEES_FAIL,
  payload,
});

// Get Bank Details

export const getBankDetailsStart = () => ({
  type: GET_BANK_DETAILS_START,
});

export const getBankDetails = payload => ({
  type: GET_BANK_DETAILS_SAGA,
  payload,
});

export const getBankDetailsSuccess = payload => ({
  type: GET_BANK_DETAILS_SUCCESS,
  payload,
});

export const getBankDetailsFail = payload => ({
  type: GET_BANK_DETAILS_FAIL,
  payload,
});

// Delete Card

export const deleteCardStart = () => ({
  type: DELETE_CARD_START,
});

export const deleteCard = payload => ({
  type: DELETE_CARD_SAGA,
  payload,
});

export const deleteCardSuccess = payload => ({
  type: DELETE_CARD_SUCCESS,
  payload,
});

export const deleteCardFail = payload => ({
  type: DELETE_CARD_FAIL,
  payload,
});

// Add Card

export const addCardStart = () => ({
  type: ADD_CARD_START,
});

export const addCardSaga = payload => ({
  type: ADD_CARD_SAGA,
  payload,
});

export const addCardSuccess = payload => ({
  type: ADD_CARD_SUCCESS,
  payload,
});

export const addCardFail = payload => ({
  type: ADD_CARD_FAIL,
  payload,
});

// Get lists of all cards

export const getListOfCardsStart = () => ({
  type: GET_LIST_OF_CARDS_START,
});

export const getListOfCards = payload => ({
  type: GET_LIST_OF_CARDS_SAGA,
  payload,
});

export const getListOfCardsSuccess = payload => ({
  type: GET_LIST_OF_CARDS_SUCCESS,
  payload,
});

export const getListOfCardsFail = payload => ({
  type: GET_LIST_OF_CARDS_FAIL,
  payload,
});

// Get Wire Instruction

export const getWireInstructionStart = () => ({
  type: GET_WIRE_INSTRUCTION_START,
});

export const getWireInstruction = payload => ({
  type: GET_WIRE_INSTRUCTION,
  payload,
});

export const getWireInstructionSuccess = payload => ({
  type: GET_WIRE_INSTRUCTION_SUCCESS,
  payload,
});

export const getWireInstructionFail = payload => ({
  type: GET_WIRE_INSTRUCTION_FAIL,
  payload,
});
