import { UserData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  data: UserData | null;
};

const initialState: State = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<State['data']>) {
      state.data = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const { setUserData } = actions;

export const userReducer = reducer;
