import { useState } from 'react';

import { axiosMain } from 'http/axios/axios_main';
import SetTokenInterval from 'hoc/SetTokenHeader/SetTokenHeader';
import Sidebar from './SideBar';
import Header from './header/Header';

import './layout.css';

function UserRouteLayout({ children }) {

  const [menuOpen, setMenuOpen] = useState(true);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header
        id="page-topbar"
        style={{
          left: menuOpen ? '257px' : '90px',
          transition: 'all ease-in-out 0.4s',
        }}
      >
        <Header toggleMenu={toggleMenu} />
      </header>
      <Sidebar isMenuOpened={menuOpen} openLeftMenuCall={setMenuOpen} />
      {/* <Navbar
        path={window.location.pathname}
        openLeftMenuCall={setMenuOpen}
        isMenuOpened={menuOpen}
      /> */}
      <div className={`main-content ${menuOpen ? 'grow-menu' : 'shrink-menu'} `}>{children}</div>
    </>
  );
}

export default SetTokenInterval(UserRouteLayout, axiosMain);