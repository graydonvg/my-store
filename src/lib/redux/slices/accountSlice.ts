import { AccountFieldToEditType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  fieldToEdit: AccountFieldToEditType | null;
  isUpdatingAccount: boolean;
  addressToDeleteId: string | null;
};

const initialState: State = {
  fieldToEdit: null,
  isUpdatingAccount: false,
  addressToDeleteId: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setFieldToEdit(state, action: PayloadAction<AccountFieldToEditType | null>) {
      state.fieldToEdit = action.payload;
    },
    setIsUpdatingAccount(state, action: PayloadAction<boolean>) {
      state.isUpdatingAccount = action.payload;
    },
    setAddressToDeleteId(state, action: PayloadAction<string | null>) {
      state.addressToDeleteId = action.payload;
    },
  },
});

const { actions, reducer } = accountSlice;

export const { setFieldToEdit, setIsUpdatingAccount, setAddressToDeleteId } = actions;

export const accountReducer = reducer;
