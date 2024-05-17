'use client';

import DialogComponent from './DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog, closeDialog } from '@/lib/redux/features/dialog/dialogSlice';
import SignUpForm from '../forms/SignUpForm';
import MuiLink from '../ui/MuiLink';
import { useTheme } from '@mui/material';

export default function SignUpDialog() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isSignUpDialogOpen = useAppSelector((state) => state.dialog.signUpDialog);

  function openSignUpDialog() {
    dispatch(openDialog('signUpDialog'));
  }

  function openSignInDialog() {
    dispatch(closeDialog());
    dispatch(openDialog('signInDialog'));
  }

  return (
    <>
      <TextButton
        label="sign up"
        onClick={openSignUpDialog}
        sxStyles={{ width: '100px', color: theme.palette.custom.navbar.upper.text, height: 1 }}
      />
      <DialogComponent isOpen={isSignUpDialogOpen}>
        <SignUpForm headerComponent="h2">
          <MuiLink onClick={openSignInDialog}>Already have an account? Sign in</MuiLink>
        </SignUpForm>
      </DialogComponent>
    </>
  );
}
