import { toast } from 'react-toastify';

const toaster = (message, options = {}) =>
  toast(message, {
    position: 'top-right',
    hideProgressBar: true,
    containerId: 'appLayoutToaster',
    type: 'success',
    className: 'toaster-success',
    autoClose: 3000,
    ...options,
  });

export default toaster;
