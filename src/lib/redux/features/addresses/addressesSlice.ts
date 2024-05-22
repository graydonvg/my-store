import { AddressType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  data: AddressType[] | null;
};

const initialState: State = {
  data: null,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setAddresses(state, action: PayloadAction<State['data']>) {
      state.data = action.payload;
    },
  },
});

const { actions, reducer } = addressesSlice;

export const { setAddresses } = actions;

export const addressesReducer = reducer;
