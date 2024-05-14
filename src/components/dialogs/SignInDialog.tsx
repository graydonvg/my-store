import DialogComponent from './DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog, closeDialog } from '@/lib/redux/slices/dialogSlice';
import SignInForm from '../forms/SignInForm';
import MuiLink from '../ui/MuiLink';
import { useTheme } from '@mui/material';

export default function SignInDialog() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector((state) => state.dialog.signInDialog);

  function openSignInDialog() {
    dispatch(openDialog('signInDialog'));
  }

  function openSignUpDialog() {
    dispatch(closeDialog());
    dispatch(openDialog('signUpDialog'));
  }

  return (
    <>
      <TextButton
        label="sign in"
        onClick={openSignInDialog}
        sxStyles={{
          width: { xs: 'fit-content', md: '100px' },
          minWidth: 'unset',
          paddingX: { xs: 0, md: 1 },
          color: theme.palette.custom.navbar.upper.text,
          height: { xs: 'auto', md: 1 },
        }}
      />
      <DialogComponent isOpen={isSignInDialogOpen}>
        <SignInForm>
          <MuiLink onClick={openSignUpDialog}>Don&apos;t have an account? Sign Up</MuiLink>
        </SignInForm>
      </DialogComponent>
    </>
  );
}
