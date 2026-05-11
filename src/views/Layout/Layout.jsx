import { useState } from 'react';
import Sidebar from './SideBar';
import Header from './header/Header';
import './layout.css';

const Layout = props => {
  const [menuOpen, setMenuOpen] = useState(true);
  const { children } = props;

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
};

export default Layout;
