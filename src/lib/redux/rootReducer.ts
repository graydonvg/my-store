import { combineReducers } from '@reduxjs/toolkit';
import { drawerSlice } from './drawer/drawerSlice';
import { themeSlice } from './theme/themeSlice';
import { modalSlice } from './modal/modalSlice';
import { addProductSlice } from './addProduct/addProductSlice';
import { userSlice } from './user/userSlice';
import { cartSlice } from './cart/cartSlice';

export const rootReducer = combineReducers({
  addProduct: addProductSlice.reducer,
  drawer: drawerSlice.reducer,
  theme: themeSlice.reducer,
  modal: modalSlice.reducer,
  user: userSlice.reducer,
  cart: cartSlice.reducer,
});
