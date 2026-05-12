import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import RenderIf from './RenderIf';
import DeleteModal from './UI/Model/DeleteModal';

const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileMenu = () => {
  const { userData } = useSelector(state => state.user);

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [logout, setLogout] = useState(false);
  const [menu, setMenu] = useState(false);

  const username = useMemo(() => {
    if (userData?.firstName || userData?.lastName) {
      return `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    }
    return userData?.name || userData?.email || 'Admin';
  }, [userData]);

  const initials = useMemo(() => getInitials(username), [username]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    if(userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  return (
    <div>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
        <DropdownToggle
          className="btn header-item waves-effect"
          style={{ padding: '0 8px', background: 'transparent', border: 'none', color: '#1A1A2E' }}
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="header-profile-user" aria-label={username}>
            {initials}
          </span>
          <span className="profile-username">{username}</span>
          <i className="uil-angle-down ms-1" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
        <Link to="/portfolio">
            {isSuperAdmin && <DropdownItem tag="span">
              <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1" />
              Portfolio
            </DropdownItem>}
          </Link>
          <Link to="/profile">
            <DropdownItem tag="span">
              <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1" />
              View Profile
            </DropdownItem>
          </Link>
          <div className="dropdown-divider" />
          <button type="button" className="dropdown-item" onClick={() => setLogout(true)}>
            <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted" />
            Logout
          </button>
        </DropdownMenu>
      </Dropdown>
      <RenderIf render={logout}>
        <DeleteModal
          title="Are you sure you want to logout?"
          close={() => setLogout(false)}
          confirm={handleLogout}
        />
      </RenderIf>
    </div>
  );
};

export default ProfileMenu;
