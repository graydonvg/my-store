import { WishlistData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type State = {
  wishlistData: WishlistData[];
};

const initialState: State = {
  wishlistData: [],
};

const wishlistDataSlice = createSlice({
  name: 'wishlistData',
  initialState,
  reducers: {
    setWishlistData(state, action: PayloadAction<WishlistData[]>) {
      state.wishlistData = action.payload;
    },
  },
});

const { actions, reducer } = wishlistDataSlice;

export const { setWishlistData } = actions;

export const wishlistDataReducer = reducer;
