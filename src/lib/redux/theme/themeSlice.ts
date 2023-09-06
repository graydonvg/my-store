import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

type ThemeState = {
  mode: 'light' | 'dark';
};

const initialState: ThemeState = {
  mode: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

// export const asyncToggleTheme = () => (dispatch: AppDispatch) => {
//   const mode = JSON.parse(localStorage.getItem('mode'));
//   localStorage.setItem('darkMode', !isDarkMode);
//   dispatch(toggleTheme());
// };

const { actions, reducer } = themeSlice;

export const { toggleTheme } = actions;
export const userReducer = reducer;
