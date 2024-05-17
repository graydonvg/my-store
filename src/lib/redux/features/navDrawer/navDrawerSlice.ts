import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  isNavDrawerOpen: boolean;
};

const initialState: State = {
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
