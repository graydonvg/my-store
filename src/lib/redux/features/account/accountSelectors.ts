import { RootState } from '../../store';

export function selectAccountFieldToEdit(state: RootState) {
  return state.account.accountFieldToEdit;
}

export function selectIsUpdatingAccount(state: RootState) {
  return state.account.isUpdatingAccount;
}
