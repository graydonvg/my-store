import { createSlice } from '@reduxjs/toolkit';

type State = {
  mode: 'light' | 'dark';
};

const initialState: State = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

const { actions, reducer } = themeSlice;

export const { toggleTheme } = actions;

export const themeReducer = reducer;
