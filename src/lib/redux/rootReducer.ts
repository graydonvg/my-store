import { combineReducers } from '@reduxjs/toolkit';
import { drawerSlice } from './drawer/drawerSlice';
import { themeSlice } from './theme/themeSlice';
import { modalSlice } from './modal/modalSlice';
import { userSlice } from './user/userSlice';

export const rootReducer = combineReducers({
  drawer: drawerSlice.reducer,
  theme: themeSlice.reducer,
  modal: modalSlice.reducer,
  user: userSlice.reducer,
});
