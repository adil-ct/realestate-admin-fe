import * as actionLabels from '../../actionLabels';

const initialState = {
  // get dashboard stats
  dashboardStatsLoading: false,
  dashboardStatsErrorMsg: '',
  dashboardStats: null,
 
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    // get dashboard stats
    case actionLabels.GET_DASHBOARD_STATS_START:
      return { ...state, dashboardStatsLoading: true, dashboardStatsErrorMsg: '' };
    case actionLabels.GET_DASHBOARD_STATS_SUCCESS:
      return {
        ...state,
        dashboardStatsLoading: false,
        dashboardStatsErrorMsg: '',
        dashboardStats: payload,
      };
    case actionLabels.GET_DASHBOARD_STATS_FAIL:
      return {
        ...state,
        dashboardStatsLoading: false,
        dashboardStatsErrorMsg: payload,
        dashboardStats: null,
      };
    default:
      return state;
  }
};
