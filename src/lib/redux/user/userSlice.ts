import { CurrentUserType, UserState } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
