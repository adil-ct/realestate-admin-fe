import { put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import { userMain, proposalMain, axiosMain, paymentMain, authMain, marketMain } from 'http/axios/axios_main';
import errorHandler from 'utils/apiHandler';
import {
    commonSuccess,
    commonStart,
    commonFail,
    commonSaga
} from '../../actions';

const endpointMapping = (baseEP) => {
  let endpoint = "";
  switch (baseEP) {
    case "INVESTOR": 
      endpoint = proposalMain;
      break;
    case "PAYMENT": 
      endpoint = paymentMain;
      break;
    case "AUTH": 
      endpoint = authMain;
      break;
    case "MARKETPLACE": 
      endpoint = marketMain;
      break;
    case "USER": 
      endpoint = userMain;
      break;
    default: 
    endpoint = axiosMain;
  }
  return endpoint;
}

let pendingRequests = [];
let requestLoading = false;

export function* commonAPISaga(payLoad) {
  if(!requestLoading) {
    const {payload} = payLoad;
    requestLoading = true;
      yield put(commonStart(payload?.stateObj));
      yield errorHandler({
        endpoint: payload?.endPoint,
        successHandler: yield function* (response) {   
          const { data } = response;
          const resObj = {res: data, stateObj: payload?.stateObj};
          resObj.reqCompleted = true;
          requestLoading = false;
    
          if(payload?.type === "post") {
            resObj.dataSaved = true;
          } else if(payload?.type === "patch" || payload?.type === "put") {
            resObj.dataUpdated = true;
          } else if(payload?.type === "delete") {
            resObj.dataDeleted = true;
          }
    
          if(payload?.showAlert) {
            toast.success(payload?.msg);
          }
    
          if(payload?.fullResRequired) {
            resObj.fullResponse = response;
          }
    
          // setTimeout(() => {
            if(pendingRequests && pendingRequests?.length) {
              commonSaga(pendingRequests[0]);
              pendingRequests = pendingRequests.splice(0,1);
            }  
          // }, 1000);
          yield put(commonSuccess(resObj));
        },
        failHandler: yield function* (response) {
            const resObj = {response, stateObj: payload?.stateObj};
            resObj.reqCompleted = true;
            requestLoading = false;
            
            if(payload?.type === "post") {
              resObj.dataSaved = false;
            } else if(payload?.type === "patch" || payload?.type === "put") {
              resObj.dataUpdated = false;
            } else if(payload?.type === "delete") {
              resObj.dataDeleted = false;
            }
    
            if(payload?.fullResRequired) {
              resObj.fullResponse = response;
            }
    
            toast.error(response);
            yield put(commonFail(resObj));
            setTimeout(() => {
              if(pendingRequests && pendingRequests?.length) {
                commonSaga(pendingRequests[0]);
                pendingRequests = pendingRequests.splice(0,1);
              }
            }, 1000);
        },
        payload: ['put', 'post', 'patch'].indexOf(payload?.type) !== -1 ? (payload?.dataToPost || {}) : "",
        baseAxios: payload?.baseEP ? endpointMapping(payload?.baseEP): axiosMain,
        apiType: payload?.type || "get",
        failHandlerType: 'CUSTOM',
        token: typeof(payload?.token) === "boolean" ? payload?.token : true
      });
    } else {
      pendingRequests.push(payLoad);
    }
}