import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import MarketBasicDetail from './MarketBasicDetail';
import MarketChart from './MarketChart';
import './propertymanagement.css';

const MarketTabs = ({ data, view }) => {
  const [activeTab, setActiveTab] = useState(data.subtab || 1);
  const handleTab = tab => {
    if (activeTab === tab) return;
    setActiveTab(tab);
  };
  return (
    <>
      <Nav tabs justified className="cursor-pointer">
        <NavItem>
          <NavLink active={activeTab === 1} onClick={() => handleTab(1)} className="fw-bolder">
            Basic Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === 2} onClick={() => handleTab(2)} className="fw-bolder">
            Chart
          </NavLink>
        </NavItem>
      </Nav>
      {/* <div className="heading fw-bolder">ATTOM Details</div> */}
      <TabContent activeTab={activeTab}>
        <TabPane tabId={1}>
          <MarketBasicDetail details={data.data} view={view} />
        </TabPane>
        <TabPane tabId={2}>
          <MarketChart detail={data.data} view={view} />
        </TabPane>
      </TabContent>
    </>
  );
};

export default MarketTabs;
