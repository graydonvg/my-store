import DialogComponent from './DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog, closeDialog } from '@/lib/redux/slices/dialogSlice';
import SignInForm from '../forms/SignInForm';
import MuiLink from '../ui/MuiLink';
import { Box, useTheme } from '@mui/material';

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
      <Box sx={{ paddingX: { xs: 0, md: 2 } }}>
        <TextButton
          label="sign in"
          labelColor={theme.palette.custom.navbar.upper.text}
          onClick={openSignInDialog}
        />
      </Box>
      <DialogComponent isOpen={isSignInDialogOpen}>
        <SignInForm>
          <MuiLink onClick={openSignUpDialog}>Don&apos;t have an account? Sign Up</MuiLink>
        </SignInForm>
      </DialogComponent>
    </>
  );
}
