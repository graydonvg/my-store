import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DialogState = {
  isSignInDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  isUpdateDialogOpen: boolean;
  isAddAddressDialogOpen: boolean;
  isDialogLoading: boolean;
};

const initialState: DialogState = {
  isSignInDialogOpen: false,
  isSignUpDialogOpen: false,
  isUpdateDialogOpen: false,
  isAddAddressDialogOpen: false,
  isDialogLoading: false,
};

const dialogSlice = createSlice({
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
    setIsAddressDialogOpen(state, action: PayloadAction<boolean>) {
      state.isAddAddressDialogOpen = action.payload;
    },
    closeDialog(state) {
      state.isSignInDialogOpen = false;
      state.isSignUpDialogOpen = false;
      state.isUpdateDialogOpen = false;
      state.isAddAddressDialogOpen = false;
    },
    setIsDialogLoading(state, action: PayloadAction<boolean>) {
      state.isDialogLoading = action.payload;
    },
  },
});

const { actions, reducer } = dialogSlice;

export const {
  setIsSignInDialogOpen,
  setIsSignUpDialogOpen,
  setIsUpdateDialogOpen,
  setIsAddressDialogOpen,
  closeDialog,
  setIsDialogLoading,
} = actions;

export const dialogReducer = reducer;
