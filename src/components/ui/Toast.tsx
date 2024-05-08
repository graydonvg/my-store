import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
