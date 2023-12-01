import { CartItemType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// function checkIfItemExists(itemToCheck: CartItemType, cartItems: CartItemType[]) {
//   return cartItems.find((cartItem) => cartItem.productId === itemToCheck.productId);
// }

// function addCartItem(itemToAdd: CartItemType, cartItems: CartItemType[]): CartItemType[] {
//   const itemExists = checkIfItemExists(itemToAdd, cartItems);

//   if (itemExists) {
//     return cartItems.map((cartItem) =>
//       cartItem.productId === itemToAdd.productId
//         ? {
//             ...cartItem,
//             quantity: cartItem.quantity + itemToAdd.quantity,
//             priceByQuantity: (cartItem.quantity + 1) * cartItem.price,
//             salePriceByQuantity: (cartItem.quantity + 1) * cartItem.salePrice,
//           }
//         : cartItem
//     );
//   }

//   return [
//     ...cartItems,
//     {
//       ...itemToAdd,
//       quantity: itemToAdd.quantity,
//       priceByQuantity: itemToAdd.price * itemToAdd.quantity,
//       salePriceByQuantity: itemToAdd.salePrice * itemToAdd.quantity,
//     },
//   ];
// }

// function removeCartItem(itemToRemove: CartItemType, cartItems: CartItemType[]): CartItemType[] {
//   const itemExists = checkIfItemExists(itemToRemove, cartItems);

//   if (itemExists && itemExists.quantity === 1) {
//     return cartItems.filter((item) => !(item.productId === itemToRemove.productId));
//   }

//   return cartItems.map((cartItem) =>
//     cartItem.productId === itemToRemove.productId
//       ? {
//           ...cartItem,
//           quantity: cartItem.quantity - 1,
//           price_by_quantity: (cartItem.quantity - 1) * cartItem.price,
//           sale_price_by_quantity: (cartItem.quantity - 1) * cartItem.salePrice,
//         }
//       : cartItem
//   );
// }

// function clearCartItem(itemToClear: CartItemType, cartItems: CartItemType[]) {
//   return cartItems.filter((item) => !(item.productId === itemToClear.productId));
// }
type CartState = {
  cartItemToDelete: { id: string };
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
  cartItemToDelete: { id: '' },
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
    setCartItemToDelete(state, action: PayloadAction<{ id: string }>) {
      state.cartItemToDelete = action.payload;
    },
    // addItemToCart(state, action: PayloadAction<CartItemType>) {
    //   state.cartItems = addCartItem(action.payload, state.cartItems);
    // },
    // removeItemFromCart(state, action) {
    //   state.cartItems = removeCartItem(action.payload, state.cartItems);
    // },
    // clearItemFromCart(state, action) {
    //   state.cartItems = clearCartItem(action.payload, state.cartItems);
    // },
    // clearAllItemsFromCart(state) {
    //   state.cartItems = [];
    // },
  },
});

const { actions, reducer } = cartSlice;

export const { setIsCartOpen, setCartItems, setCartItemToDelete, setCartItemToEditId } = actions;

export const cartReducer = reducer;

// addItemToCart, removeItemFromCart, clearItemFromCart, clearAllItemsFromCart
