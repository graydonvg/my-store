import { RootState } from '../../store';

export function selectIsDialogLoading(state: RootState) {
  return state.dialog.isDialogLoading;
}

export function selectIsSignInDialogOpen(state: RootState) {
  return state.dialog.signInDialog;
}

export function selectIsSignUpDialogOpen(state: RootState) {
  return state.dialog.signUpDialog;
}

export function selectIsAddAddressDialogOpen(state: RootState) {
  return state.dialog.addAddressDialog;
}

export function selectIsUpdateAddressDialogOpen(state: RootState) {
  return state.dialog.updateAddressDialog;
}

export function selectIsAddUserDialogOpen(state: RootState) {
  return state.dialog.addUserDialog;
}
