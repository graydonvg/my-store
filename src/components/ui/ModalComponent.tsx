'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Modal, Grow, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import LoadingBar from './progress/LoadingBar';
import { ReactNode } from 'react';
import useCloseModal from '@/hooks/useCloseModal';

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
  const showModalLoadingBar = useAppSelector((state) => state.modal.showModalLoadingBar);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const modalBackgroundColor = mode === 'light' ? color.grey.light : color.grey.dark;
  const handleCloseModal = useCloseModal();

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
