import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isSignInModalOpen: boolean;
  isSignUpModalOpen: boolean;
  isUpdateModalOpen: boolean;
  isAddAddressModalOpen: boolean;
  showModalLoadingBar: boolean;
};

const initialState: ModalState = {
  isSignInModalOpen: false,
  isSignUpModalOpen: false,
  isUpdateModalOpen: false,
  isAddAddressModalOpen: false,
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
    setIsAddAddressModalOpen(state, action: PayloadAction<boolean>) {
      state.isAddAddressModalOpen = action.payload;
    },
    closeModal(state) {
      state.isSignInModalOpen = false;
      state.isSignUpModalOpen = false;
      state.isUpdateModalOpen = false;
      state.isAddAddressModalOpen = false;
    },
    setShowModalLoadingBar(state, action: PayloadAction<boolean>) {
      state.showModalLoadingBar = action.payload;
    },
  },
});

const { actions, reducer } = modalSlice;

export const {
  setIsSignInModalOpen,
  setIsSignUpModalOpen,
  setIsUpdateModalOpen,
  setIsAddAddressModalOpen,
  closeModal,
  setShowModalLoadingBar,
} = actions;

export const userReducer = reducer;
