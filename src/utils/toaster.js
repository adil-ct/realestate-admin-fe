import { toast } from 'react-toastify';

const toaster = {
  success: message => toast.success(message),
  error: message => toast.error(message),
  warn: message => toast.warn(message),
  info: message => toast.info(message),
};

export default toaster;
