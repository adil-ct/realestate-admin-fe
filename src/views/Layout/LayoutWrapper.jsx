import { Outlet } from 'react-router-dom';
import UserRoutesLayout from './UserRoutesLayout';
import GuestRoutesLayout from './GuestRoutesLayout';

function LayoutWrapper({ isAuthenticated }) {
  if (isAuthenticated) {
    return (
      <UserRoutesLayout>
        <Outlet />
      </UserRoutesLayout>
    );
  }
  return (
    <GuestRoutesLayout>
      <Outlet />
    </GuestRoutesLayout>
  );
}

export default LayoutWrapper;