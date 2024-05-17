import { CartItem } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  isCartOpen: boolean;
  cartItems: CartItem[];
  cartItemQuantityWillUpdate: boolean;
};

export const initialState: State = {
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
    setCartItems(state, action: PayloadAction<CartItem[]>) {
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
