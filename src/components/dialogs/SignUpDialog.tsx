import useColorPalette from '@/hooks/useColorPalette';
import DialogComponent from './DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog, closeDialog } from '@/lib/redux/slices/dialogSlice';
import SignUpForm from '../forms/SignUpForm';
import MuiLink from '../ui/MuiLink';
import { Box } from '@mui/material';

export default function SignUpDialog() {
  const colorPalette = useColorPalette();
  const dispatch = useAppDispatch();
  const isSignUpDialogOpen = useAppSelector((state) => state.dialog.signUpDialog);

  function handleOpenSignUpDialog() {
    dispatch(openDialog('signUpDialog'));
  }

  function handleOpenSignInDialog() {
    dispatch(closeDialog());
    dispatch(openDialog('signInDialog'));
  }

  return (
    <>
      <Box sx={{ paddingX: 2 }}>
        <TextButton
          label="sign up"
          labelColor={colorPalette.navBar.upper.text}
          onClick={handleOpenSignUpDialog}
        />
      </Box>
      <DialogComponent isOpen={isSignUpDialogOpen}>
        <SignUpForm>
          <MuiLink onClick={handleOpenSignInDialog}>Already have an account? Sign in</MuiLink>
        </SignUpForm>
      </DialogComponent>
    </>
  );
}
