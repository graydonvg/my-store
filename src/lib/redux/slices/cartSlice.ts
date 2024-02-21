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

type CartItemToEditIdType = string | null;

type CartState = {
  isCartOpen: boolean;
  cartItemToEditId: CartItemToEditIdType;
  cartItems: CartItemType[];
};

export const initialState: CartState = {
  isCartOpen: false,
  cartItemToEditId: null,
  cartItems: [],
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
    setCartItemToEditId(state, action: PayloadAction<CartItemToEditIdType>) {
      state.cartItemToEditId = action.payload;
    },
    setCartItemSize(state, action: PayloadAction<{ id: string; size: string }>) {
      const { id, size } = action.payload;
      state.cartItems = handleSetCartItemSize(id, size, state.cartItems);
    },
    setCartItemQuantity(state, action: PayloadAction<{ id: string; value: number }>) {
      const { id, value } = action.payload;
      state.cartItems = handleSetCartItemQuantity(id, value, state.cartItems);
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
