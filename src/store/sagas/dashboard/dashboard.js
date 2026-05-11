import errorHandler from 'utils/apiHandler';
import { put } from 'redux-saga/effects';
import { axiosMain } from 'http/axios/axios_main';

import {
  getDashboardStatsFail,
  getDashboardStatsSuccess,
  getDashboardStatsStart,
} from 'store/actions';

// get dashboard stats saga
export function* getDashboardStatsSaga() {
  yield put(getDashboardStatsStart());
  yield errorHandler({
    endpoint: '/dashboard/stats',
    successHandler: yield function* (response) {
      const { data } = response;
      yield put(getDashboardStatsSuccess(data));
    },
    failHandler: yield function* (response) {
      // Handle 404 gracefully - endpoint doesn't exist yet
      if (response?.includes('404') || response?.includes('Not Found')) {
        // Return empty stats instead of error
        yield put(getDashboardStatsSuccess({
          totalUserCount: { total: 0 },
          suspendedUserCount: { total: 0 },
          totalAdminCount: { total: 0 },
          suspendedAdminCount: { total: 0 },
          draftPropertiesCount: { total: 0 },
          mintedPropertyCount: { total: 0 },
          onSalePropertyCount: { total: 0 },
          totalInvestmentCount: { total: 0 },
        }));
      } else {
        yield put(getDashboardStatsFail(response));
      }
    },
    baseAxios: axiosMain,
    failHandlerType: 'CUSTOM',
    apiType: 'get',
    token: true,
  });
}
