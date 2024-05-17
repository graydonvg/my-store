import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isNavDrawerOpen: false,
};

const navDrawerSlice = createSlice({
  name: 'navDrawer',
  initialState,
  reducers: {
    setIsNavDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isNavDrawerOpen = action.payload;
    },
  },
});

const { actions, reducer } = navDrawerSlice;

export const { setIsNavDrawerOpen } = actions;

export const navDrawerReducer = reducer;
