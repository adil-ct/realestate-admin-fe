import { Row } from 'reactstrap';
import MiniWidget from 'components/MiniWidget';

import useCommonState from 'views/useCommonState';
import { getDashboardStatsAction } from 'store/actions';
import { DashboardStatisticsData } from 'components/DashboardArray';

const DashboardStatistics = () => {
  const { useEffect, useSelector, dispatch, navigate } = useCommonState();
  const { dashboardStats } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStatsAction());
  }, []);
  
  // Handle null/undefined dashboardStats gracefully
  if (!dashboardStats) {
    return null; // or return a loading/empty state
  }
  return (
    <>
      <div className="mb-4">
        <Row>
          <MiniWidget
            className="d-flex align-items-stretch pt-2 pb-2 "
            reports={DashboardStatisticsData(dashboardStats, navigate)}
          />
        </Row>
      </div>
    </>
  );
};

export default DashboardStatistics;
