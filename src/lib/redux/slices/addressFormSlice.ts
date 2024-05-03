import { AddressTypeStore } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: AddressTypeStore = {
  addressId: '',
  recipientFirstName: '',
  recipientLastName: '',
  recipientContactNumber: '',
  complexOrBuilding: '',
  streetAddress: '',
  suburb: '',
  province: '',
  city: '',
  postalCode: '',
};

const addressFormSlice = createSlice({
  name: 'addressForm',
  initialState,
  reducers: {
    setAddressFormData: (state, action: PayloadAction<AddressTypeStore>) => {
      return { ...state, ...action.payload };
    },
    setAddressFormDataOnChange: (
      state,
      action: PayloadAction<{
        field: keyof AddressTypeStore;
        value: AddressTypeStore[keyof AddressTypeStore];
      }>
    ) => {
      const { field, value } = action.payload;
      return { ...state, [field]: value };
    },
    clearAddressFormData() {
      return initialState;
    },
  },
});

const { actions, reducer } = addressFormSlice;

export const { setAddressFormData, setAddressFormDataOnChange, clearAddressFormData } = actions;

export const addressFormReducer = reducer;
