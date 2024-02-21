import { UserDataType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  isOAuthSignIn: boolean;
  userData: UserDataType | null;
};

const initialState: UserState = {
  isOAuthSignIn: false,
  userData: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserDataType | null>) {
      state.userData = action.payload;
    },
    setIsOAuthSignIn(state, action: PayloadAction<boolean>) {
      state.isOAuthSignIn = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setUserData, setIsOAuthSignIn } = actions;

export const userReducer = reducer;
