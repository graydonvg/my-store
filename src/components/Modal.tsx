'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsModalOpen } from '@/lib/redux/modal/modalSlice';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ReactNode } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type ModalComponentProps = {
  children: ReactNode;
};

export default function ModalComponent({ children }: ModalComponentProps) {
  const isModalOpen = useAppSelector((state) => state.modal.isModalOpen);
  const dispatch = useAppDispatch();

  function handleClose() {
    dispatch(setIsModalOpen(false));
  }

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
}
