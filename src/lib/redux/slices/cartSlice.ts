import { CartItemType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function handleSetCartItemSize(cartItemId: string, size: string, cartItems: CartItemType[]) {
  return cartItems.map((item) => (item?.cartItemId === cartItemId ? { ...item, size } : item));
}

function handleSetCartItemQuantity(cartItemId: string, value: number, cartItems: CartItemType[]) {
  return cartItems.map((item) =>
    item?.cartItemId === cartItemId ? { ...item, quantity: item.quantity + value } : item
  );
}

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
    setCartItemSize(state, action: PayloadAction<{ id: string; size: string }>) {
      const { id, size } = action.payload;
      state.cartItems = handleSetCartItemSize(id, size, state.cartItems);
    },
    setCartItemQuantity(state, action: PayloadAction<{ id: string; value: number }>) {
      const { id, value } = action.payload;
      state.cartItems = handleSetCartItemQuantity(id, value, state.cartItems);
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

export const {
  setIsCartOpen,
  setCartItems,
  setCartItemSize,
  setCartItemQuantity,
  setCartItemQuantityWillUpdate,
  clearCart,
} = actions;

export const cartReducer = reducer;
