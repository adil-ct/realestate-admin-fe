import { combineReducers } from 'redux';
import auth from './auth/auth';
import modal from './modal/modal';
import user from './user/user';
import account from './account/account';
import admins from './admins';
import market from './market/market';
import property from './property/property';
import portfolio from './portfolio';
import common from './common';
import dashboard from './dashboard/dashboard'

const allReducers = combineReducers({
  auth,
  modal,
  user,
  account,
  admins,
  market,
  property,
  portfolio,
  common,
  dashboard
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;
