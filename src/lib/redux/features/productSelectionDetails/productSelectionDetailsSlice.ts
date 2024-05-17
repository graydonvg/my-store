import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  quantity: number;
  size: string | null;
};

const initialState: State = {
  quantity: 1,
  size: null,
};

const productSelectionDetailsSlice = createSlice({
  name: 'productSelectionDetails',
  initialState,
  reducers: {
    incrementQuantity(state) {
      state.quantity++;
    },
    decrementQuantity(state) {
      if (state.quantity !== 1) {
        state.quantity--;
      }
    },
    setSize(state, action: PayloadAction<string>) {
      if (state.size !== action.payload) {
        state.size = action.payload;
      } else {
        state.size = null;
      }
    },
    resetProductSelectionDetails() {
      return initialState;
    },
  },
});

const { actions, reducer } = productSelectionDetailsSlice;

export const { incrementQuantity, decrementQuantity, setSize, resetProductSelectionDetails } = actions;

export const productSelectionDetailsReducer = reducer;
