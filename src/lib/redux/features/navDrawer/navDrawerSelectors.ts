import { createSelector } from 'reselect';
import { RootState } from '../../store';

function selectNavDrawerReducer(state: RootState) {
  return state.navDrawer;
}

export const selectIsNavDrawerOpen = createSelector([selectNavDrawerReducer], (navDrawerSlice) => {
  return navDrawerSlice.isNavDrawerOpen;
});
