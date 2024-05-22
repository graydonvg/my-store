import { WishlistData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  wishlistData: WishlistData[];
};

const initialState: State = {
  wishlistData: [],
};

const wishlistDataSlice = createSlice({
  name: 'wishlistData',
  initialState,
  reducers: {
    setWishlistData(state, action: PayloadAction<State['wishlistData']>) {
      state.wishlistData = action.payload;
    },
  },
});

const { actions, reducer } = wishlistDataSlice;

export const { setWishlistData } = actions;

export const wishlistDataReducer = reducer;
