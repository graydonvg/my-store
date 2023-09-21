'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsModalOpen } from '@/lib/redux/modal/modalSlice';
import { Box, Modal, Grow, useTheme } from '@mui/material';
import SignInForm from '@/components/Forms/SignInForm';
import SignUpForm from '@/components/Forms/SignUpForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  translate: '-50% -50%',
  width: { xs: 300, sm: 400 },
  boxShadow: 24,
  p: 4,
};

function renderModalContent(modalContent: 'signIn' | 'signUp' | null) {
  return modalContent === 'signIn' ? <SignInForm /> : modalContent === 'signUp' ? <SignUpForm /> : null;
}

export default function ModalComponent() {
  const isModalOpen = useAppSelector((state) => state.modal.isModalOpen);
  const modalContent = useAppSelector((state) => state.modal.modalContent);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const modalBackgroundColor = mode === 'light' ? 'custom.grey.light' : 'custom.grey.dark';

  function handleClose() {
    dispatch(setIsModalOpen(false));
  }

  return (
    <Modal
      closeAfterTransition
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Grow in={isModalOpen}>
        <Box sx={{ ...style, backgroundColor: modalBackgroundColor }}>{renderModalContent(modalContent)}</Box>
      </Grow>
    </Modal>
  );
}
