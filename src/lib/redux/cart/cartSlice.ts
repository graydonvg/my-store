import { CartItemType } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

function checkIfItemExists(itemToCheck: CartItemType, cartItems: CartItemType[]) {
  return cartItems.find((cartItem) => cartItem.id === itemToCheck.id);
}

function addCartItem(itemToAdd: CartItemType, cartItems: CartItemType[]): CartItemType[] {
  const itemExists = checkIfItemExists(itemToAdd, cartItems);

  if (itemExists) {
    return cartItems.map((cartItem) =>
      cartItem.id === itemToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1, priceByQuantity: (cartItem.quantity + 1) * cartItem.price }
        : cartItem
    );
  }

  return [...cartItems, { ...itemToAdd, quantity: 1, priceByQuantity: itemToAdd.price }];
}

function removeCartItem(itemToRemove: CartItemType, cartItems: CartItemType[]): CartItemType[] {
  const itemExists = checkIfItemExists(itemToRemove, cartItems);

  if (itemExists && itemExists.quantity === 1) {
    return cartItems.filter((item) => !(item.id === itemToRemove.id));
  }

  return cartItems.map((cartItem) =>
    cartItem.id === itemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1, priceByQuantity: (cartItem.quantity - 1) * cartItem.price }
      : cartItem
  );
}

function clearCartItem(itemToClear: CartItemType, cartItems: CartItemType[]) {
  return cartItems.filter((item) => !(item.id === itemToClear.id));
}

type CartState = {
  isCartOpen: boolean;
  cartItems: CartItemType[];
};

export const CART_INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: CART_INITIAL_STATE,
  reducers: {
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    addItemToCart(state, action) {
      state.cartItems = addCartItem(action.payload, state.cartItems);
    },
    removeItemFromCart(state, action) {
      state.cartItems = removeCartItem(action.payload, state.cartItems);
    },
    clearItemFromCart(state, action) {
      state.cartItems = clearCartItem(action.payload, state.cartItems);
    },
    clearAllItemsFromCart(state) {
      state.cartItems = [];
    },
  },
});

const { actions, reducer } = cartSlice;

export const { setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart, clearAllItemsFromCart } = actions;

export const cartReducer = reducer;
