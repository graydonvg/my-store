import { UserData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type State = {
  data: UserData | null;
};

const initialState: State = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserData | null>) {
      state.data = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setUserData } = actions;

export const userReducer = reducer;