import { DrawerState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateType = {
  isNavDrawerOpen: DrawerState;
};

const initialState: InitialStateType = {
  isNavDrawerOpen: {
    top: false,
    left: false,
    bottom: false,
    right: false,
  },
};

const navDrawerSlice = createSlice({
  name: 'navDrawer',
  initialState,
  reducers: {
    setIsNavDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isNavDrawerOpen.left = action.payload;
    },
  },
});

const { actions, reducer } = navDrawerSlice;

export const { setIsNavDrawerOpen } = actions;

export const navDrawerReducer = reducer;
