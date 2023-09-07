import { combineReducers } from '@reduxjs/toolkit';
import { drawerSlice } from './drawer/drawerSlice';
import { themeSlice } from './theme/themeSlice';

export const rootReducer = combineReducers({
  drawer: drawerSlice.reducer,
  theme: themeSlice.reducer,
});
