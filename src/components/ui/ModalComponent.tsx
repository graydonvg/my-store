'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsModalOpen } from '@/lib/redux/modal/modalSlice';
import { Box, Modal, Grow, useTheme } from '@mui/material';
import SignInForm from '@/components/forms/SignInForm';
import SignUpForm from '@/components/forms/SignUpForm';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import LoadingBar from './progress/LoadingBar';
import UpdateUserData from '../forms/UpdateUserData';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  translate: '-50% -50%',
  width: { xs: 300, sm: 400 },
  boxShadow: 24,
  borderRadius: '4px',
};

export default function ModalComponent() {
  const isModalOpen = useAppSelector((state) => state.modal.isModalOpen);
  const modalContent = useAppSelector((state) => state.modal.modalContent);
  const showModalLoadingBar = useAppSelector((state) => state.modal.showModalLoadingBar);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const modalBackgroundColor = mode === 'light' ? color.grey.light : color.grey.dark;

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
        <Box sx={{ ...style, backgroundColor: modalBackgroundColor }}>
          <LoadingBar
            isLoading={showModalLoadingBar}
            style={{ borderTopRightRadius: '4px', borderTopLeftRadius: '4px' }}
          />
          <Box sx={{ padding: 4 }}>
            {modalContent === 'signIn' && <SignInForm />}
            {modalContent === 'signUp' && <SignUpForm />}
            {modalContent === 'updateUserData' && <UpdateUserData />}
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
}
