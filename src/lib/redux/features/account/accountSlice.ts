import { UserAccountFieldToEdit } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  fieldToEdit: UserAccountFieldToEdit | null;
  isUpdatingAccount: boolean;
};

const initialState: State = {
  fieldToEdit: null,
  isUpdatingAccount: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountFieldToEdit(state, action: PayloadAction<UserAccountFieldToEdit | null>) {
      state.fieldToEdit = action.payload;
    },
    setIsUpdatingAccount(state, action: PayloadAction<boolean>) {
      state.isUpdatingAccount = action.payload;
    },
  },
});

const { actions, reducer } = accountSlice;

export const { setAccountFieldToEdit, setIsUpdatingAccount } = actions;

export const accountReducer = reducer;
