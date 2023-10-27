import { createSlice } from '@reduxjs/toolkit';

type ModalState = {
  isModalOpen: boolean;
  modalContent: 'signIn' | 'signUp' | null;
};

const initialState: ModalState = {
  isModalOpen: false,
  modalContent: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsModalOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setModalContent(state, action) {
      state.modalContent = action.payload;
    },
  },
});

const { actions, reducer } = modalSlice;

export const { setIsModalOpen, setModalContent } = actions;

export const userReducer = reducer;
