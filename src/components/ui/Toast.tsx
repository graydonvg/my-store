import { Flip, ToastContainer, UpdateOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastPromiseSuccessOptions: UpdateOptions = {
  type: 'success',
  isLoading: false,
  autoClose: 4000,
  closeButton: true,
  closeOnClick: true,
  transition: Flip,
};

export const toastPromiseErrorOptions: UpdateOptions = {
  type: 'error',
  isLoading: false,
  autoClose: 4000,
  closeButton: true,
  closeOnClick: true,
  transition: Flip,
};

export default function Toast() {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      rtl={false}
    />
  );
}
