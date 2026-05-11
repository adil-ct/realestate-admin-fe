import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import LogoLoader from 'components/UI/Spinner/LogoSpinner';
import { authenticationValidator } from './store/actions';
import { guestRoutes, userRoutes } from './routes';
import LayoutWrapper from 'views/Layout/LayoutWrapper';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/theme.scss';
import './app.css'; 


function App() {

  const {authToken} = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(authenticationValidator());

    /* Code for Application Level to disable value change on Scroll/Wheel of input field having type number */
    document.addEventListener('wheel', () => {
      if (window.document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    }, {passive:false});
  }, []);

  let routes = [];

  if (authToken) routes = userRoutes;
  else routes = guestRoutes;  

  const mainContent = routes.map(route =>
    route.component ? (
      <Route
        key={route.name}
        path={route.path}
        exact={route.exact}
        name={route.name}
        element={<route.component />}
      />
    ) : (
      route.redirectRoute && (
        <Route path="*" key={route.name} element={<Navigate to={route.path} />} />
      )
    ),
  );

  return (
    <>
      <Suspense fallback={<LogoLoader />}>
      <Router>
          <div className="toastcontainer">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="colored"
              progressClassName="toastProgress"
              bodyClassName="toastBody"
            />
          </div>
          <Routes>
          <Route element={<LayoutWrapper isAuthenticated={!!authToken} />}>
            {mainContent}
          </Route>
        </Routes>
        </Router>
      </Suspense>
    </>
  );
}

export default App;