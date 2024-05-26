import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  cartItemToEditId: number | null;
  cartItemQuantityWillUpdate: boolean;
  isUpdatingCartItemQuantity: boolean;
  isUpdatingCartItemSize: boolean;
  isRemovingCartItem: boolean;
  isMovingToWishlist: boolean;
};

const initialState: State = {
  cartItemToEditId: null,
  cartItemQuantityWillUpdate: false,
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
    setCartItemQuantityWillUpdate(state, action: PayloadAction<State['cartItemQuantityWillUpdate']>) {
      state.cartItemQuantityWillUpdate = action.payload;
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
  setCartItemQuantityWillUpdate,
  setIsUpdatingCartItemQuantity,
  setIsUpdatingCartItemSize,
  setIsRemovingCartItem,
  setIsMovingToWishlist,
} = actions;

export const editCartItemDrawerReducer = reducer;
