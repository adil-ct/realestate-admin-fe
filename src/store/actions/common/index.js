import * as actionLabels from '../../actionLabels';

/* GLOBAL */
export const commonStart = payload => ({
  type: actionLabels.COMMON_START,
  payload,
});

export const commonSaga = payload => ({
  type: actionLabels.COMMON_SAGA,
  payload,
});

export const commonFail = payload => ({
  type: actionLabels.COMMON_FAIL,
  payload,
});

export const commonSuccess = payload => ({
  type: actionLabels.COMMON_SUCCESS,
  payload,
});

export const commonClear = payload => ({
  type: actionLabels.COMMON_CLEAR,
  payload,
});