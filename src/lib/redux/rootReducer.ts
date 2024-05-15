import { combineReducers } from '@reduxjs/toolkit';
import { navDrawerReducer } from './slices/navDrawerSlice';
import { themeReducer } from './slices/themeSlice';
import { dialogReducer } from './slices/dialogSlice';
import { productFormReducer } from './slices/productFormSlice';
import { cartReducer } from './slices/cartSlice';
import { addressFormReducer } from './slices/addressFormSlice';
import { accountReducer } from './slices/accountSlice';
import { checkoutDataReducer } from './slices/checkoutDataSlice';
import { productSelectionDetailsReducer } from './slices/productSelectionDetailsSlice';
import { userReducer } from './slices/userSlice';
import { productImagesReducer } from './slices/productImagesSlice';
import { wishlistDataReducer } from './slices/wishlistDataSlice';
import { addressesReducer } from './slices/addressesSlice';

export const rootReducer = combineReducers({
  productForm: productFormReducer,
  productImages: productImagesReducer,
  navDrawer: navDrawerReducer,
  theme: themeReducer,
  dialog: dialogReducer,
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistDataReducer,
  addressForm: addressFormReducer,
  account: accountReducer,
  checkoutData: checkoutDataReducer,
  productSelectionDetails: productSelectionDetailsReducer,
  addresses: addressesReducer,
});
