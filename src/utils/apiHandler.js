import { toast } from 'react-toastify';
import { put } from 'redux-saga/effects';
import { axiosMain, authMain } from '../http/axios/axios_main';

export default function* errorHandler({
  endpoint,
  successHandler,
  failHandler,
  failHandlerType = '',
  payload = {},
  apiType = '',
  token = false,
  isLogoutCall = false,
  baseAxios = axiosMain,
  // showToast = "",
}) {
  if (apiType.trim() === '') {
    throw new Error('apiType is require');
  }
  try {
    let response;
    if (!token) {
      if (apiType === 'get') {
        response = yield baseAxios.get(endpoint);
      } else if (apiType === 'post') {
        response = yield baseAxios.post(endpoint, payload);
      } else if (apiType === 'put') {
        response = yield baseAxios.put(endpoint, payload);
      } else if (apiType === 'delete') {
        response = yield baseAxios.delete(endpoint);
      }
    } else {
      const authToken = yield localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      if (apiType === 'get') {
        response = yield baseAxios.get(endpoint, config);
      } else if (apiType === 'post') {
        response = yield baseAxios.post(endpoint, payload, config);
      } else if (apiType === 'put') {
        response = yield baseAxios.put(endpoint, payload, config);
      } else if (apiType === 'patch') {
        response = yield baseAxios.patch(endpoint, payload, config);
      } else if (apiType === 'delete') {
        response = yield baseAxios.delete(endpoint, config);
      }
    }
    if (response && (response.status === 200 || response.status === 201) && response.data) {
      yield successHandler(response.data);
      // showToast && successToast(response.data);
    } else if (response !== undefined && response.status !== undefined) {
      if (
        response.data.msg !== undefined &&
        response.data.msg !== '' &&
        typeof response.data.msg === 'string'
      ) {
        if (failHandlerType === 'CUSTOM') {
          yield failHandler(response.data.msg);
        } else {
          yield put(failHandler(response.data.msg));
        }
      } else if (failHandlerType === 'CUSTOM') {
        yield failHandler('Server error! Please try again.');
      } else {
        yield put(failHandler('Server error! Please try again.'));
      }
    } else if (failHandlerType === 'CUSTOM') {
      yield failHandler('Something went wrong! Please try again.');
    } else {
      yield put(failHandler('Something went wrong! Please try again.'));
    }
  } catch (error) {
    // Handle network errors (service not running)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      const serviceName = endpoint.includes('/payment/') ? 'Payment' : 
                         endpoint.includes('/marketplace/') ? 'Marketplace' : 
                         endpoint.includes('/user/') ? 'User' : 'Service';
      toast.warning(`${serviceName} service is not available. Please ensure the service is running.`);
      if (failHandlerType === 'CUSTOM') {
        yield failHandler(`${serviceName} service unavailable`);
      } else {
        yield put(failHandler(`${serviceName} service unavailable`));
      }
      return;
    }
    
    if (
      error !== undefined &&
      error.response !== undefined &&
      error.response.status !== undefined
    ) {
      if (error.response.status === 400) {
        if (failHandlerType === 'CUSTOM') {
          yield failHandler(error.response.data.msg);
        } else {
          yield put(failHandler(error.response.data.msg));
        }
      } else if (error.response.status === 401) {
        // Only clear auth on 401 from auth-related endpoints, not from other services
        const isAuthEndpoint = endpoint.includes('/auth/') || 
                               endpoint.includes('/admin/login') || 
                               endpoint.includes('/admin/profile') ||
                               baseAxios === authMain;
        
        if (isAuthEndpoint) {
          toast.error('Session expired! please login again ');
          localStorage.clear();
          window.location.reload();
          if (isLogoutCall) {
            successHandler({});
          } else {
            // yield put(logout({ logoutType: "manual" }));
          }
        } else {
          // 401 from other services - don't clear auth, just show error
          toast.error(`Access denied: ${error.response.data?.msg || 'Unauthorized access to this resource'}`);
          if (failHandlerType === 'CUSTOM') {
            yield failHandler(error.response.data?.msg || 'Unauthorized access');
          } else {
            yield put(failHandler(error.response.data?.msg || 'Unauthorized access'));
          }
        }
      } else if (
        error.response.data.msg !== undefined &&
        error.response.data.msg !== '' &&
        typeof error.response.data.msg === 'string'
      ) {
        if (failHandlerType === 'CUSTOM') {
          yield failHandler(error.response.data.msg);
        } else {
          yield put(failHandler(error.response.data.msg));
        }
      } else if (failHandlerType === 'CUSTOM') {
        yield failHandler('Server error! Please try again later.');
      } else {
        yield put(failHandler('Server error! Please try again later.'));
      }
    } else if (failHandlerType === 'CUSTOM') {
      yield failHandler('Something went wrong! Please try again later.');
    } else {
      yield put(failHandler('Something went wrong! Please try again later.'));
    }
  }
}
