import { RootState } from '../../store';

export function selectThemeMode(state: RootState) {
  return state.theme.mode;
}
