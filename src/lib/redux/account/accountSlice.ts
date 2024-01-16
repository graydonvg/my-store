import { AccountType, PersonalInformationType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  fieldToEdit: string | null;
  isUpdatingAccount: boolean;
  accountData: AccountType;
  personalInformation: PersonalInformationType;
  addressToDeleteId: string | null;
};

const initialState: State = {
  fieldToEdit: null,
  isUpdatingAccount: false,
  accountData: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  personalInformation: {
    firstName: '',
    lastName: '',
    contactNumber: '',
  },
  addressToDeleteId: null,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setFieldToEdit(state, action: PayloadAction<string | null>) {
      state.fieldToEdit = action.payload;
    },
    setIsUpdatingAccount(state, action: PayloadAction<boolean>) {
      state.isUpdatingAccount = action.payload;
    },
    setAccountDataOnChange(
      state,
      action: PayloadAction<{
        field: keyof AccountType;
        value: AccountType[keyof AccountType];
      }>
    ) {
      const { field, value } = action.payload;
      state.accountData = { ...state.accountData, [field]: value };
    },
    setPersonalInformation(state, action: PayloadAction<PersonalInformationType>) {
      state.personalInformation = action.payload;
    },
    setPersonalInformationOnChange: (
      state,
      action: PayloadAction<{
        field: keyof PersonalInformationType;
        value: PersonalInformationType[keyof PersonalInformationType];
      }>
    ) => {
      const { field, value } = action.payload;
      state.personalInformation = { ...state.personalInformation, [field]: value };
    },
    clearPasswordFields(state) {
      state.accountData = initialState.accountData;
    },
    setAddressToDeleteId(state, action: PayloadAction<string | null>) {
      state.addressToDeleteId = action.payload;
    },
  },
});

const { actions, reducer } = accountSlice;

export const {
  setFieldToEdit,
  setIsUpdatingAccount,
  setAccountDataOnChange,
  setPersonalInformation,
  setPersonalInformationOnChange,
  clearPasswordFields,
  setAddressToDeleteId,
} = actions;

export const userReducer = reducer;
