import { RootState } from '../../store';

export function selectUserData(state: RootState) {
  return state.user.data;
}
