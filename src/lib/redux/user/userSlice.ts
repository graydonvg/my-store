import { CurrentUserType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  isOAuthSignIn: boolean;
  currentUser: CurrentUserType | null;
};

const initialState: UserState = {
  isOAuthSignIn: false,
  currentUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<CurrentUserType | null>) {
      state.currentUser = action.payload;
    },
    setIsOAuthSignIn(state, action: PayloadAction<boolean>) {
      state.isOAuthSignIn = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setCurrentUser, setIsOAuthSignIn } = actions;

export const userReducer = reducer;
