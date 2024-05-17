'use client';

import { closeDialog, openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import DialogComponent from '../ui/DialogComponent';
import SignInForm from '../forms/SignInForm';
import MuiLink from '../ui/MuiLink';

export default function SignInDialog() {
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector((state) => state.dialog.signInDialog);

  function openSignUpDialog() {
    dispatch(closeDialog());
    dispatch(openDialog('signUpDialog'));
  }

  return (
    <DialogComponent isOpen={isSignInDialogOpen}>
      <SignInForm headerComponent="h2">
        <MuiLink onClick={openSignUpDialog}>Don&apos;t have an account? Sign Up</MuiLink>
      </SignInForm>
    </DialogComponent>
  );
}
