import { Route, Navigate  } from 'react-router-dom';

import { axiosMain } from 'http/axios/axios_main';
import SetTokenInterval from 'hoc/SetTokenHeader/SetTokenHeader';
import Layout from '../Layout/Layout';
import { userRoutes } from '../../routes';

const MainContainer = () => {
  const routes = (() => userRoutes)();

  return (
    <Layout>   
        {routes.map(route =>
          route.component ? (
            <Route key={route.name} path={route.path} exact={route.exact} name={route.name}>
              {route.component}
            </Route>
          ) : (
            route.redirectRoute && <Navigate  key={route.name} to={route.path} />
          ),
        )}    
    </Layout>
  );
};

export default SetTokenInterval(MainContainer, axiosMain);
