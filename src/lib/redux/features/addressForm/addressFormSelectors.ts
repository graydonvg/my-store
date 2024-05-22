import { RootState } from '../../store';

export function selectAddressFromData(state: RootState) {
  return state.addressForm;
}
