import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type State = {
  savedTotalRowCount: number;
};

const initialState: State = {
  savedTotalRowCount: 0,
};

const dataGridSlice = createSlice({
  name: 'dataGrid',
  initialState,
  reducers: {
    setSavedTotalRowCount(state, action: PayloadAction<number>) {
      state.savedTotalRowCount = action.payload;
    },
  },
});

const { actions, reducer } = dataGridSlice;

export const { setSavedTotalRowCount } = actions;

export const dataGridReducer = reducer;
