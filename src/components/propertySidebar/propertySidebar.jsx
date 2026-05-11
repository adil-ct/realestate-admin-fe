import { sideBarItem } from 'constants/DraftData';
import React from 'react';
import { useSelector } from 'react-redux';
import './propertysidebar.css';

const PropertySideBar = ({ setCurrentTab, currentTab, tabs, data }) => {
  const { saveList } = useSelector(state => state.user);
  const sideBarDataItems = sideBarItem.filter(item => item[tabs]);
  return (
    <div className="side-container">
      <div className="heading fw-bolder">About</div>
      <div className="property-meta">
        <div>Title</div>
        <div>{data.title}</div>
      </div>
      <div className="property-meta">
        <div>Location</div>
        <div>{data.location}</div>
      </div>
      {data?.blockchainAddress && <div className="property-meta">
        <div>Blockchain address</div>
        <div>
          <a rel="noreferrer" href={`https://mumbai.polygonscan.com/address/${data?.blockchainAddress}`} target="_blank"> 
            {`${data?.blockchainAddress?.slice(0, 4)}......${data?.blockchainAddress?.slice(-4)}`}
          </a>
        </div>
      </div>}
      <div className="step-list">
        {sideBarDataItems.map(item => (
          <div
            className={`step-list-item ${item.tabid[0] === currentTab ? 'step-active' : ''}`}
            key={item.name}
            onClick={() => setCurrentTab(item.tabid[0])}
          >
            <div>{item.name}</div>
            {item.tabid.some(it => saveList.includes(it)) ? <div className="save-item" /> : null}
            <div className="forward">{'>'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertySideBar;
