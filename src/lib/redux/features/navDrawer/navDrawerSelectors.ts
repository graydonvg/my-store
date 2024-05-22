import { RootState } from '../../store';

export function selectIsNavDrawerOpen(state: RootState) {
  return state.navDrawer.isNavDrawerOpen;
}
