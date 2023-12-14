import { combineReducers } from '@reduxjs/toolkit';
import { navDrawerSlice } from './navDrawer/navDrawerSlice';
import { themeSlice } from './theme/themeSlice';
import { dialogSlice } from './dialog/dialogSlice';
import { productFormSlice } from './productForm/productFormSlice';
import { userSlice } from './user/userSlice';
import { cartSlice } from './cart/cartSlice';
import { addressFormSlice } from './addressForm/addressFormSlice';

export const rootReducer = combineReducers({
  productForm: productFormSlice.reducer,
  navDrawer: navDrawerSlice.reducer,
  theme: themeSlice.reducer,
  dialog: dialogSlice.reducer,
  user: userSlice.reducer,
  cart: cartSlice.reducer,
  addressForm: addressFormSlice.reducer,
});
