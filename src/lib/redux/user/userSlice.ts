import { CurrentUserType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  currentUser: CurrentUserType | null;
};

const initialState: UserState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<CurrentUserType>) {
      state.currentUser = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setCurrentUser } = actions;

export const userReducer = reducer;
