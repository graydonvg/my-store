import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DialogComponent from './DialogComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsSignInDialogOpen, setIsSignUpDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import SignInForm from '../forms/SignInForm';
import MuiLink from '../ui/MuiLink';

export default function SignInDialog() {
  const customColorPalette = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { isSignInDialogOpen } = useAppSelector((state) => state.dialog);

  function handleOpenSignInDialog() {
    dispatch(setIsSignInDialogOpen(true));
  }

  function handleOpenSignUpDialog() {
    dispatch(closeDialog());
    dispatch(setIsSignUpDialogOpen(true));
  }

  return (
    <>
      <TextButton
        label="sign in"
        labelColor={customColorPalette.navBar.upper.text}
        onClick={handleOpenSignInDialog}
      />
      <DialogComponent isOpen={isSignInDialogOpen}>
        <SignInForm>
          <MuiLink onClick={handleOpenSignUpDialog}>Don&apos;t have an account? Sign Up</MuiLink>
        </SignInForm>
      </DialogComponent>
    </>
  );
}
