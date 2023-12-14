import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DialogComponent from '../ui/DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsSignInDialogOpen, setIsSignUpDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import SignUpForm from '../forms/SignUpForm';
import MuiLink from '../ui/MuiLink';

export default function SignUpDialog() {
  const customColorPalette = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { isSignUpDialogOpen } = useAppSelector((state) => state.dialog);

  function handleOpenSignUpDialog() {
    dispatch(setIsSignUpDialogOpen(true));
  }

  function handleOpenSignInDialog() {
    dispatch(closeDialog());
    dispatch(setIsSignInDialogOpen(true));
  }

  return (
    <>
      <TextButton
        label="sign up"
        labelColor={customColorPalette.grey.light}
        onClick={handleOpenSignUpDialog}
      />
      <DialogComponent isOpen={isSignUpDialogOpen}>
        <SignUpForm>
          <MuiLink onClick={handleOpenSignInDialog}>Already have an account? Sign in</MuiLink>
        </SignUpForm>
      </DialogComponent>
    </>
  );
}
