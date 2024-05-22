import { createSelector } from 'reselect';
import { RootState } from '../../store';

function selectThemeReducer(state: RootState) {
  return state.theme;
}

export const selectThemeMode = createSelector([selectThemeReducer], (themeSlice) => {
  return themeSlice.mode;
});
