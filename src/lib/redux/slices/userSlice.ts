import { UserDataType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type State = {
  data: UserDataType | null;
};

const initialState: State = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserDataType | null>) {
      state.data = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setUserData } = actions;

export const userReducer = reducer;
