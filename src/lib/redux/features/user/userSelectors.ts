import { createSelector } from 'reselect';
import { RootState } from '../../store';

function selectUserReducer(state: RootState) {
  return state.user;
}

export const selectUserData = createSelector([selectUserReducer], (userSlice) => {
  return userSlice.data;
});
