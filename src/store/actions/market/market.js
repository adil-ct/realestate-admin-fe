import * as actionLabels from '../../actionLabels';

export const createMarket = payload => ({
    type:actionLabels.CREATE_MARKET,
    payload
})

export const createMarketSuccess = payload => ({
    type:actionLabels.CREATE_MARKET_SUCCESS,
    payload
})

export const createMarketFail = payload => ({
    type:actionLabels.CREATE_MARKET_FAIL,
    payload
})

export const createMarketStart = () => ({
    type:actionLabels.CREATE_MARKET_START,
})

export const getMarketStart = () => ({
    type : actionLabels.GET_MARKET_START
})

export const getMarket = payload => ({
    type : actionLabels.GET_MARKET,
    payload
})

export const getMarketSuccess = payload => ({
    type : actionLabels.GET_MARKET_SUCCESS,
    payload
})

export const getMarketFail = payload => ({
    type : actionLabels.GET_MARKET_FAIL,
    payload
})

export const deleteMarket = payload => ({
    type:actionLabels.DELETE_MARKET,
    payload
})

export const deleteMarketSuccess = payload => ({
    type:actionLabels.DELETE_MARKET_SUCCESS,
    payload
})

export const editMarket = payload => ({
    type:actionLabels.EDIT_MARKET,
    payload
})

export const getComparableProperty = payload => ({
    type : actionLabels.GET_COMPARABLE_PROPERTY_LIST,
    payload
})

export const getComparablePropertyStart = () => ({
    type : actionLabels.GET_COMPARABLE_PROPERTY_LIST_START
})

export const getComparablePropertySuccess = payload => ({
    type : actionLabels.GET_COMPARABLE_PROPERTY_LIST_SUCCESS,
    payload
})

export const getComparablePropertyFail = payload => ({
    type : actionLabels.GET_COMPARABLE_PROPERTY_LIST_FAIL,
    payload
})