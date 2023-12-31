import { UpdateAddressTypeStore } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: UpdateAddressTypeStore = {
  address_id: '',
  complex_or_building: '',
  street_address: '',
  suburb: '',
  province: '',
  city: '',
  postal_code: '',
};

export const addressFormSlice = createSlice({
  name: 'addressForm',
  initialState,
  reducers: {
    setAddressFormData: (state, action: PayloadAction<UpdateAddressTypeStore>) => {
      return { ...state, ...action.payload };
    },
    setAddressFormDataOnChange: (
      state,
      action: PayloadAction<{
        field: keyof UpdateAddressTypeStore;
        value: UpdateAddressTypeStore[keyof UpdateAddressTypeStore];
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

export const userReducer = reducer;
