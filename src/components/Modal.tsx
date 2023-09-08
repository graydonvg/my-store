'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsModalOpen } from '@/lib/redux/modal/modalSlice';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Grow from '@mui/material/Grow';
import SignIn from './SignIn';
import SignUp from './SignUp';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  translate: '-50% -50%',
  width: { xs: 300, sm: 400 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ModalComponent() {
  const modalContent = useAppSelector((state) => state.modal.modalContent);
  const isModalOpen = useAppSelector((state) => state.modal.isModalOpen);
  const dispatch = useAppDispatch();

  function handleClose() {
    dispatch(setIsModalOpen(false));
  }

  return (
    <>
      <Modal
        closeAfterTransition
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Grow in={isModalOpen}>
          <Box sx={style}>{modalContent === 'signIn' ? <SignIn /> : modalContent === 'signUp' ? <SignUp /> : null}</Box>
        </Grow>
      </Modal>
    </>
  );
}
