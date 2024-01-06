import { CartItemType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function changeCartItemSize(cartItemId: string, size: string, cartItems: CartItemType[]) {
  return cartItems.map((item) => (item?.cartItemId === cartItemId ? { ...item, size } : item));
}

function changeCartItemQuantity(cartItemId: string, value: number, cartItems: CartItemType[]) {
  return cartItems.map((item) =>
    item?.cartItemId === cartItemId ? { ...item, quantity: item.quantity + value } : item
  );
}

type CartState = {
  isCartOpen: {
    top: boolean;
    left: boolean;
    bottom: boolean;
    right: boolean;
  };
  cartItemToEditId: string | null;
  cartItems: CartItemType[];
};

export const initialState: CartState = {
  isCartOpen: {
    top: false,
    left: false,
    bottom: false,
    right: false,
  },
  cartItemToEditId: null,
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
    setCartItemSize(state, action: PayloadAction<{ id: string; size: string }>) {
      const { id, size } = action.payload;
      state.cartItems = changeCartItemSize(id, size, state.cartItems);
    },
    setCartItemQuantity(state, action: PayloadAction<{ id: string; value: number }>) {
      const { id, value } = action.payload;
      state.cartItems = changeCartItemQuantity(id, value, state.cartItems);
    },
    clearCart(state) {
      state.cartItems = initialState.cartItems;
    },
  },
});

const { actions, reducer } = cartSlice;

export const { setIsCartOpen, setCartItems, setCartItemToEditId, setCartItemSize, setCartItemQuantity, clearCart } =
  actions;

export const cartReducer = reducer;
