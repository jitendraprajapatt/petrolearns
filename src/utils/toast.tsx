// src/utils/toast.tsx
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const customToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    type: type === 'error' ? 'error' : 'success',
  });
};

export default customToast;
