import ProfileMenu from 'components/ProfileMenu';
import './header.css';

const Header = ({ toggleMenu }) => (
  <div className="navbar-header">
    <button
      type="button"
      className="btn btn-sm px-3 font-size-20 header-item waves-effect waves-light"
      data-toggle="collapse"
      onClick={toggleMenu}
      data-target="#topnav-menu-content"
    >
      <i className="fa fa-fw fa-bars" />
    </button>
    <ProfileMenu />
  </div>
);

export default Header;
