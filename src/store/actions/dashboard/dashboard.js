import * as actionLabels from '../../actionLabels';

// get dashboard stats
export const getDashboardStatsAction = payload => ({
    type: actionLabels.GET_DASHBOARD_STATS_SAGA,
    payload,
  });
  
  export const getDashboardStatsStart = payload => ({
    type: actionLabels.GET_DASHBOARD_STATS_START,
    payload,
  });
  
  export const getDashboardStatsSuccess = payload => ({
    type: actionLabels.GET_DASHBOARD_STATS_SUCCESS,
    payload,
  });
  
  export const getDashboardStatsFail = payload => ({
    type: actionLabels.GET_DASHBOARD_STATS_FAIL,
    payload,
  });
  