import { DrawerState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

function handleDrawer(isOpen: Partial<DrawerState>, isDrawerOpen: DrawerState) {
  return { ...isDrawerOpen, ...isOpen };
}

type InitialStateType = {
  isDrawerOpen: DrawerState;
  drawerContent: 'nav' | 'cart' | null;
};

const initialState: InitialStateType = {
  isDrawerOpen: {
    top: false,
    left: false,
    bottom: false,
    right: false,
  },
  drawerContent: null,
};

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setIsDrawerOpen(state, action) {
      state.isDrawerOpen = handleDrawer(action.payload, state.isDrawerOpen);
    },
    setDrawerContent(state, action) {
      state.drawerContent = action.payload;
    },
  },
});

const { actions, reducer } = drawerSlice;

export const { setIsDrawerOpen, setDrawerContent } = actions;

export const userReducer = reducer;
