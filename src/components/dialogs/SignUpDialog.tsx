'use client';

import { closeDialog, openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import DialogComponent from '../ui/DialogComponent';
import SignUpForm from '../forms/SignUpForm';
import MuiLink from '../ui/MuiLink';

export default function SignUpDialog() {
  const dispatch = useAppDispatch();
  const isSignUpDialogOpen = useAppSelector((state) => state.dialog.signUpDialog);

  function openSignInDialog() {
    dispatch(closeDialog());
    dispatch(openDialog('signInDialog'));
  }

  return (
    <DialogComponent isOpen={isSignUpDialogOpen}>
      <SignUpForm headerComponent="h2">
        <MuiLink onClick={openSignInDialog}>Already have an account? Sign in</MuiLink>
      </SignUpForm>
    </DialogComponent>
  );
}
