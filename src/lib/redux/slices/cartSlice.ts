import { CartItemType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartState = {
  isCartOpen: boolean;
  cartItems: CartItemType[];
  cartItemQuantityWillUpdate: boolean;
};

export const initialState: CartState = {
  isCartOpen: false,
  cartItems: [],
  cartItemQuantityWillUpdate: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIsCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
    setCartItems(state, action: PayloadAction<CartItemType[]>) {
      state.cartItems = action.payload;
    },
    setCartItemQuantityWillUpdate(state, action: PayloadAction<boolean>) {
      state.cartItemQuantityWillUpdate = action.payload;
    },
    clearCart(state) {
      state.cartItems = initialState.cartItems;
    },
  },
});

const { actions, reducer } = cartSlice;

export const { setIsCartOpen, setCartItems, setCartItemQuantityWillUpdate, clearCart } = actions;

export const cartReducer = reducer;
