import { ModalContentType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isModalOpen: boolean;
  modalContent: ModalContentType;
  showModalLoadingBar: boolean;
};

const initialState: ModalState = {
  isModalOpen: false,
  modalContent: null,
  showModalLoadingBar: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setModalContent(state, action: PayloadAction<ModalContentType>) {
      state.modalContent = action.payload;
    },
    setShowModalLoadingBar(state, action: PayloadAction<boolean>) {
      state.showModalLoadingBar = action.payload;
    },
  },
});

const { actions, reducer } = modalSlice;

export const { setIsModalOpen, setModalContent, setShowModalLoadingBar } = actions;

export const userReducer = reducer;
