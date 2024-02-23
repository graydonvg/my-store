import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DialogState = {
  isSignInDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  isAddNewAddressDialogOpen: boolean;
  isUpdateAddressDialogOpen: boolean;
  isDialogLoading: boolean;
};

const initialState: DialogState = {
  isSignInDialogOpen: false,
  isSignUpDialogOpen: false,
  isAddNewAddressDialogOpen: false,
  isUpdateAddressDialogOpen: false,
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
    setIsAddNewAddressDialogOpen(state, action: PayloadAction<boolean>) {
      state.isAddNewAddressDialogOpen = action.payload;
    },
    setIsUpdateAddressDialogOpen(state, action: PayloadAction<boolean>) {
      state.isUpdateAddressDialogOpen = action.payload;
    },
    closeDialog(state) {
      state.isSignInDialogOpen = false;
      state.isSignUpDialogOpen = false;
      state.isAddNewAddressDialogOpen = false;
      state.isUpdateAddressDialogOpen = false;
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
  setIsAddNewAddressDialogOpen,
  setIsUpdateAddressDialogOpen,
  closeDialog,
  setIsDialogLoading,
} = actions;

export const dialogReducer = reducer;
