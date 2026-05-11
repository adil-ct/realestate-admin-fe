import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Underwriting from './Underwriting';
import Details from './Details';
import './propertymanagement.css';

const FinancialsTab = ({ data, view, status }) => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTab = tab => {
    if (activeTab === tab) return;
    setActiveTab(tab);
  };

  return (
    <>
      <Nav tabs justified className="cursor-pointer">
        <NavItem>
          <NavLink active={activeTab === 1} onClick={() => handleTab(1)} className="fw-bolder">
            Financials
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === 2} onClick={() => handleTab(2)} className="fw-bolder">
            Underwriting
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={1}>
          <Details
            info="financialInfo"
            data={data.financials}
            view={view}
            tab={2}
            status={status}
          />
        </TabPane>
        <TabPane tabId={2}>
          <Underwriting data={data?.underwriting} view={view} status={data.status} />
        </TabPane>
      </TabContent>
    </>
  );
};

export default FinancialsTab;
