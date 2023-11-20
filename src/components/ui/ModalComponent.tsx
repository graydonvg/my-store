'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Modal, Grow, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import LoadingBar from './progress/LoadingBar';
import { ReactNode } from 'react';
import { closeModal } from '@/lib/redux/modal/modalSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  translate: '-50% -50%',
  width: { xs: 300, sm: 400 },
  boxShadow: 24,
  borderRadius: '4px',
};

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export default function ModalComponent({ isOpen, children }: Props) {
  const dispatch = useAppDispatch();
  const showModalLoadingBar = useAppSelector((state) => state.modal.showModalLoadingBar);
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const modalBackgroundColor = mode === 'light' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  function handleCloseModal() {
    dispatch(closeModal());
  }

  return (
    <Modal
      closeAfterTransition
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Grow in={isOpen}>
        <Box sx={{ ...style, backgroundColor: modalBackgroundColor }}>
          <LoadingBar
            isLoading={showModalLoadingBar}
            style={{ borderTopRightRadius: '4px', borderTopLeftRadius: '4px' }}
          />
          <Box sx={{ padding: 4 }}>{children}</Box>
        </Box>
      </Grow>
    </Modal>
  );
}
