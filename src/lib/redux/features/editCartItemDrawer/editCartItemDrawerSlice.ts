import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  cartItemToEditId: string | null;
  isUpdatingCartItemQuantity: boolean;
  isUpdatingCartItemSize: boolean;
  isRemovingCartItem: boolean;
  isMovingToWishlist: boolean;
};

const initialState: State = {
  cartItemToEditId: null,
  isUpdatingCartItemQuantity: false,
  isUpdatingCartItemSize: false,
  isRemovingCartItem: false,
  isMovingToWishlist: false,
};

const editCartItemDrawerSlice = createSlice({
  name: 'editCartItemDrawer',
  initialState,
  reducers: {
    setCartItemToEditId(state, action: PayloadAction<State['cartItemToEditId']>) {
      state.cartItemToEditId = action.payload;
    },
    setIsUpdatingCartItemQuantity(state, action: PayloadAction<State['isUpdatingCartItemQuantity']>) {
      state.isUpdatingCartItemQuantity = action.payload;
    },
    setIsUpdatingCartItemSize(state, action: PayloadAction<State['isUpdatingCartItemSize']>) {
      state.isUpdatingCartItemSize = action.payload;
    },
    setIsRemovingCartItem(state, action: PayloadAction<State['isRemovingCartItem']>) {
      state.isRemovingCartItem = action.payload;
    },
    setIsMovingToWishlist(state, action: PayloadAction<State['isMovingToWishlist']>) {
      state.isMovingToWishlist = action.payload;
    },
  },
});

const { actions, reducer } = editCartItemDrawerSlice;

export const {
  setCartItemToEditId,
  setIsUpdatingCartItemQuantity,
  setIsUpdatingCartItemSize,
  setIsRemovingCartItem,
  setIsMovingToWishlist,
} = actions;

export const editCartItemDrawerReducer = reducer;
