import { CartItemType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartState = {
  isCartOpen: {
    top: boolean;
    left: boolean;
    bottom: boolean;
    right: boolean;
  };
  cartItemToEditId: string;
  cartItems: CartItemType[];
};

export const initialState: CartState = {
  isCartOpen: {
    top: false,
    left: false,
    bottom: false,
    right: false,
  },
  cartItemToEditId: '',
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    setCartItems(state, action: PayloadAction<CartItemType[]>) {
      state.cartItems = action.payload;
    },
    setCartItemToEditId(state, action) {
      state.cartItemToEditId = action.payload;
    },
  },
});

const { actions, reducer } = cartSlice;

export const { setIsCartOpen, setCartItems, setCartItemToEditId } = actions;

export const cartReducer = reducer;
