import { ProductData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  data: ProductData[] | null;
};

const initialState: State = {
  data: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<State['data']>) {
      state.data = action.payload;
    },
  },
});

const { actions, reducer } = productsSlice;

export const { setProducts } = actions;

export const productsReducer = reducer;
