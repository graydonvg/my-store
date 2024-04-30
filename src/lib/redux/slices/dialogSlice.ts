import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DialogState = {
  signInDialog: boolean;
  signUpDialog: boolean;
  addUserDialog: boolean;
  addNewAddressDialog: boolean;
  updateAddressDialog: boolean;
  isDialogLoading: boolean;
};

const initialState: DialogState = {
  signInDialog: false,
  signUpDialog: false,
  addUserDialog: false,
  addNewAddressDialog: false,
  updateAddressDialog: false,
  isDialogLoading: false,
};

function handleCloseDialog(state: DialogState) {
  const openDialogKey = Object.keys(state).find((key) => state[key as keyof DialogState] === true);

  if (openDialogKey) {
    state[openDialogKey as keyof DialogState] = false;
  } else {
    return;
  }
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog(state, action: PayloadAction<keyof DialogState>) {
      state[action.payload] = true;
    },
    closeDialog(state) {
      handleCloseDialog(state);
    },
    setIsDialogLoading(state, action: PayloadAction<boolean>) {
      state.isDialogLoading = action.payload;
    },
  },
});

const { actions, reducer } = dialogSlice;

export const { openDialog, closeDialog, setIsDialogLoading } = actions;

export const dialogReducer = reducer;
