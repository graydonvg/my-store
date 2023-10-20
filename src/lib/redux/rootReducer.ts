import { combineReducers } from '@reduxjs/toolkit';
import { drawerSlice } from './drawer/drawerSlice';
import { themeSlice } from './theme/themeSlice';
import { modalSlice } from './modal/modalSlice';
import { userSlice } from './user/userSlice';
import { addNewProductFormDataSlice } from './addNewProductFormData/addNewProductFormDataSlice';
// import { productsSlice } from './products/productsSlice';

export const rootReducer = combineReducers({
  // products: productsSlice.reducer,
  addNewProductFormData: addNewProductFormDataSlice.reducer,
  drawer: drawerSlice.reducer,
  theme: themeSlice.reducer,
  modal: modalSlice.reducer,
  user: userSlice.reducer,
});
