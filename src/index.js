import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import rootReducer from './store/reducer';
import { 
  watchAuthentication, 
  watchInvestor, 
  watchAccountBasedSagas, 
  watchMarket, 
  watchProperty, 
  watchPortfolio,
  watchCommon,
  watchDashboard,
} from './store/sagas';
import App from './App';
import reportWebVitals from './reportWebVitals';

const composeEnhancers =
  // eslint-disable-next-line no-underscore-dangle
  (process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) ||
  compose;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(watchAuthentication);
sagaMiddleware.run(watchInvestor);
sagaMiddleware.run(watchAccountBasedSagas);
sagaMiddleware.run(watchMarket);
sagaMiddleware.run(watchProperty);
sagaMiddleware.run(watchPortfolio);
sagaMiddleware.run(watchCommon);
sagaMiddleware.run(watchDashboard)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
