import { CartItem } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  isCartOpen: boolean;
  cartItems: CartItem[];
};

export const initialState: State = {
  isCartOpen: false,
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIsCartOpen(state, action: PayloadAction<State['isCartOpen']>) {
      state.isCartOpen = action.payload;
    },
    setCartItems(state, action: PayloadAction<State['cartItems']>) {
      state.cartItems = action.payload;
    },
    clearCart(state) {
      state.cartItems = initialState.cartItems;
    },
  },
});

const { actions, reducer } = cartSlice;

export const { setIsCartOpen, setCartItems, clearCart } = actions;

export const cartReducer = reducer;
