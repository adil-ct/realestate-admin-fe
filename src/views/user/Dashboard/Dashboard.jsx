import DashboardProperties from './DashbaordProperties.jsx';
import DashboardStatistics from './DashboardStatistics.jsx';

import './dashboard.css';
import { CardTitle } from 'reactstrap';

const Dashboard = () => {

  return (
    <div className="page-content m-4 pb-2">
      <CardTitle title="Admin Dashboard" />
      <div className="d-flex flex-column justify-content-around ">
        <DashboardStatistics />
        <DashboardProperties />
      </div>
    </div>
  );
};

export default Dashboard;
