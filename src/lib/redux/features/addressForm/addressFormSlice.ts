import { AddressStore } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: AddressStore = {
  addressId: null,
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
    setAddressFormData: (state, action: PayloadAction<AddressStore>) => {
      return { ...state, ...action.payload };
    },
    setAddressFormDataOnChange: (
      state,
      action: PayloadAction<{
        field: keyof AddressStore;
        value: AddressStore[keyof AddressStore];
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
