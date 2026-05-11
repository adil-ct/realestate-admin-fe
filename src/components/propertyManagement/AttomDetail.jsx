import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Details from './Details';
import OtherDetail from './OtherDetail';
import './propertymanagement.css';

const AttomDetail = ({ data, view, status }) => {
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
            ATTOM Detail
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === 2} onClick={() => handleTab(2)} className="fw-bolder">
            Other Information
          </NavLink>
        </NavItem>
      </Nav>
      {/* <div className="heading fw-bolder">ATTOM Details</div> */}
      <TabContent activeTab={activeTab}>
        <TabPane tabId={1}>
          <Details data={data.attom} info="fieldInfo" view={view} status={status} />
        </TabPane>
        <TabPane tabId={2}>
          <OtherDetail data={data.otherInfo} view={view} status={status} />
        </TabPane>
      </TabContent>
    </>
  );
};

export default AttomDetail;
