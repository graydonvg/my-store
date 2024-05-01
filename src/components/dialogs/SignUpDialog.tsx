import DialogComponent from './DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog, closeDialog } from '@/lib/redux/slices/dialogSlice';
import SignUpForm from '../forms/SignUpForm';
import MuiLink from '../ui/MuiLink';
import { Box, useTheme } from '@mui/material';

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
      <Box sx={{ paddingX: 2 }}>
        <TextButton
          label="sign up"
          labelColor={theme.palette.custom.navbar.upper.text}
          onClick={openSignUpDialog}
        />
      </Box>
      <DialogComponent isOpen={isSignUpDialogOpen}>
        <SignUpForm>
          <MuiLink onClick={openSignInDialog}>Already have an account? Sign in</MuiLink>
        </SignUpForm>
      </DialogComponent>
    </>
  );
}
