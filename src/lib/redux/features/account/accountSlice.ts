import { UserAccountFieldToEdit } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  accountFieldToEdit: UserAccountFieldToEdit | null;
  isUpdatingAccount: boolean;
};

const initialState: State = {
  accountFieldToEdit: null,
  isUpdatingAccount: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountFieldToEdit(state, action: PayloadAction<State['accountFieldToEdit']>) {
      state.accountFieldToEdit = action.payload;
    },
    setIsUpdatingAccount(state, action: PayloadAction<State['isUpdatingAccount']>) {
      state.isUpdatingAccount = action.payload;
    },
  },
});

const { actions, reducer } = accountSlice;

export const { setAccountFieldToEdit, setIsUpdatingAccount } = actions;

export const accountReducer = reducer;
