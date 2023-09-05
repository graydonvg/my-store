import { DrawerState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

function handleDrawer(isOpen: Partial<DrawerState>, isDrawerOpen: DrawerState) {
  return { ...isDrawerOpen, ...isOpen };
}

const initialState = {
  isDrawerOpen: {
    top: false,
    left: false,
    bottom: false,
    right: false,
  },
};

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setIsDrawerOpen(state, action) {
      state.isDrawerOpen = handleDrawer(action.payload, state.isDrawerOpen);
    },
  },
});

const { actions, reducer } = drawerSlice;

export const { setIsDrawerOpen } = actions;

export const userReducer = reducer;
