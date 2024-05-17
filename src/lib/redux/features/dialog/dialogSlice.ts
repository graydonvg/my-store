import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  signInDialog: boolean;
  signUpDialog: boolean;
  addUserDialog: boolean;
  addAddressDialog: boolean;
  updateAddressDialog: boolean;
  isDialogLoading: boolean;
};

const initialState: State = {
  signInDialog: false,
  signUpDialog: false,
  addUserDialog: false,
  addAddressDialog: false,
  updateAddressDialog: false,
  isDialogLoading: false,
};

function handleCloseDialog(state: State) {
  const openDialogKey = Object.keys(state).find((key) => state[key as keyof State] === true);

  if (openDialogKey) {
    state[openDialogKey as keyof State] = false;
  } else {
    return;
  }
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog(state, action: PayloadAction<keyof State>) {
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
