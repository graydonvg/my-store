import { AddressStore } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: AddressStore = {
  addressId: 0,
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
    clearAddressFormData() {
      return initialState;
    },
  },
});

const { actions, reducer } = addressFormSlice;

export const { setAddressFormData, clearAddressFormData } = actions;

export const addressFormReducer = reducer;
