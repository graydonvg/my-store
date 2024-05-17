import { combineReducers } from '@reduxjs/toolkit';
import { navDrawerReducer } from './features/navDrawer/navDrawerSlice';
import { themeReducer } from './features/theme/themeSlice';
import { dialogReducer } from './features/dialog/dialogSlice';
import { productFormReducer } from './features/productForm/productFormSlice';
import { cartReducer } from './features/cart/cartSlice';
import { addressFormReducer } from './features/addressForm/addressFormSlice';
import { accountReducer } from './features/account/accountSlice';
import { checkoutReducer } from './features/checkout/checkoutSlice';
import { productSelectionDetailsReducer } from './features/productSelectionDetails/productSelectionDetailsSlice';
import { userReducer } from './features/user/userSlice';
import { productImagesReducer } from './features/productImages/productImagesSlice';
import { wishlistDataReducer } from './features/wishlistData/wishlistDataSlice';
import { addressesReducer } from './features/addresses/addressesSlice';

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
  checkout: checkoutReducer,
  productSelectionDetails: productSelectionDetailsReducer,
  addresses: addressesReducer,
});
