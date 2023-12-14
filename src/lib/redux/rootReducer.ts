import { combineReducers } from '@reduxjs/toolkit';
import { navDrawerSlice } from './navDrawer/navDrawerSlice';
import { themeSlice } from './theme/themeSlice';
import { dialogSlice } from './dialog/dialogSlice';
import { addProductSlice } from './addProduct/addProductSlice';
import { userSlice } from './user/userSlice';
import { cartSlice } from './cart/cartSlice';

export const rootReducer = combineReducers({
  addProduct: addProductSlice.reducer,
  navDrawer: navDrawerSlice.reducer,
  theme: themeSlice.reducer,
  dialog: dialogSlice.reducer,
  user: userSlice.reducer,
  cart: cartSlice.reducer,
});
