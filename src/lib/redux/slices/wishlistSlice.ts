import { WishlistStoreType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type State = {
  wishlistItems: WishlistStoreType[];
};

const initialState: State = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<WishlistStoreType[]>) {
      state.wishlistItems = action.payload;
    },
  },
});

const { actions, reducer } = wishlistSlice;

export const { setWishlistItems } = actions;

export const wishlistReducer = reducer;
