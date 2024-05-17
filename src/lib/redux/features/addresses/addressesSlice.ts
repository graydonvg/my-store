import { AddressType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  data: AddressType[] | null;
  addressToDeleteId: string | null;
};

const initialState: State = {
  data: null,
  addressToDeleteId: null,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setAddresses(state, action: PayloadAction<AddressType[] | null>) {
      state.data = action.payload;
    },
    setAddressToDeleteId(state, action: PayloadAction<string | null>) {
      state.addressToDeleteId = action.payload;
    },
  },
});

const { actions, reducer } = addressesSlice;

export const { setAddresses, setAddressToDeleteId } = actions;

export const addressesReducer = reducer;
