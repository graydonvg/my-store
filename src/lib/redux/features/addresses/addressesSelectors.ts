import { RootState } from '../../store';

export function selectAddresses(state: RootState) {
  return state.addresses.data;
}
