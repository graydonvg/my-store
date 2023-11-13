import { DrawerState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function handleDrawer(isOpen: Partial<DrawerState>, isDrawerOpen: DrawerState) {
  return { ...isDrawerOpen, ...isOpen };
}

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

export const navDrawerSlice = createSlice({
  name: 'navDrawer',
  initialState,
  reducers: {
    setIsNavDrawerOpen(state, action: PayloadAction<Partial<DrawerState>>) {
      state.isNavDrawerOpen = handleDrawer(action.payload, state.isNavDrawerOpen);
    },
  },
});

const { actions, reducer } = navDrawerSlice;

export const { setIsNavDrawerOpen } = actions;

export const userReducer = reducer;
