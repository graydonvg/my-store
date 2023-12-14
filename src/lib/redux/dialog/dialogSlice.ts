import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DialogState = {
  isSignInDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  isUpdateDialogOpen: boolean;
  isAddAddressDialogOpen: boolean;
  showDialogLoadingBar: boolean;
};

const initialState: DialogState = {
  isSignInDialogOpen: false,
  isSignUpDialogOpen: false,
  isUpdateDialogOpen: false,
  isAddAddressDialogOpen: false,
  showDialogLoadingBar: false,
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setIsSignInDialogOpen(state, action: PayloadAction<boolean>) {
      state.isSignInDialogOpen = action.payload;
    },
    setIsSignUpDialogOpen(state, action: PayloadAction<boolean>) {
      state.isSignUpDialogOpen = action.payload;
    },
    setIsUpdateDialogOpen(state, action: PayloadAction<boolean>) {
      state.isUpdateDialogOpen = action.payload;
    },
    setIsAddAddressDialogOpen(state, action: PayloadAction<boolean>) {
      state.isAddAddressDialogOpen = action.payload;
    },
    closeDialog(state) {
      state.isSignInDialogOpen = false;
      state.isSignUpDialogOpen = false;
      state.isUpdateDialogOpen = false;
      state.isAddAddressDialogOpen = false;
    },
    setShowDialogLoadingBar(state, action: PayloadAction<boolean>) {
      state.showDialogLoadingBar = action.payload;
    },
  },
});

const { actions, reducer } = dialogSlice;

export const {
  setIsSignInDialogOpen,
  setIsSignUpDialogOpen,
  setIsUpdateDialogOpen,
  setIsAddAddressDialogOpen,
  closeDialog,
  setShowDialogLoadingBar,
} = actions;

export const userReducer = reducer;
