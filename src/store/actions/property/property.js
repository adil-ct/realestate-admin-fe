import * as actionLabels from '../../actionLabels';

export const getPropertyList = payload => ({
  type: actionLabels.GET_PROPERTY_LIST,
  payload,
});

export const getPropertyListStart = payload => ({
  type: actionLabels.GET_PROPERTY_LIST_START,
  payload,
});

export const getPropertyListSuccess = payload => ({
  type: actionLabels.GET_PROPERTY_LIST_SUCCESS,
  payload,
});

export const getPropertyListFail = payload => ({
  type: actionLabels.GET_PROPERTY_LIST_FAIL,
  payload,
});

export const createPropertyStat = () => ({
  type: actionLabels.CREATE_PROPERTY_START,
});

export const createProperty = payload => ({
  type: actionLabels.CREATE_PROPERTY,
  payload,
});

export const createPropertySuccess = payload => ({
  type: actionLabels.CREATE_PROPERTY_SUCCESS,
  payload,
});

export const createPropertyFail = payload => ({
  type: actionLabels.CREATE_PROPERTY_FAIL,
  payload,
});

export const mintProperty = payload => ({
  type: actionLabels.MINT_PROPERTY,
  payload,
});

export const mintPropertyStart = () => ({
  type: actionLabels.MINT_PROPERTY_START,
});

export const mintPropertySuccess = payload => ({
  type: actionLabels.MINT_PROPERTY_SUCCESS,
  payload,
});

export const mintPropertyFail = payload => ({
  type: actionLabels.MINT_PROPERTY_FAIL,
  payload,
});

export const putOnSale = payload => ({
  type: actionLabels.PUT_ON_SALE,
  payload,
});

export const buyEquity = payload => ({
  type: actionLabels.BUY_EQUITY,
  payload,
});

export const deleteProperty = payload => ({
  type: actionLabels.DELETE_PROPERTY,
  payload,
});

export const deletePropertyStart = payload => ({
  type: actionLabels.DELETE_PROPERTY_START,
  payload,
});

export const deletePropertySuccess = payload => ({
  type: actionLabels.DELETE_PROPERTY_SUCCESS,
  payload,
});

export const deletePropertyFail = payload => ({
  type: actionLabels.DELETE_PROPERTY_FAIL,
  payload,
});