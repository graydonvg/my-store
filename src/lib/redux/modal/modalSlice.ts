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
    isSignInModalOpen(state, action: PayloadAction<boolean>) {
      state.isSignInModalOpen = action.payload;
    },
    isSignUpModalOpen(state, action: PayloadAction<boolean>) {
      state.isSignUpModalOpen = action.payload;
    },
    isUpdateModalOpen(state, action: PayloadAction<boolean>) {
      state.isUpdateModalOpen = action.payload;
    },
    setShowModalLoadingBar(state, action: PayloadAction<boolean>) {
      state.showModalLoadingBar = action.payload;
    },
  },
});

const { actions, reducer } = modalSlice;

export const { isSignInModalOpen, isSignUpModalOpen, isUpdateModalOpen, setShowModalLoadingBar } = actions;

export const userReducer = reducer;
