import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isSignInModalOpen: boolean;
  isSignUpModalOpen: boolean;
  isUpdateModalOpen: boolean;
  showModalLoadingBar: boolean;
};

const initialState: ModalState = {
  isSignInModalOpen: false,
  isSignUpModalOpen: false,
  isUpdateModalOpen: false,
  showModalLoadingBar: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsSignInModalOpen(state, action: PayloadAction<boolean>) {
      state.isSignInModalOpen = action.payload;
    },
    setIsSignUpModalOpen(state, action: PayloadAction<boolean>) {
      state.isSignUpModalOpen = action.payload;
    },
    setIsUpdateModalOpen(state, action: PayloadAction<boolean>) {
      state.isUpdateModalOpen = action.payload;
    },
    closeModal(state) {
      state.isSignInModalOpen = false;
      state.isSignUpModalOpen = false;
      state.isUpdateModalOpen = false;
    },
    setShowModalLoadingBar(state, action: PayloadAction<boolean>) {
      state.showModalLoadingBar = action.payload;
    },
  },
});

const { actions, reducer } = modalSlice;

export const { setIsSignInModalOpen, setIsSignUpModalOpen, setIsUpdateModalOpen, closeModal, setShowModalLoadingBar } =
  actions;

export const userReducer = reducer;
