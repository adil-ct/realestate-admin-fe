import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Logo removed for whitelabeling

import { dataItems, dataItemsAdmin } from 'statics/sidebardata';
import { GetUserProfile } from 'store/actions';

import './layout.css';
 
const Sidebar = ({ isMenuOpened }) => {
  const dispatch = useDispatch();
  const { pathname } = window.location;
  const [nestedIndex, setNestedIndex] = useState(0);
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [sidebarAccess, setSidebarAccess] = useState(dataItemsAdmin);

  useEffect(() => {
    dispatch(GetUserProfile());
  }, []);

  useEffect(() => {
    if(userData?.isSuperAdmin) {
      setSidebarAccess(dataItemsAdmin);
    } else {
      setSidebarAccess(dataItems);
    }
  }, [userData]);
  
  return (
    <>
      <nav className={isMenuOpened ? '' : 'nav_show'}>
        <div className={`d-flex side_bar_top ${isMenuOpened ? '' : 'nav_show'}`}>
          <div className="navbar-brand-box">
            <NavLink to="/" className="logo logo-dark">
              <span className="logo-sm">
                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#34c38f'}}>Occurrence</span>
              </span>
              <span className="logo-lg">
                <span style={{fontSize: '24px', fontWeight: 'bold', color: '#34c38f'}}>Occurrence</span>
              </span>
            </NavLink>

            <NavLink to="/" className="logo logo-light">
              <span className="logo-sm">
                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#34c38f'}}>Occurrence</span>
              </span>
              <span className="logo-lg">
                <span style={{fontSize: '24px', fontWeight: 'bold', color: '#34c38f'}}>Occurrence</span>
              </span>
            </NavLink>
          </div>
        </div>
        <ul>
          {sidebarAccess?.map((item, index) => (
            <React.Fragment key={item.name || index}>
              <li
                className={
                  isMenuOpened
                    ? pathname === item.link
                      ? 'sidebar-nav-item nonActive'
                      : 'sidebar-nav-item nonActive'
                    : pathname === item.link
                    ? 'activeitem'
                    : ''
                }
                onClick={() => {
                  if (item?.nestedtab) {
                    if (nestedIndex === index) setNestedIndex(0);
                    else setNestedIndex(index);
                  } else {
                    if (item.name === 'Logout') {
                      localStorage.clear();
                      window.location.reload();
                      return;
                    }
                    navigate(item.link);
                    setNestedIndex(0);
                  }
                  // openLeftMenuCallBack();
                }}
                key={item.name}
              >
                {item?.nestedtab ? (
                  <a>
                    <i className={item.logo} />
                    {item.name}
                    {nestedIndex === index ? (
                      <i className="uil-angle-up" />
                    ) : (
                      <i className="uil-angle-down" />
                    )}
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    onClick={() => {
                      // openLeftMenuCallBack();
                    }}
                    className={pathname === item.link ? 'color-rgb' : 'color-black'}
                  >
                    <i className={item.logo} />
                    {item.name}
                  </Link>
                )}
              </li>
              {nestedIndex && nestedIndex === index
                ? sidebarAccess[nestedIndex]?.nestedtab?.map(nest => (
                    <li
                      className={
                        isMenuOpened
                          ? pathname === nest.link
                            ? 'sidebar-nav-item nonActive nested-item'
                            : 'sidebar-nav-item nonActive nested-item'
                          : pathname === nest.link
                          ? 'activeitem nested-item'
                          : 'nested-item'
                      }
                      onClick={() => {
                        navigate(nest.link);
                        // openLeftMenuCallBack();
                      }}
                      key={`nested${nest.name}`}
                    >
                      <Link
                        to={nest.link}
                        onClick={() => {
                          // openLeftMenuCallBack();
                        }}
                        className={pathname === nest.link ? 'color-rgb' : 'color-black'}
                      >
                        <i className={nest.logo} />
                        {nest.name}
                      </Link>
                    </li>
                  ))
                : null}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
